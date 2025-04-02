
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { TenderTemplateType, ProcurementMethod } from '@/types/enums';
import { EvaluationCriteria, RequiredDocument } from '@/types/database.types';
import { kenyaStatutoryDocuments } from './RequiredDocumentsList';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Import the new component modules
import TemplateSelector from './TemplateSelector';
import BasicDetailsForm from './BasicDetailsForm';
import DocumentsUploadForm from './DocumentsUploadForm';
import EvaluationCriteriaForm from './EvaluationCriteriaForm';
import FinalReviewForm from './FinalReviewForm';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  template_type: z.string().optional(),
  budget_amount: z.coerce.number().positive({
    message: "Budget must be a positive number.",
  }),
  budget_currency: z.string().default("KES"),
  submission_deadline: z.date({
    required_error: "Please select a deadline date.",
  }),
  evaluation_criteria: z.record(z.string(), z.number()).optional(),
  procurement_method: z.string().optional(),
  required_documents: z.array(z.string()).optional(),
  supply_chain_reviewer: z.string().optional(),
});

// Industry/Category options
const categoryOptions = [
  "Construction",
  "IT Services",
  "Office Supplies",
  "Consulting",
  "Manufacturing",
  "Healthcare",
  "Transportation",
  "Energy",
  "Agriculture",
  "Education",
  "Other"
];

// Default evaluation criteria
const defaultEvaluationCriteria: EvaluationCriteria = {
  technical: 30,
  financial: 30,
  experience: 15,
  compliance: 15,
  delivery: 10,
};

interface TenderFormProps {
  userId: string;
}

