
import React from 'react';
import { Check, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'statutory' | 'technical' | 'financial' | 'experience' | 'compliance';
}

// Kenya procurement law required documents
export const kenyaStatutoryDocuments: RequiredDocument[] = [
  {
    id: 'business_registration',
    name: 'Business Registration Certificate',
    description: 'Certificate of Incorporation or Business Registration Certificate issued by the Registrar of Companies.',
    required: true,
    category: 'statutory'
  },
  {
    id: 'tax_compliance',
    name: 'Tax Compliance Certificate',
    description: 'Valid Tax Compliance Certificate from Kenya Revenue Authority (KRA).',
    required: true,
    category: 'statutory'
  },
  {
    id: 'cr12',
    name: 'CR12 Form',
    description: 'Company Registry Form CR12 showing directors/shareholders (for limited companies).',
    required: true,
    category: 'statutory'
  },
  {
    id: 'nca',
    name: 'NCA Registration',
    description: 'National Construction Authority (NCA) Certificate (for construction tenders).',
    required: false,
    category: 'statutory'
  },
  {
    id: 'agpo',
    name: 'AGPO Certificate',
    description: 'Access to Government Procurement Opportunities (AGPO) Certificate if applicable.',
    required: false,
    category: 'statutory'
  },
  {
    id: 'nssf',
    name: 'NSSF Compliance',
    description: 'National Social Security Fund (NSSF) Compliance Certificate.',
    required: true,
    category: 'statutory'
  },
  {
    id: 'nhif',
    name: 'NHIF Compliance',
    description: 'National Hospital Insurance Fund (NHIF) Compliance Certificate.',
    required: true,
    category: 'statutory'
  }
];

interface RequiredDocumentsListProps {
  documents: RequiredDocument[];
  uploadedDocuments?: string[];
  editable?: boolean;
  onToggleRequired?: (docId: string) => void;
}

const RequiredDocumentsList = ({ 
  documents, 
  uploadedDocuments = [],
  editable = false,
  onToggleRequired 
}: RequiredDocumentsListProps) => {
  const groupedDocuments = documents.reduce((acc, doc) => {
    const category = doc.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, RequiredDocument[]>);

  const categories = {
    statutory: 'Statutory Documents',
    technical: 'Technical Documents',
    financial: 'Financial Documents',
    experience: 'Experience Documents',
    compliance: 'Compliance Documents'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Required Documents
        </CardTitle>
        <CardDescription>
          Documents required from suppliers as per Kenya Public Procurement and Asset Disposal Act
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium capitalize">
                {(categories as any)[category] || category}
              </h3>
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-start justify-between p-2 rounded-md border bg-background">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">{doc.name}</span>
                        {doc.required ? (
                          <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">{doc.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                    </div>
                    
                    {editable ? (
                      <button
                        onClick={() => onToggleRequired && onToggleRequired(doc.id)}
                        className="p-1 rounded-full hover:bg-secondary"
                      >
                        {doc.required ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center">
                        {uploadedDocuments.includes(doc.id) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : doc.required ? (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequiredDocumentsList;
