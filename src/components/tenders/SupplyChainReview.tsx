
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface SupplyChainReviewProps {
  tenderId: string;
  initialRemarks?: string;
  initialStatus?: 'pending' | 'approved' | 'revision_required';
  isSupplyChainProfessional: boolean;
}

const SupplyChainReview = ({ 
  tenderId, 
  initialRemarks = '', 
  initialStatus = 'pending',
  isSupplyChainProfessional 
}: SupplyChainReviewProps) => {
  const { toast } = useToast();
  const [remarks, setRemarks] = useState(initialRemarks);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  const handleSaveRemarks = async () => {
    if (!isSupplyChainProfessional) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only supply chain professionals can review tenders",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('tender_reviews')
        .upsert({
          tender_id: tenderId,
          supply_chain_remarks: remarks,
          supply_chain_status: status,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'tender_id'
        });

      if (error) throw error;

      toast({
        title: "Review Saved",
        description: "Your professional review has been recorded",
      });
    } catch (error: any) {
      console.error('Error saving review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save review",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Approved</span>
          </div>
        );
      case 'revision_required':
        return (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Revision Required</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <FileText className="w-4 h-4 mr-1" />
            <span>Pending Review</span>
          </div>
        );
    }
  };

  if (!isSupplyChainProfessional) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Professional Review</CardTitle>
          <CardDescription>
            This tender is currently under review by a supply chain professional
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStatusBadge()}
          {remarks && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-1">Professional remarks:</h4>
              <p className="text-sm text-gray-700">{remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Chain Professional Review</CardTitle>
        <CardDescription>
          Provide your professional assessment of this tender according to Kenya procurement laws
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Review Status</label>
            <div className="flex space-x-2">
              <Button 
                variant={status === 'pending' ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatus('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={status === 'approved' ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatus('approved')}
              >
                Approved
              </Button>
              <Button 
                variant={status === 'revision_required' ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatus('revision_required')}
              >
                Needs Revision
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Professional Remarks</label>
            <Textarea
              placeholder="Enter your professional assessment and recommendations based on Kenya procurement laws..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Reference specific sections of the Public Procurement and Asset Disposal Act if applicable
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveRemarks} disabled={saving}>
          {saving ? 'Saving...' : 'Save Professional Review'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupplyChainReview;
