
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck,
  Building, 
  FileText,
  AlertCircle,
  ArrowRight,
  LucideIcon,
  Wallet,
  LineChart,
  BarChart4,
  Landmark
} from 'lucide-react';
import { calculateDummyHash, getLevelDescription } from '@/components/marketplace/verification/utils';

interface VerificationLevelProps {
  title: string;
  description: string;
  icon: LucideIcon;
  requirements: string[];
  benefits: string[];
  level: string;
  completed?: boolean;
}

const VerificationLevelCard: React.FC<VerificationLevelProps> = ({
  title,
  description,
  icon: Icon,
  requirements,
  benefits,
  level,
  completed
}) => {
  return (
    <Card className={`${completed ? 'border-green-200 bg-green-50/30' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${completed ? 'bg-green-100' : 'bg-secondary'}`}>
              <Icon className={`h-5 w-5 ${completed ? 'text-green-600' : 'text-primary'}`} />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {completed ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
          ) : (
            <Badge variant="outline">{level}</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Requirements:</h4>
            <ul className="text-sm space-y-1">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 border border-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Benefits:</h4>
            <ul className="text-sm space-y-1">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            className="w-full mt-2" 
            variant={completed ? "outline" : "default"}
            asChild
          >
            <Link to="/verification">
              {completed ? "View Certificate" : "Get Verified"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VerificationGuide = () => {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Supplier Verification Guide</h1>
        <p className="text-muted-foreground mt-1">
          Complete the verification process to establish trust and gain access to more opportunities
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Blockchain-Backed Verification</CardTitle>
          </div>
          <CardDescription>
            Our verification system is backed by blockchain technology, ensuring immutable and transparent proof of verification.
            Each verification level builds on the previous, creating a comprehensive trust profile for your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-amber-200 rounded-md bg-amber-50 text-amber-800 flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Why verification matters</p>
              <p className="mt-1">
                In Kenya's procurement ecosystem, verified suppliers gain access to more tender opportunities and face 
                fewer documentation requirements. Buyers are more likely to consider verified suppliers, and 
                verification can expedite the evaluation process.
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-secondary/50 p-4 rounded-md">
              <div className="flex items-center gap-2 font-medium mb-2">
                <FileCheck className="h-4 w-4 text-primary" />
                Sample Verification Certificate
              </div>
              <div className="bg-background p-4 rounded-md border border-border">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-medium">ProcureChain Verification</h3>
                    <p className="text-xs text-muted-foreground">Advanced Level</p>
                  </div>
                  <Badge>Verified</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Name:</span>
                    <span>Acme Supplies Ltd</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification Date:</span>
                    <span>2025-04-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span>2026-04-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate ID:</span>
                    <span className="text-xs font-mono">{calculateDummyHash('Acme Supplies').substring(0, 16)}...</span>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Blockchain Verification</span>
                    <span className="text-xs font-mono">{calculateDummyHash('Verification Certificate').substring(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <Tabs defaultValue="levels">
          <TabsList className="mb-6">
            <TabsTrigger value="levels">Verification Levels</TabsTrigger>
            <TabsTrigger value="process">Verification Process</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="levels">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <VerificationLevelCard 
                title="Basic Verification"
                description="Essential identity and business verification"
                icon={Building}
                level="basic"
                completed={true}
                requirements={[
                  "Business Registration Certificate",
                  "National ID of Directors",
                  "Physical Address Verification",
                  "Contact Information Verification"
                ]}
                benefits={[
                  "Access to basic tender opportunities",
                  "Profile visibility in the marketplace",
                  "Blockchain-verified business identity",
                  "Basic trust score"
                ]}
              />
              
              <VerificationLevelCard 
                title="Standard Verification"
                description="Comprehensive business and compliance checks"
                icon={FileText}
                level="standard"
                requirements={[
                  "Tax Compliance Certificate",
                  "Business Licenses",
                  "Past Performance Documents",
                  "Bank Account Verification",
                  "Company Directors Background Check"
                ]}
                benefits={[
                  "Access to more tender opportunities",
                  "Higher visibility in supplier searches",
                  "Improved trust score",
                  "Faster evaluation process",
                  "Ability to participate in standard tenders"
                ]}
              />
              
              <VerificationLevelCard 
                title="Advanced Verification"
                description="Full financial and performance verification"
                icon={Landmark}
                level="advanced"
                requirements={[
                  "Audited Financial Statements",
                  "Reference Checks from Past Clients",
                  "Evidence of Similar Previous Contracts",
                  "Quality Certifications (ISO, etc.)",
                  "Insurance Certificates",
                  "Corporate Social Responsibility Documentation"
                ]}
                benefits={[
                  "Access to all tender opportunities",
                  "Priority in supplier recommendations",
                  "Maximum trust score",
                  "Expedited payment processing",
                  "Featured supplier status",
                  "Reduced documentation requirements for bids"
                ]}
              />
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild>
                <Link to="/verification">Start Verification Process</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="process">
            <Card>
              <CardContent className="pt-6">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">The Verification Process</h3>
                    <p className="text-muted-foreground">
                      Our verification process is designed to be thorough yet straightforward. 
                      Follow these steps to get your business verified on ProcureChain.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Register and Create Your Profile</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Sign up for a ProcureChain account and complete your basic business profile 
                          with accurate business information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Submit Required Documents</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Upload the required documents for your desired verification level. 
                          Our system will securely store your documents with encrypted access.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Document Review</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Our verification team will review your documents and cross-check with 
                          government databases. This typically takes 2-3 business days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Blockchain Verification</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          Once approved, your verification details are recorded on the blockchain, 
                          creating an immutable record of your business credentials.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">5</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Receive Verification Certificate</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          A digital verification certificate is issued to your account, which can be 
                          displayed on your profile and shared with potential clients.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Button asChild>
                      <Link to="/verification">Begin Verification</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-1">How long does verification take?</h3>
                  <p className="text-muted-foreground">
                    Basic verification typically takes 1-2 business days. Standard verification takes 2-3 business days, 
                    and Advanced verification may take 3-5 business days depending on the complexity of your business.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-1">Is there a cost for verification?</h3>
                  <p className="text-muted-foreground">
                    Basic verification is free of charge. Standard verification costs KES 5,000, and Advanced 
                    verification costs KES 15,000. These fees cover the cost of document verification, database checks, 
                    and blockchain recording.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-1">How long is my verification valid?</h3>
                  <p className="text-muted-foreground">
                    Verification is valid for one year from the date of issuance. You will receive notifications 
                    30 days before expiry to remind you to renew your verification.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-1">Why is blockchain verification important?</h3>
                  <p className="text-muted-foreground">
                    Blockchain verification creates an immutable record that cannot be tampered with, ensuring the 
                    highest level of trust in your business credentials. This technology eliminates fraud and 
                    provides transparency in the procurement process.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-lg mb-1">Can I upgrade my verification level?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade your verification level at any time by submitting the additional required 
                    documents and paying the difference in verification fees. Your verification expiry date will 
                    remain based on your initial verification date.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VerificationGuide;
