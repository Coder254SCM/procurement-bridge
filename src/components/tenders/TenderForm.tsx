import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentUploadService } from '@/services/DocumentUploadService';
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { TenderTemplateType, ProcurementMethod, UserRole } from '@/types/enums';
import { EvaluationCriteria, RequiredDocument } from '@/types/database.types';
import { kenyaStatutoryDocuments } from './RequiredDocumentsList';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

// Import form sections
import TemplateSelector from './TemplateSelector';
import BasicDetailsForm from './BasicDetailsForm';
import ProcuringEntityForm from './ProcuringEntityForm';
import TenderDataSheetForm from './TenderDataSheetForm';
import DocumentsUploadForm from './DocumentsUploadForm';
import ScheduleOfRequirements, { ScheduleItem } from './ScheduleOfRequirements';
import TechnicalSpecificationsForm, { TechnicalSpec } from './TechnicalSpecificationsForm';
import PriceScheduleForm, { PriceItem } from './PriceScheduleForm';
import EvaluationCriteriaForm from './EvaluationCriteriaForm';
import DeclarationsForm, { Declaration, ConflictOfInterest, defaultDeclarations, defaultConflicts } from './DeclarationsForm';
import FinalReviewForm from './FinalReviewForm';
import AuctionSettingsForm from './AuctionSettingsForm';
import ProcurementMethodSettings from './ProcurementMethodSettings';

// Form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  template_type: z.string().optional(),
  budget_amount: z.coerce.number().positive({ message: "Budget must be a positive number." }),
  budget_currency: z.string().default("KES"),
  submission_deadline: z.date({ required_error: "Please select a deadline date." }),
  evaluation_criteria: z.record(z.string(), z.number()).optional(),
  procurement_method: z.string().optional(),
  required_documents: z.array(z.string()).optional(),
  supply_chain_reviewer: z.string().optional(),
  // New fields
  tender_number: z.string().optional(),
  financial_year: z.string().optional(),
  procurement_category: z.string().optional(),
  agpo_reservation: z.string().optional(),
  issue_date: z.date().optional(),
  opening_date: z.date().optional(),
  earliest_delivery_date: z.date().optional(),
  latest_delivery_date: z.date().optional(),
  validity_period: z.string().optional(),
  // Procuring entity
  pe_organisation_name: z.string().optional(),
  pe_physical_address: z.string().optional(),
  pe_town: z.string().optional(),
  pe_po_box: z.string().optional(),
  pe_telephone: z.string().optional(),
  pe_procurement_email: z.string().optional(),
  pe_website: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_designation: z.string().optional(),
  contact_person_email: z.string().optional(),
  submission_method: z.string().optional(),
  physical_submission_address: z.string().optional(),
  // TDS
  tds_foreign_currency_allowed: z.string().optional(),
  tds_alternative_tenders: z.string().optional(),
  tds_number_of_lots: z.string().optional(),
  tds_lot_count: z.string().optional(),
  tds_award_criteria: z.string().optional(),
  tds_bid_security_required: z.string().optional(),
  tds_bid_security_amount: z.string().optional(),
  tds_bid_security_validity: z.string().optional(),
  tds_special_conditions: z.string().optional(),
  // Technical
  tech_eval_method: z.string().optional(),
  tech_min_score: z.string().optional(),
  tech_eval_notes: z.string().optional(),
  // Auction
  auction_reserve_price: z.string().optional(),
  auction_min_decrement: z.string().optional(),
  auction_duration_hours: z.string().optional(),
  auction_extension_minutes: z.string().optional(),
  auction_interval_seconds: z.string().optional(),
});

const categoryOptions = [
  "Construction", "IT Services", "Office Supplies", "Consulting",
  "Manufacturing", "Healthcare", "Transportation", "Energy",
  "Agriculture", "Education", "Other"
];

const defaultEvaluationCriteria: EvaluationCriteria = {
  technical: 30, financial: 30, experience: 15, compliance: 15, delivery: 10,
};

const STEPS = [
  { key: 'details', label: 'Tender Details', desc: 'Basic identification and classification' },
  { key: 'entity', label: 'Procuring Entity', desc: 'Organisation details and contact information' },
  { key: 'tds', label: 'Tender Data Sheet', desc: 'Override standard ITT clauses and conditions' },
  { key: 'documents', label: 'Mandatory Docs', desc: 'Required eligibility documents' },
  { key: 'schedule', label: 'Schedule of Req.', desc: 'Line items: goods, works, or services' },
  { key: 'specs', label: 'Technical Specs', desc: 'Technical specifications and evaluation' },
  { key: 'pricing', label: 'Price Schedule', desc: 'Itemised pricing with taxes and levies' },
  { key: 'evaluation', label: 'Evaluation Weights', desc: 'Bid evaluation criteria allocation' },
  { key: 'declarations', label: 'Declarations', desc: 'Statutory declarations and disclosures' },
  { key: 'review', label: 'Review & Submit', desc: 'Review all sections before submission' },
];

