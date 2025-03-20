
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ProcurementMethod } from '@/types/enums';

interface ProcurementMethodInfoProps {
  method: ProcurementMethod;
}

// Define procurement method details with descriptions and suitable use cases
const procurementMethodDetails: Record<ProcurementMethod, { 
  title: string;
  description: string;
  suitableFor: string[];
  evaluationFocus: string[];
}> = {
  [ProcurementMethod.OPEN_TENDER]: {
    title: "Open Tender",
    description: "Publicly advertised competitive bidding process open to all qualified suppliers.",
    suitableFor: ["Standard goods and services", "High-value projects", "When maximum competition is desired"],
    evaluationFocus: ["Price competitiveness", "Technical compliance", "Supplier qualification"]
  },
  [ProcurementMethod.RESTRICTED_TENDER]: {
    title: "Restricted Tender",
    description: "Limited to pre-qualified suppliers who meet specific criteria.",
    suitableFor: ["Specialized goods or services", "When supplier qualification is critical", "Complex technical requirements"],
    evaluationFocus: ["Technical capability", "Experience", "Quality standards"]
  },
  [ProcurementMethod.DIRECT_PROCUREMENT]: {
    title: "Direct Procurement",
    description: "Single-source procurement without competition under specific conditions.",
    suitableFor: ["Emergencies", "Proprietary technology", "Follow-up contracts", "Very low-value purchases"],
    evaluationFocus: ["Supplier reliability", "Value for money", "Contract terms"]
  },
  [ProcurementMethod.REQUEST_FOR_QUOTATION]: {
    title: "Request for Quotation (RFQ)",
    description: "Simple price-based competitive quotes for well-defined goods or services.",
    suitableFor: ["Standard, off-the-shelf items", "Low to medium value purchases", "Well-defined requirements"],
    evaluationFocus: ["Price", "Delivery time", "Payment terms"]
  },
  [ProcurementMethod.REQUEST_FOR_PROPOSAL]: {
    title: "Request for Proposal (RFP)",
    description: "Detailed proposal-based procurement for complex needs, evaluating both technical solutions and price.",
    suitableFor: ["Complex services", "Custom solutions", "When solution approach matters"],
    evaluationFocus: ["Methodology", "Technical solution", "Value proposition", "Expertise"]
  },
  [ProcurementMethod.TWO_STAGE_TENDERING]: {
    title: "Two-Stage Tendering",
    description: "Initial technical proposals followed by revised commercial bids from qualified suppliers.",
    suitableFor: ["Complex technical requirements", "When specifications may need refinement", "IT systems, infrastructure"],
    evaluationFocus: ["Technical innovation", "Solution design", "Cost-effectiveness"]
  },
  [ProcurementMethod.FRAMEWORK_AGREEMENT]: {
    title: "Framework Agreement",
    description: "Long-term agreement establishing terms for future contracts with one or more suppliers.",
    suitableFor: ["Recurring needs", "Standardized goods or services", "When flexibility is required"],
    evaluationFocus: ["Long-term value", "Supplier stability", "Service level agreements"]
  },
  [ProcurementMethod.ELECTRONIC_REVERSE_AUCTION]: {
    title: "Electronic Reverse Auction",
    description: "Real-time online competitive bidding where suppliers reduce prices to win.",
    suitableFor: ["Commodity products", "Price-sensitive purchases", "Highly competitive markets"],
    evaluationFocus: ["Price", "Market competitiveness", "Supplier responsiveness"]
  },
  [ProcurementMethod.FORWARD_AUCTION]: {
    title: "Forward Auction",
    description: "Competitive bidding where prices increase as buyers compete for goods or services.",
    suitableFor: ["Selling surplus assets", "High-demand items", "Revenue maximization"],
    evaluationFocus: ["Bid legitimacy", "Payment reliability", "Market value optimization"]
  },
  [ProcurementMethod.DUTCH_AUCTION]: {
    title: "Dutch Auction",
    description: "Auction starting with a high price that drops until a bidder accepts the current price.",
    suitableFor: ["Time-sensitive sales", "Perishable goods", "Unique or limited items"],
    evaluationFocus: ["Speed of transaction", "Price discovery", "Market clearing"]
  },
  [ProcurementMethod.DESIGN_CONTEST]: {
    title: "Design Contest",
    description: "Competition where suppliers submit design solutions judged by a panel.",
    suitableFor: ["Architectural services", "Urban planning", "Creative solutions", "Innovation needs"],
    evaluationFocus: ["Innovation", "Design quality", "Creativity", "Technical feasibility"]
  },
  [ProcurementMethod.COMPETITIVE_DIALOGUE]: {
    title: "Competitive Dialogue",
    description: "Dialogue with selected suppliers to develop suitable solutions before formal bidding.",
    suitableFor: ["Complex projects", "When requirements are difficult to define", "Innovative solutions"],
    evaluationFocus: ["Solution approach", "Innovation", "Collaboration potential", "Understanding of needs"]
  },
  [ProcurementMethod.INNOVATION_PARTNERSHIP]: {
    title: "Innovation Partnership",
    description: "Long-term partnership for developing and subsequently purchasing an innovative solution.",
    suitableFor: ["R&D projects", "New technologies", "When existing solutions are inadequate"],
    evaluationFocus: ["Innovation capability", "R&D methodology", "Risk management", "Commercial viability"]
  }
};

const ProcurementMethodInfo: React.FC<ProcurementMethodInfoProps> = ({ method }) => {
  const details = procurementMethodDetails[method];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{details.title}</CardTitle>
        <CardDescription>{details.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Suitable for:</h4>
            <ul className="list-disc pl-5 text-sm">
              {details.suitableFor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Evaluation focus:</h4>
            <ul className="list-disc pl-5 text-sm">
              {details.evaluationFocus.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcurementMethodInfo;