const TenderForm = ({ userId }: TenderFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [contractDocuments, setContractDocuments] = useState<File[]>([]);
  const [useTemplate, setUseTemplate] = useState(false);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria>(defaultEvaluationCriteria);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [digitalSignature, setDigitalSignature] = useState<boolean>(false);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>(kenyaStatutoryDocuments);
  const [supplyChainReviewers, setSupplyChainReviewers] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState('details');

  // Get available supply chain reviewers
  useEffect(() => {
    const fetchSupplyChainReviewers = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', UserRole.SUPPLY_CHAIN_PROFESSIONAL);
        
      if (!error && data) {
        const userIds = data.map(item => item.user_id);
        
        // Fetch profile information for these users
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, company_name')
            .in('id', userIds);
            
          if (!profilesError && profilesData) {
            const reviewers = profilesData.map(profile => ({
              id: profile.id,
              name: profile.full_name || profile.company_name || 'Unknown Reviewer'
            }));
            setSupplyChainReviewers(reviewers);
          }
        }
      }
    };
    
    fetchSupplyChainReviewers();
  }, []);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      template_type: TenderTemplateType.STANDARD,
      budget_amount: undefined,
      budget_currency: "KES",
      submission_deadline: undefined,
      evaluation_criteria: defaultEvaluationCriteria,
      procurement_method: ProcurementMethod.OPEN_TENDER,
      required_documents: requiredDocuments.filter(doc => doc.required).map(doc => doc.id),
      supply_chain_reviewer: "",
    },
  });

  // Handle template selection
  const handleTemplateChange = (templateType: string) => {
    form.setValue('template_type', templateType);
    
    // Set template content based on selection
    switch (templateType) {
      case TenderTemplateType.CONSTRUCTION:
        setTemplateContent('Standard construction tender template following Kenya Public Procurement and Asset Disposal Act requirements and National Construction Authority standards...');
        // Use updater function to set state based on previous state
        setEvaluationCriteria(() => ({
          technical: 35,
          financial: 25,
          experience: 20,
          compliance: 10,
          quality: 10,
        }));
        break;
      case TenderTemplateType.IT_SERVICES:
        setTemplateContent('IT services procurement template following ICT Authority guidelines and PPADA compliance standards...');
        // Use updater function to set state based on previous state
        setEvaluationCriteria(() => ({
          technical: 40,
          financial: 25,
          experience: 15,
          innovation: 10,
          support: 10,
        }));
        break;
      // Add more template types here
      default:
        setTemplateContent('Standard tender template compliant with the Public Procurement and Asset Disposal Act (PPADA) 2015 and the Public Procurement and Asset Disposal Regulations 2020.');
        setEvaluationCriteria(defaultEvaluationCriteria);
    }
    
    // Update form evaluation criteria
    form.setValue('evaluation_criteria', evaluationCriteria);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...filesArray]);
    }
  };

  const handleContractDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setContractDocuments(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeContractFile = (index: number) => {
    setContractDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCriteriaChange = (criterion: string, value: number) => {
    setEvaluationCriteria(prev => ({
      ...prev,
      [criterion]: value
    }));
    
    // Update form value
    form.setValue('evaluation_criteria', {
      ...evaluationCriteria,
      [criterion]: value
    });
  };

  const handleToggleRequiredDocument = (docId: string) => {
    setRequiredDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === docId) {
          return { ...doc, required: !doc.required };
        }
        return doc;
      });
      
      // Update form value
      form.setValue('required_documents', 
        updatedDocs.filter(doc => doc.required).map(doc => doc.id)
      );
      
      return updatedDocs;
    });
  };

  // Generate a simple digital signature (in real world, this would use proper digital signature standards)
  const generateDigitalSignature = (): string => {
    const timestamp = new Date().toISOString();
    const userSignature = `${userId}:${timestamp}`;
    
    // In a real implementation, this would use cryptographic signing
    return window.btoa(userSignature);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    
    try {
      const signatureData = digitalSignature ? generateDigitalSignature() : null;
      const signatureTimestamp = digitalSignature ? new Date().toISOString() : null;
      
      // Insert tender data
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
          evaluation_criteria: values.evaluation_criteria || evaluationCriteria,
          digital_signature: signatureData,
          signature_timestamp: signatureTimestamp,
          required_documents: values.required_documents,
          supply_chain_reviewer_id: values.supply_chain_reviewer || null,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Submit to blockchain
      if (data && data.id) {
        const tenderId = data.id;
        
        // Submit tender to blockchain
        const blockchainResult = await fabricClient.submitTender(tenderId, {
          title: values.title,
          description: values.description.substring(0, 100), // Limit description length for blockchain
          category: values.category,
          budget_amount: values.budget_amount,
          buyer_id: userId,
          submission_deadline: values.submission_deadline.toISOString(),
          digital_signature: signatureData,
          signature_timestamp: signatureTimestamp,
          procurement_method: values.procurement_method,
        });
        
        if (blockchainResult.success && blockchainResult.txId) {
          // Update tender with blockchain hash
          await supabase
            .from('tenders')
            .update({ blockchain_hash: blockchainResult.txId })
            .eq('id', tenderId);
            
          toast({
            title: "Tender Created",
            description: "Your tender has been created and recorded on the blockchain.",
          });
        } else {
          toast({
            title: "Tender Created",
            description: "Your tender has been created, but blockchain recording failed. It will be retried automatically.",
          });
        }

        // Create supply chain review record if a reviewer is assigned
        if (values.supply_chain_reviewer) {
          await supabase
            .from('tender_reviews')
            .insert({
              tender_id: tenderId,
              supply_chain_reviewer_id: values.supply_chain_reviewer,
              supply_chain_status: 'pending',
              created_at: new Date().toISOString(),
            });
        }
      }
      
      // TODO: Handle document uploads to Supabase storage
      
      // Navigate to tender view or dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating tender:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create tender. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if the evaluation criteria total is 100%
  const isTotalEvaluationCriteria100 = Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) === 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-12">
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
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
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6 pt-4">
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
            </TabsContent>
            
            <TabsContent value="evaluation" className="space-y-6 pt-4">
              <EvaluationCriteriaForm 
                evaluationCriteria={evaluationCriteria}
                onCriteriaChange={handleCriteriaChange}
              />
            </TabsContent>
            
            <TabsContent value="review" className="space-y-6 pt-4">
              <FinalReviewForm 
                digitalSignature={digitalSignature}
                onDigitalSignatureChange={() => setDigitalSignature(!digitalSignature)}
                submitting={submitting}
                onCancel={() => navigate('/dashboard')}
                isFormValid={isTotalEvaluationCriteria100}
              />
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
};

export default TenderForm;