interface TenderFormProps {
  userId: string;
}

const TenderForm = ({ userId }: TenderFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [contractDocuments, setContractDocuments] = useState<File[]>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria>(defaultEvaluationCriteria);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [digitalSignature, setDigitalSignature] = useState<boolean>(false);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>(kenyaStatutoryDocuments);
  const [supplyChainReviewers, setSupplyChainReviewers] = useState<{id: string, name: string}[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // New state for additional sections
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{
    id: crypto.randomUUID(), unspsc_code: '', description: '', unit_of_issue: 'Each (EA)', quantity: 1, delivery_location: '', delivery_timeline: '',
  }]);
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpec[]>([{
    id: crypto.randomUUID(), description: '', required_standard: '', compliance_type: 'mandatory',
  }]);
  const [priceItems, setPriceItems] = useState<PriceItem[]>([{
    id: crypto.randomUUID(), description: '', unit: 'Each', quantity: 1, unit_price: 0, vat_applicable: 'yes_16',
  }]);
  const [declarations, setDeclarations] = useState<Declaration[]>(defaultDeclarations);
  const [conflicts, setConflicts] = useState<ConflictOfInterest[]>(defaultConflicts);

  // Fetch supply chain reviewers
  useEffect(() => {
    const fetchReviewers = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', UserRole.SUPPLY_CHAIN_PROFESSIONAL);
      if (!error && data) {
        const userIds = data.map(item => item.user_id);
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, company_name')
            .in('id', userIds);
          if (!profilesError && profilesData) {
            setSupplyChainReviewers(profilesData.map(p => ({
              id: p.id, name: p.full_name || p.company_name || 'Unknown Reviewer'
            })));
          }
        }
      }
    };
    fetchReviewers();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", description: "", category: "",
      template_type: TenderTemplateType.STANDARD,
      budget_amount: undefined, budget_currency: "KES",
      submission_deadline: undefined,
      procurement_method: ProcurementMethod.OPEN_TENDER,
      required_documents: requiredDocuments.filter(doc => doc.required).map(doc => doc.id),
      supply_chain_reviewer: "",
      tender_number: "", financial_year: "",
      procurement_category: "", agpo_reservation: "none",
      validity_period: "91",
      submission_method: "electronic",
      tds_foreign_currency_allowed: "not_allowed",
      tds_alternative_tenders: "not_allowed",
      tds_number_of_lots: "one",
      tds_award_criteria: "lowest_evaluated",
      tds_bid_security_required: "no",
      tech_eval_method: "pass_fail",
    },
  });

  const handleTemplateChange = (templateType: string) => {
    form.setValue('template_type', templateType);
    switch (templateType) {
      case TenderTemplateType.CONSTRUCTION:
        setTemplateContent('Standard construction tender template following NCA standards...');
        setEvaluationCriteria({ technical: 35, financial: 25, experience: 20, compliance: 10, delivery: 10, quality: 0 });
        break;
      case TenderTemplateType.IT_SERVICES:
        setTemplateContent('IT services procurement template following ICT Authority guidelines...');
        setEvaluationCriteria({ technical: 40, financial: 25, experience: 15, compliance: 5, delivery: 5, innovation: 5, support: 5 });
        break;
      default:
        setTemplateContent('Standard tender template compliant with applicable procurement regulations.');
        setEvaluationCriteria(defaultEvaluationCriteria);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const handleContractDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setContractDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (index: number) => setDocuments(prev => prev.filter((_, i) => i !== index));
  const removeContractFile = (index: number) => setContractDocuments(prev => prev.filter((_, i) => i !== index));

  const handleCriteriaChange = (criterion: string, value: number) => {
    setEvaluationCriteria(prev => {
      const updated = { ...prev, [criterion]: value };
      form.setValue('evaluation_criteria', Object.fromEntries(
        Object.entries(updated).filter(([_, v]) => v !== undefined)
      ));
      return updated;
    });
  };

  const handleToggleRequiredDocument = (docId: string) => {
    setRequiredDocuments(prevDocs => {
      const updated = prevDocs.map(doc => doc.id === docId ? { ...doc, required: !doc.required } : doc);
      form.setValue('required_documents', updated.filter(doc => doc.required).map(doc => doc.id));
      return updated;
    });
  };

  const generateDigitalSignature = (): string => {
    return window.btoa(`${userId}:${new Date().toISOString()}`);
  };

  // Price totals for review
  const priceTotals = useMemo(() => {
    let subtotal = 0, totalVat = 0;
    priceItems.forEach(item => {
      const line = item.quantity * item.unit_price;
      subtotal += line;
      if (item.vat_applicable === 'yes_16') totalVat += line * 0.16;
    });
    return { subtotal, capacityLevy: subtotal * 0.0003, totalVat, grandTotal: subtotal + subtotal * 0.0003 + totalVat };
  }, [priceItems]);

  const isTotalEvaluationCriteria100 = Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) === 100;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const signatureData = digitalSignature ? generateDigitalSignature() : null;
      const signatureTimestamp = digitalSignature ? new Date().toISOString() : null;
      const evaluationCriteriaObject = Object.fromEntries(
        Object.entries(evaluationCriteria).filter(([_, v]) => v !== undefined)
      );

      const { data, error } = await supabase
        .from('tenders')
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          budget_amount: values.budget_amount,
          budget_currency: values.budget_currency,
          submission_deadline: values.submission_deadline.toISOString(),
          buyer_id: userId,
          status: 'draft',
          template_type: values.template_type,
          procurement_method: values.procurement_method,
          evaluation_criteria: evaluationCriteriaObject,
          digital_signature: signatureData,
          signature_timestamp: signatureTimestamp,
          required_documents: values.required_documents,
          supply_chain_reviewer_id: values.supply_chain_reviewer || null,
        })
        .select('id')
        .single();

      if (error) throw error;

      if (data?.id) {
        const tenderId = data.id;

        // Submit to blockchain
        const blockchainResult = await fabricClient.submitTender(tenderId, {
          title: values.title,
          description: values.description.substring(0, 100),
          category: values.category,
          budget_amount: values.budget_amount,
          buyer_id: userId,
          submission_deadline: values.submission_deadline.toISOString(),
          digital_signature: signatureData,
          signature_timestamp: signatureTimestamp,
          procurement_method: values.procurement_method,
        });

        if (blockchainResult.success && blockchainResult.txId) {
          await supabase.from('tenders').update({ blockchain_hash: blockchainResult.txId }).eq('id', tenderId);
          toast({ title: "Tender Created", description: "Your tender has been created and recorded on the blockchain." });
        } else {
          toast({ title: "Tender Created", description: "Your tender has been created. Blockchain recording will be retried." });
        }

        // Supply chain review record
        if (values.supply_chain_reviewer) {
          await supabase.from('tender_reviews').insert({
            tender_id: tenderId,
            supply_chain_reviewer_id: values.supply_chain_reviewer,
            supply_chain_status: 'pending',
            created_at: new Date().toISOString(),
          });
        }

        // Upload documents
        if (documents.length > 0 || contractDocuments.length > 0) {
          try {
            const uploadResult = await DocumentUploadService.uploadTenderDocuments(data.id, userId, documents, contractDocuments);
            await supabase.from('tenders').update({
              documents: { supporting: uploadResult.supporting, contract: uploadResult.contract }
            }).eq('id', data.id);
          } catch (uploadError) {
            console.error('Document upload error:', uploadError);
          }
        }
      }

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating tender:', error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to create tender." });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const goToStep = (step: number) => {
    if (step >= 0 && step < STEPS.length) setCurrentStep(step);
  };

  const summaryData = currentStep === STEPS.length - 1 ? {
    title: form.watch('title'),
    tenderNumber: form.watch('tender_number') || '',
    financialYear: form.watch('financial_year') || '',
    procurementMethod: form.watch('procurement_method') || '',
    procurementCategory: form.watch('procurement_category') || '',
    category: form.watch('category'),
    budgetAmount: form.watch('budget_amount'),
    budgetCurrency: form.watch('budget_currency'),
    submissionDeadline: form.watch('submission_deadline'),
    openingDate: form.watch('opening_date'),
    validityPeriod: form.watch('validity_period') || '91',
    agpoReservation: form.watch('agpo_reservation') || 'none',
    peOrganisation: form.watch('pe_organisation_name') || '',
    contactPerson: form.watch('contact_person_name') || '',
    contactDesignation: form.watch('contact_person_designation') || '',
    contactEmail: form.watch('contact_person_email') || '',
    submissionMethod: form.watch('submission_method') || 'electronic',
    awardCriteria: form.watch('tds_award_criteria') || 'lowest_evaluated',
    foreignCurrency: form.watch('tds_foreign_currency_allowed') || 'not_allowed',
    alternativeTenders: form.watch('tds_alternative_tenders') || 'not_allowed',
    numberOfLots: form.watch('tds_number_of_lots') || 'one',
    scheduleItemsCount: scheduleItems.filter(i => i.description).length,
    techSpecsCount: technicalSpecs.filter(s => s.description).length,
    priceItemsCount: priceItems.filter(p => p.description).length,
    declarationsChecked: declarations.filter(d => d.checked).length,
    declarationsTotal: declarations.length,
    requiredDocsCount: requiredDocuments.filter(d => d.required).length,
    totalDocsCount: requiredDocuments.length,
    grandTotal: priceTotals.grandTotal,
  } : undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar Stepper */}
          <aside className="lg:sticky lg:top-20 self-start">
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider">RFQ Sections</h3>
              </div>
              <ul className="divide-y divide-border">
                {STEPS.map((step, idx) => (
                  <li
                    key={step.key}
                    onClick={() => goToStep(idx)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm border-l-3",
                      idx === currentStep && "bg-primary/5 border-l-primary text-primary font-semibold border-l-[3px]",
                      idx < currentStep && "text-primary/70 border-l-[3px] border-l-primary/40",
                      idx > currentStep && "text-muted-foreground hover:bg-muted/50 border-l-transparent border-l-[3px]"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0",
                      idx === currentStep && "bg-primary text-primary-foreground",
                      idx < currentStep && "bg-primary/60 text-primary-foreground",
                      idx > currentStep && "bg-muted text-muted-foreground"
                    )}>
                      {idx < currentStep ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    {step.label}
                  </li>
                ))}
              </ul>
              <div className="px-4 py-3 bg-primary/5 border-t border-border">
                <div className="flex justify-between text-xs font-medium text-primary mb-1.5">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            {/* Step Header */}
            <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-7 py-5">
              <h2 className="text-xl font-semibold">{STEPS[currentStep].label}</h2>
              <p className="text-sm opacity-85 mt-1">{STEPS[currentStep].desc}</p>
            </div>

            {/* Step Content */}
            <div>
              {currentStep === 0 && (
                <div className="space-y-6">
                  <TemplateSelector
                    selectedTemplate={form.watch('template_type')}
                    onTemplateChange={handleTemplateChange}
                  />
                  <BasicDetailsForm
                    form={form}
                    categoryOptions={categoryOptions}
                    supplyChainReviewers={supplyChainReviewers}
                    templateContent={templateContent}
                  />
                  <ProcurementMethodSettings
                    form={form}
                    procurementMethod={form.watch('procurement_method') || ''}
                  />
                  <AuctionSettingsForm
                    form={form}
                    procurementMethod={form.watch('procurement_method') || ''}
                  />
                </div>
              )}
              {currentStep === 1 && <ProcuringEntityForm form={form} />}
              {currentStep === 2 && <TenderDataSheetForm form={form} />}
              {currentStep === 3 && (
                <DocumentsUploadForm
                  requiredDocuments={requiredDocuments}
                  documents={documents}
                  contractDocuments={contractDocuments}
                  onToggleRequiredDocument={handleToggleRequiredDocument}
                  onFileChange={handleFileChange}
                  onContractDocumentChange={handleContractDocumentChange}
                  removeFile={removeFile}
                  removeContractFile={removeContractFile}
                />
              )}
              {currentStep === 4 && (
                <ScheduleOfRequirements items={scheduleItems} onItemsChange={setScheduleItems} />
              )}
              {currentStep === 5 && (
                <TechnicalSpecificationsForm form={form} specs={technicalSpecs} onSpecsChange={setTechnicalSpecs} />
              )}
              {currentStep === 6 && (
                <PriceScheduleForm items={priceItems} onItemsChange={setPriceItems} currency={form.watch('budget_currency') || 'KES'} />
              )}
              {currentStep === 7 && (
                <EvaluationCriteriaForm evaluationCriteria={evaluationCriteria} onCriteriaChange={handleCriteriaChange} />
              )}
              {currentStep === 8 && (
                <DeclarationsForm
                  declarations={declarations}
                  onDeclarationsChange={setDeclarations}
                  conflicts={conflicts}
                  onConflictsChange={setConflicts}
                />
              )}
              {currentStep === 9 && (
                <FinalReviewForm
                  digitalSignature={digitalSignature}
                  onDigitalSignatureChange={() => setDigitalSignature(!digitalSignature)}
                  submitting={submitting}
                  onCancel={() => navigate('/dashboard')}
                  isFormValid={isTotalEvaluationCriteria100}
                  summaryData={summaryData}
                />
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                className={cn(
                  "px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                  currentStep === 0 ? "invisible" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                ← Back
              </button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep + 1)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Next →
                </button>
              ) : (
                <div /> // Submit button is in FinalReviewForm
              )}
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
};

export default TenderForm;
