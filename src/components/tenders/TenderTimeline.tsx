
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  PenLine,
  FileEdit,
  Send,
  Users,
  ClipboardCheck,
  Award,
  FileSignature,
  BarChart4,
  FileText,
} from 'lucide-react';

const TenderTimeline: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tender Lifecycle Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Steps</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {[
                { icon: <PenLine className="h-6 w-6" />, title: "Planning & Creation", desc: "Define requirements, create tender documents" },
                { icon: <Send className="h-6 w-6" />, title: "Publication", desc: "Publish tender and invite bids" },
                { icon: <Users className="h-6 w-6" />, title: "Bid Submission", desc: "Suppliers submit proposals" },
                { icon: <ClipboardCheck className="h-6 w-6" />, title: "Evaluation", desc: "Technical and financial assessment" },
                { icon: <Award className="h-6 w-6" />, title: "Award", desc: "Select winning bid and notify participants" },
                { icon: <FileSignature className="h-6 w-6" />, title: "Contract Management", desc: "Sign contract and manage implementation" },
                { icon: <BarChart4 className="h-6 w-6" />, title: "Performance Monitoring", desc: "Track KPIs and contract compliance" }
              ].map((step, index) => (
                <div key={index} className="ml-9 mb-8 relative">
                  <div className="absolute -left-12 mt-1.5 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    {step.icon}
                  </div>
                  <h3 className="font-medium text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <PenLine className="h-5 w-5 mr-2" />
                  1. Planning & Creation
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Needs identification and market research</li>
                  <li>Budget allocation and approval</li>
                  <li>Development of specifications and requirements</li>
                  <li>Selection of procurement method</li>
                  <li>Creation of tender documents</li>
                  <li>Setting evaluation criteria</li>
                  <li>Internal approval processes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  2. Publication
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Publication on the procurement platform</li>
                  <li>Notification to registered suppliers</li>
                  <li>Handling pre-bid queries</li>
                  <li>Organizing pre-bid meetings if required</li>
                  <li>Issuing clarifications/amendments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  3. Bid Submission
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Digital identity verification of suppliers</li>
                  <li>Compliance checks (PEP, sanctions)</li>
                  <li>Technical proposal submission</li>
                  <li>Financial proposal submission</li>
                  <li>Digital signing of bid documents</li>
                  <li>Blockchain recording of submissions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  4. Evaluation
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Initial compliance screening</li>
                  <li>Technical evaluation by committee</li>
                  <li>Financial evaluation</li>
                  <li>Due diligence checks</li>
                  <li>Behavioral analysis for fraud detection</li>
                  <li>Scoring and ranking of bids</li>
                  <li>Evaluation reports generation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  5. Award
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Award approval by authorized personnel</li>
                  <li>Notification to winning bidder</li>
                  <li>Notification to unsuccessful bidders</li>
                  <li>Standstill period for appeals</li>
                  <li>Handling of appeals if any</li>
                  <li>Final award confirmation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <FileSignature className="h-5 w-5 mr-2" />
                  6. Contract Management
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Contract drafting and negotiation</li>
                  <li>Digital signing of contract</li>
                  <li>Recording contract on blockchain</li>
                  <li>Setting up performance monitoring framework</li>
                  <li>Implementation kickoff</li>
                  <li>Milestone tracking and payment processing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" />
                  7. Performance Monitoring
                </h3>
                <ul className="list-disc pl-8 text-sm space-y-2">
                  <li>Regular performance reviews</li>
                  <li>KPI tracking and reporting</li>
                  <li>Contract variations management</li>
                  <li>Issue resolution</li>
                  <li>Contract closeout procedures</li>
                  <li>Post-implementation review</li>
                  <li>Lessons learned documentation</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="blockchain" className="pt-4">
            <div className="space-y-6">
              <p className="text-sm">
                Your procurement platform uses Hyperledger Fabric as the blockchain technology to ensure immutability, 
                transparency, and security throughout the tender lifecycle.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <FileEdit className="h-4 w-4 mr-2" />
                      Tender Creation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Records tender details, specifications, and evaluation criteria on the blockchain.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Bid Submission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Timestamps and records each bid, ensuring no tampering after submission deadline.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Evaluation Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Stores evaluation scores and comments from each committee member with digital signatures.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Award Decision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Records the final award decision with justification and approval details.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <FileSignature className="h-4 w-4 mr-2" />
                      Smart Contracts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Automates contract execution, milestone payments, and performance tracking.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Digital Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <p>Verifies and stores supplier credentials and compliance checks on the blockchain.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TenderTimeline;
