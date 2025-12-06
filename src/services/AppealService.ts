import { supabase } from '@/integrations/supabase/client';

export interface ProcurementAppeal {
  id: string;
  tender_id: string;
  appellant_id: string;
  appellant_type: 'supplier' | 'consortium';
  appeal_type: 'bid_evaluation' | 'award_decision' | 'tender_cancellation' | 'disqualification' | 'specification_dispute' | 'other';
  appeal_grounds: string;
  supporting_evidence: any[];
  appeal_date: string;
  standstill_triggered: boolean;
  response_deadline?: string;
  buyer_response?: string;
  buyer_response_date?: string;
  decision?: 'upheld' | 'dismissed' | 'partially_upheld' | 'pending';
  decision_date?: string;
  decision_rationale?: string;
  remedial_actions?: any[];
  escalated_to_pparb: boolean;
  pparb_reference_number?: string;
  status: 'submitted' | 'under_review' | 'awaiting_response' | 'decided' | 'escalated' | 'closed';
}

export interface AppealTimelineEvent {
  id: string;
  appeal_id: string;
  event_type: string;
  event_description: string;
  event_by?: string;
  event_date: string;
  documents: any[];
  is_public: boolean;
}

/**
 * Service for handling procurement appeals
 * Per PPRA 2015 Part XIII - Review and Complaints
 * 14-day standstill period, 21-day response deadline
 */
class AppealService {
  // File a new appeal
  async fileAppeal(appeal: {
    tender_id: string;
    appellant_id: string;
    appellant_type: 'supplier' | 'consortium';
    appeal_type: ProcurementAppeal['appeal_type'];
    appeal_grounds: string;
    supporting_evidence?: any[];
  }): Promise<ProcurementAppeal> {
    // Calculate response deadline (21 days per PPRA)
    const responseDeadline = new Date();
    responseDeadline.setDate(responseDeadline.getDate() + 21);

    const { data, error } = await supabase
      .from('procurement_appeals')
      .insert({
        tender_id: appeal.tender_id,
        appellant_id: appeal.appellant_id,
        appellant_type: appeal.appellant_type,
        appeal_type: appeal.appeal_type,
        appeal_grounds: appeal.appeal_grounds,
        supporting_evidence: appeal.supporting_evidence || [],
        standstill_triggered: true,
        response_deadline: responseDeadline.toISOString(),
        status: 'submitted'
      })
      .select()
      .single() as any;
    
    if (error) throw error;

    // Add timeline event
    await this.addTimelineEvent(data.id, {
      event_type: 'appeal_filed',
      event_description: `Appeal filed against ${appeal.appeal_type.replace('_', ' ')}. Response deadline: ${responseDeadline.toLocaleDateString()}.`,
      event_by: appeal.appellant_id,
      is_public: true
    });

    return data;
  }

  // Get appeals for a tender
  async getTenderAppeals(tenderId: string): Promise<ProcurementAppeal[]> {
    const { data, error } = await supabase
      .from('procurement_appeals')
      .select('*')
      .eq('tender_id', tenderId)
      .order('appeal_date', { ascending: false }) as any;
    
    if (error) throw error;
    return data || [];
  }

  // Get appellant's appeals
  async getMyAppeals(appellantId: string): Promise<ProcurementAppeal[]> {
    const { data, error } = await supabase
      .from('procurement_appeals')
      .select(`
        *,
        tenders (
          title,
          reference_number,
          status
        )
      `)
      .eq('appellant_id', appellantId)
      .order('appeal_date', { ascending: false }) as any;
    
    if (error) throw error;
    return data || [];
  }

  // Submit buyer response
  async submitBuyerResponse(
    appealId: string,
    response: string,
    responderId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('procurement_appeals')
      .update({
        buyer_response: response,
        buyer_response_date: new Date().toISOString(),
        buyer_response_by: responderId,
        status: 'under_review'
      })
      .eq('id', appealId) as any;
    
    if (error) throw error;

    await this.addTimelineEvent(appealId, {
      event_type: 'buyer_response',
      event_description: 'Procuring entity has submitted a response to the appeal.',
      event_by: responderId,
      is_public: true
    });
  }

  // Make decision on appeal
  async makeDecision(
    appealId: string,
    decision: 'upheld' | 'dismissed' | 'partially_upheld',
    rationale: string,
    remedialActions: any[],
    deciderId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('procurement_appeals')
      .update({
        decision,
        decision_date: new Date().toISOString(),
        decision_rationale: rationale,
        remedial_actions: remedialActions,
        status: 'decided'
      })
      .eq('id', appealId) as any;
    
    if (error) throw error;

    const decisionText = {
      upheld: 'Appeal UPHELD - Remedial actions ordered.',
      dismissed: 'Appeal DISMISSED - Original decision stands.',
      partially_upheld: 'Appeal PARTIALLY UPHELD - Some remedial actions ordered.'
    };

    await this.addTimelineEvent(appealId, {
      event_type: 'decision_made',
      event_description: decisionText[decision],
      event_by: deciderId,
      is_public: true
    });
  }

  // Escalate to PPARB (Public Procurement Administrative Review Board)
  async escalateToPPARB(
    appealId: string,
    pparbReference: string,
    appellantId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('procurement_appeals')
      .update({
        escalated_to_pparb: true,
        pparb_reference_number: pparbReference,
        status: 'escalated'
      })
      .eq('id', appealId) as any;
    
    if (error) throw error;

    await this.addTimelineEvent(appealId, {
      event_type: 'pparb_escalation',
      event_description: `Appeal escalated to PPARB. Reference: ${pparbReference}`,
      event_by: appellantId,
      is_public: true
    });
  }

  // Get appeal timeline
  async getAppealTimeline(appealId: string): Promise<AppealTimelineEvent[]> {
    const { data, error } = await supabase
      .from('appeal_timeline')
      .select('*')
      .eq('appeal_id', appealId)
      .order('event_date', { ascending: true }) as any;
    
    if (error) throw error;
    return data || [];
  }

  // Add timeline event
  private async addTimelineEvent(appealId: string, event: {
    event_type: string;
    event_description: string;
    event_by?: string;
    documents?: any[];
    is_public?: boolean;
  }): Promise<void> {
    const { error } = await supabase
      .from('appeal_timeline')
      .insert({
        appeal_id: appealId,
        event_type: event.event_type,
        event_description: event.event_description,
        event_by: event.event_by,
        documents: event.documents || [],
        is_public: event.is_public ?? false
      }) as any;
    
    if (error) console.error('Failed to add timeline event:', error);
  }

  // Check if tender is in standstill period
  async isTenderInStandstill(tenderId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('procurement_appeals')
      .select('id, standstill_triggered, status')
      .eq('tender_id', tenderId)
      .eq('standstill_triggered', true)
      .in('status', ['submitted', 'under_review', 'awaiting_response']) as any;
    
    if (error) throw error;
    return (data?.length || 0) > 0;
  }
}

export const appealService = new AppealService();
