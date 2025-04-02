
import React from 'react';
import { TenderTemplateType } from '@/types/enums';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileTemplate } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateType: string) => void;
}

interface TemplateOption {
  value: string;
  label: string;
  standard: string;
  description: string;
}

// Template options - enhanced with Kenya standards
const templateOptions: TemplateOption[] = [
  { 
    value: TenderTemplateType.STANDARD, 
    label: "Standard Procurement", 
    standard: "PPADA 2015",
    description: "Basic tender template"
  },
  { 
    value: TenderTemplateType.CONSTRUCTION, 
    label: "Construction Projects", 
    standard: "NCA & PPADA",
    description: "For construction projects"
  },
  { 
    value: TenderTemplateType.IT_SERVICES, 
    label: "IT Services & Systems", 
    standard: "ICTA & PPADA",
    description: "For IT services procurement"
  },
  { 
    value: TenderTemplateType.CONSULTING, 
    label: "Consulting Services", 
    standard: "PPADA Reg. 2020",
    description: "For consulting services"
  },
  { 
    value: TenderTemplateType.SUPPLIES, 
    label: "Goods & Supplies", 
    standard: "PPADA Standard",
    description: "For goods and supplies"
  },
  { 
    value: TenderTemplateType.MEDICAL, 
    label: "Medical & Healthcare", 
    standard: "MoH & PPADA",
    description: "For medical equipment & services"
  },
  { 
    value: TenderTemplateType.CUSTOM, 
    label: "Custom Template", 
    standard: "PPADA Compliant",
    description: "Create your own template"
  },
];

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10">
            <FileTemplate className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Template Selection</CardTitle>
            <CardDescription>
              Choose a template to speed up the tender creation process
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templateOptions.map((template) => (
            <div 
              key={template.value}
              className={cn(
                "cursor-pointer border rounded-lg p-4 transition-all hover:shadow-md",
                selectedTemplate === template.value 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onTemplateChange(template.value)}
            >
              <h3 className="font-medium mb-1">{template.label}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {template.description}
              </p>
              <div className="text-xs inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 font-semibold">
                Standard: {template.standard}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
