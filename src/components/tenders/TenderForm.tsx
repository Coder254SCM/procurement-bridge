
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Upload, FileCheck, ListFilter } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { TenderTemplateType } from '@/types/enums';
import { EvaluationCriteria } from '@/types/database.types';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

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

// Template options
const templateOptions = [
  { value: TenderTemplateType.STANDARD, label: "Standard Procurement" },
  { value: TenderTemplateType.CONSTRUCTION, label: "Construction Projects" },
  { value: TenderTemplateType.IT_SERVICES, label: "IT Services & Systems" },
  { value: TenderTemplateType.CONSULTING, label: "Consulting Services" },
  { value: TenderTemplateType.SUPPLIES, label: "Goods & Supplies" },
  { value: TenderTemplateType.MEDICAL, label: "Medical & Healthcare" },
  { value: TenderTemplateType.CUSTOM, label: "Custom Template" },
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
  const [useTemplate, setUseTemplate] = useState(false);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria>(defaultEvaluationCriteria);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [digitalSignature, setDigitalSignature] = useState<boolean>(false);

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
    },
  });

  // Handle template selection
  const handleTemplateChange = (templateType: string) => {
    form.setValue('template_type', templateType);
    
    // Set template content based on selection
    switch (templateType) {
      case TenderTemplateType.CONSTRUCTION:
        setTemplateContent('Standard construction tender template following Kenyan PPD Act requirements...');
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
        setTemplateContent('IT services procurement template following ICTA guidelines...');
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
        setTemplateContent('');
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

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
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
          evaluation_criteria: values.evaluation_criteria || evaluationCriteria,
          digital_signature: signatureData,
          signature_timestamp: signatureTimestamp,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-12">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
              <CardDescription>
                Choose a template to speed up the tender creation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templateOptions.map((template) => (
                  <div 
                    key={template.value}
                    className={cn(
                      "cursor-pointer border rounded-lg p-4 transition-all",
                      form.watch('template_type') === template.value 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleTemplateChange(template.value)}
                  >
                    <h3 className="font-medium mb-1">{template.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.value === TenderTemplateType.STANDARD && "Basic tender template"}
                      {template.value === TenderTemplateType.CONSTRUCTION && "For construction projects"}
                      {template.value === TenderTemplateType.IT_SERVICES && "For IT services procurement"}
                      {template.value === TenderTemplateType.CONSULTING && "For consulting services"}
                      {template.value === TenderTemplateType.SUPPLIES && "For goods and supplies"}
                      {template.value === TenderTemplateType.MEDICAL && "For medical equipment & services"}
                      {template.value === TenderTemplateType.CUSTOM && "Create your own template"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tender Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Supply of Office Equipment" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear and concise title for your tender request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category that best describes your tender.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="budget_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="budget_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="KES" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="submission_deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Submission Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The deadline for suppliers to submit their bids.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a detailed description of the goods or services required..." 
                  className="min-h-[150px]" 
                  value={templateContent ? `${templateContent}\n\n${field.value}` : field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Include specifications, requirements, delivery terms, and any other relevant details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListFilter className="mr-2 h-5 w-5" />
              Evaluation Criteria
            </CardTitle>
            <CardDescription>
              Define how bids will be evaluated by allocating percentage weights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm mb-4">
                Total allocation must equal 100%. Adjust the sliders to set the importance of each criterion.
              </p>
              
              {Object.entries(evaluationCriteria).map(([criterion, weight]) => (
                <div key={criterion} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium capitalize">{criterion}</label>
                    <span className="text-sm">{weight}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={weight} 
                    onChange={(e) => handleCriteriaChange(criterion, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="flex justify-between pt-4 border-t">
                <span className="font-medium">Total:</span>
                <span className={
                  Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) === 100 
                    ? "font-medium" 
                    : "font-medium text-destructive"
                }>
                  {Object.values(evaluationCriteria).reduce((a, b) => a + b, 0)}%
                </span>
              </div>
              
              {Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) !== 100 && (
                <p className="text-sm text-destructive">
                  Criteria weights must sum to exactly 100%.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="documents">Supporting Documents (Optional)</FormLabel>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX, JPG, PNG (MAX. 5MB each)
                    </p>
                  </div>
                  <input
                    id="document-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Attached Documents</h3>
              <ul className="space-y-2">
                {documents.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="digital-signature" 
            checked={digitalSignature}
            onChange={() => setDigitalSignature(!digitalSignature)}
            className="rounded border-gray-300"
          />
          <label htmlFor="digital-signature" className="text-sm">
            Add digital signature and blockchain timestamp
          </label>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting || Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) !== 100}
          >
            {submitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Creating...
              </>
            ) : (
              'Create Tender'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TenderForm;
