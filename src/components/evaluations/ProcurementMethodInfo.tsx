
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcurementMethod } from '@/types/enums';
import { BookOpen } from 'lucide-react';

interface ProcurementMethodInfoProps {
  method: ProcurementMethod;
}

const ProcurementMethodInfo: React.FC<ProcurementMethodInfoProps> = ({ method }) => {
  // Make sure we include all enum values in our methodData
  const methodData: Record<ProcurementMethod, {
    title: string;
    description: string;
    suitableFor: string[];
    evaluationFocus: string[];
  }> = {
    [ProcurementMethod.OPEN_TENDER]: {
      title: 'Open Tender',
      description: 'A procurement method where any eligible vendor can submit a bid in response to a publicly advertised tender.',
      suitableFor: ['High-value contracts', 'Projects requiring many potential bidders', 'Standard goods and services'],
      evaluationFocus: ['Value for money', 'Vendor capability', 'Technical compliance', 'Financial stability']
    },
    [ProcurementMethod.REQUEST_FOR_PROPOSAL]: {
      title: 'Request for Proposal (RFP)',
      description: 'A formal document requesting proposals from suppliers to provide solutions to a specific problem or project.',
      suitableFor: ['Complex services', 'Projects requiring creative solutions', 'IT systems development'],
      evaluationFocus: ['Technical approach', 'Proposed methodology', 'Experience with similar projects', 'Team qualifications']
    },
    [ProcurementMethod.REQUEST_FOR_QUOTATION]: {
      title: 'Request for Quotation (RFQ)',
      description: 'A simplified process used for procuring standard goods or services where price is the primary factor.',
      suitableFor: ['Low-value purchases', 'Standardized goods', 'Simple services', 'Quick procurement needs'],
      evaluationFocus: ['Price', 'Delivery timeframe', 'Basic qualifications', 'Compliance with specifications']
    },
    [ProcurementMethod.DIRECT_PROCUREMENT]: {
      title: 'Direct Procurement',
      description: 'A method where goods or services are procured directly from a single source without competition.',
      suitableFor: ['Urgent requirements', 'Proprietary products', 'Specialized expertise', 'Follow-on contracts'],
      evaluationFocus: ['Justification for direct sourcing', 'Value for money verification', 'Contract terms', 'Quality assurance']
    },
    [ProcurementMethod.RESTRICTED_TENDER]: {
      title: 'Restricted Tender',
      description: 'A two-stage procurement process where only pre-qualified suppliers are invited to submit bids.',
      suitableFor: ['Specialized works', 'High-value complex projects', 'Cases requiring pre-qualification'],
      evaluationFocus: ['Pre-qualification criteria', 'Technical capabilities', 'Track record', 'Financial evaluation']
    },
    [ProcurementMethod.FRAMEWORK_AGREEMENT]: {
      title: 'Framework Agreement',
      description: 'A long-term agreement with suppliers to provide goods/services at pre-agreed terms.',
      suitableFor: ['Recurring purchases', 'Common use supplies', 'Standardized services'],
      evaluationFocus: ['Long-term value', 'Reliability', 'Quality assurance', 'Supply chain sustainability']
    },
    [ProcurementMethod.TWO_STAGE_TENDERING]: {
      title: 'Two-Stage Tendering',
      description: 'A method where technical proposals are submitted first, followed by financial bids after refinement.',
      suitableFor: ['Complex projects', 'Cases where specifications are difficult to define', 'IT systems'],
      evaluationFocus: ['Technical feasibility', 'Innovation', 'Cost after refinement', 'Implementation approach']
    },
    [ProcurementMethod.DESIGN_COMPETITION]: {
      title: 'Design Competition',
      description: 'A competitive process to select the best design, typically for architectural or creative projects.',
      suitableFor: ['Architectural projects', 'Urban planning', 'Creative solutions', 'Innovation challenges'],
      evaluationFocus: ['Design quality', 'Creativity', 'Feasibility', 'Alignment with requirements']
    },
    [ProcurementMethod.ELECTRONIC_REVERSE_AUCTION]: {
      title: 'Electronic Reverse Auction',
      description: 'An online, real-time dynamic auction where pre-qualified bidders compete by offering lower prices.',
      suitableFor: ['Standardized products', 'Price-sensitive purchases', 'Highly competitive markets'],
      evaluationFocus: ['Price reduction', 'Real-time competition', 'Market price discovery', 'Efficiency']
    },
    [ProcurementMethod.FORWARD_AUCTION]: {
      title: 'Forward Auction',
      description: 'A procurement method where items are sold to the highest bidder.',
      suitableFor: ['Disposal of assets', 'Sale of surplus inventory', 'Licensing rights'],
      evaluationFocus: ['Maximum revenue generation', 'Transparent price discovery', 'Fair competition']
    },
    [ProcurementMethod.DUTCH_AUCTION]: {
      title: 'Dutch Auction',
      description: 'A decreasing price auction where the price starts high and decreases until a bidder accepts the price.',
      suitableFor: ['Perishable goods', 'Time-sensitive sales', 'Multiple identical items'],
      evaluationFocus: ['Speed of transaction', 'Price acceptance', 'Market equilibrium finding']
    },
    [ProcurementMethod.LOW_VALUE_PROCUREMENT]: {
      title: 'Low Value Procurement',
      description: 'Simplified procedures for low-value purchases that don't require full tendering.',
      suitableFor: ['Small purchases', 'Day-to-day operational needs', 'Low-risk items'],
      evaluationFocus: ['Price reasonableness', 'Delivery time', 'Basic quality requirements']
    },
    [ProcurementMethod.FORCE_ACCOUNT]: {
      title: 'Force Account',
      description: 'Using internal resources rather than external contractors to execute a project.',
      suitableFor: ['Emergencies', 'Security-sensitive projects', 'Projects requiring special expertise'],
      evaluationFocus: ['Resource availability', 'Internal capability', 'Cost-effectiveness of internal execution']
    },
    [ProcurementMethod.SPECIALLY_PERMITTED_PROCUREMENT]: {
      title: 'Specially Permitted Procurement',
      description: 'Procurement permitted under special circumstances defined by procurement laws.',
      suitableFor: ['National security projects', 'Special government initiatives', 'Statutory exemptions'],
      evaluationFocus: ['Legal compliance', 'Proper authorization', 'Documentation of special circumstances']
    },
    [ProcurementMethod.INNOVATION_PARTNERSHIP]: {
      title: 'Innovation Partnership',
      description: 'A collaborative approach to develop innovative solutions that aren't readily available in the market.',
      suitableFor: ['Research and development', 'Novel technology needs', 'Cutting-edge solutions'],
      evaluationFocus: ['Innovation potential', 'Research capability', 'Partnership approach', 'Development methodology']
    }
  };

  const methodInfo = methodData[method] || methodData[ProcurementMethod.OPEN_TENDER];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{methodInfo.title}</CardTitle>
            <CardDescription>Public Procurement and Asset Disposal Act (PPADA)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-secondary/20 rounded-md">
            <p>{methodInfo.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Suitable For:</h3>
              <ul className="space-y-1">
                {methodInfo.suitableFor.map((item, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Evaluation Focus:</h3>
              <ul className="space-y-1">
                {methodInfo.evaluationFocus.map((item, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementMethodInfo;
