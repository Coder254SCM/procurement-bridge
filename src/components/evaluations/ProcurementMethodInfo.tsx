
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeCheck, ShieldAlert, ChevronsUpDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcurementMethodInfoProps {
  method: string;
  description?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

const ProcurementMethodInfo = ({
  method,
  description = '',
  riskLevel = 'medium',
}: ProcurementMethodInfoProps) => {
  const getMethodDetails = (methodType: string) => {
    switch (methodType.toLowerCase()) {
      case 'open_tender':
      case 'open tender':
        return {
          title: 'Open Tender',
          description: 'Competitive process open to all qualified bidders',
          icon: <ChevronsUpDown className="h-5 w-5" />,
          risk: 'low',
          riskText: 'Low Risk',
          riskColor: 'bg-green-100 text-green-800',
          useCases: [
            'Standard goods and services procurement',
            'When multiple suppliers are available',
            'For high-value contracts requiring transparency',
          ],
        };

      case 'restricted_tender':
      case 'restricted tender':
        return {
          title: 'Restricted Tender',
          description: 'Limited to pre-qualified suppliers only',
          icon: <BadgeCheck className="h-5 w-5" />,
          risk: 'medium',
          riskText: 'Medium Risk',
          riskColor: 'bg-amber-100 text-amber-800',
          useCases: [
            'Specialized equipment or services',
            'When supplier pre-qualification is necessary',
            'For technical and complex requirements',
          ],
        };

      case 'direct_procurement':
      case 'direct procurement':
        return {
          title: 'Direct Procurement',
          description: 'Single-source procurement without competition',
          icon: <ShieldAlert className="h-5 w-5" />,
          risk: 'high',
          riskText: 'High Risk',
          riskColor: 'bg-red-100 text-red-800',
          useCases: [
            'Emergency situations requiring immediate action',
            'When only one supplier can provide the requirement',
            'For very low-value purchases',
          ],
        };

      case 'request_for_proposal':
      case 'request for proposal':
        return {
          title: 'Request for Proposal (RFP)',
          description: 'Detailed solutions sought from qualified suppliers',
          icon: <FileText className="h-5 w-5" />,
          risk: 'medium',
          riskText: 'Medium Risk',
          riskColor: 'bg-amber-100 text-amber-800',
          useCases: [
            'Complex projects requiring creative solutions',
            'When evaluation criteria go beyond price',
            'For consulting services and technical solutions',
          ],
        };

      default:
        return {
          title: method,
          description: description || 'Standard procurement method',
          icon: <FileText className="h-5 w-5" />,
          risk: riskLevel || 'medium',
          riskText: riskLevel === 'low' ? 'Low Risk' : riskLevel === 'high' ? 'High Risk' : 'Medium Risk',
          riskColor: riskLevel === 'low' ? 'bg-green-100 text-green-800' : 
                    riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                    'bg-amber-100 text-amber-800',
          useCases: [
            'Standard procurement process',
            'Follows organization procurement policy',
            'Subject to regular compliance checks',
          ],
        };
    }
  };

  const methodDetails = getMethodDetails(method);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10">
              {methodDetails.icon}
            </div>
            <div>
              <CardTitle>{methodDetails.title}</CardTitle>
              <CardDescription>{methodDetails.description}</CardDescription>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full',
              methodDetails.riskColor
            )}
          >
            {methodDetails.riskText}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Typical Use Cases:</h4>
          <ul className="list-disc text-sm ml-5 space-y-1 text-muted-foreground">
            {methodDetails.useCases.map((useCase, index) => (
              <li key={index}>{useCase}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementMethodInfo;
