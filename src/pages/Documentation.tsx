
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Download, 
  Search,
  Code,
  BarChart4,
  ShieldCheck
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container py-8 px-4 md:px-6 mt-16">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive guides and resources for using the ProcureChain platform
        </p>
      </div>

      <Tabs defaultValue="guides">
        <TabsList className="mb-6">
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="api">API References</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </div>
                <CardDescription>
                  New to ProcureChain? Start here to learn the basics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Platform Overview
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Creating Your Account
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      User Role Setup
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Navigation Guide
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">For Suppliers</CardTitle>
                </div>
                <CardDescription>
                  Learn how to bid on tenders and get verified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Finding Tenders
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Submitting Bids
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Verification Process
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Managing Your Profile
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">For Buyers</CardTitle>
                </div>
                <CardDescription>
                  Create tenders and manage procurement processes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Creating Tenders
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Evaluating Bids
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Awarding Contracts
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Managing Suppliers
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">For Evaluators</CardTitle>
                </div>
                <CardDescription>
                  Review and score bids with expert criteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Evaluation Process
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Scoring Criteria
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Providing Recommendations
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Documentation Standards
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Marketplace Guide</CardTitle>
                </div>
                <CardDescription>
                  How to use the ProcureChain marketplace effectively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Browsing Tenders
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Finding Suppliers
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Understanding Verification
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Filtering and Search
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Downloadable Resources</CardTitle>
                </div>
                <CardDescription>
                  Templates, forms, and other useful documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Bid Template <Badge variant="outline" className="ml-1">PDF</Badge>
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Evaluation Form <Badge variant="outline" className="ml-1">XLSX</Badge>
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Contract Template <Badge variant="outline" className="ml-1">DOCX</Badge>
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      User Manual <Badge variant="outline" className="ml-1">PDF</Badge>
                    </a>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>API Documentation</CardTitle>
              </div>
              <CardDescription>
                Integrate with the ProcureChain platform using our secure API endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Our RESTful API allows you to integrate ProcureChain functionality into your own systems.
                  All API requests require authentication and are secured with industry-standard encryption.
                </p>
                
                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Available Endpoints:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GET</Badge>
                          <span className="text-sm text-muted-foreground">/api/v1/tenders</span>
                        </div>
                        <p className="text-sm mt-2">List all available tenders with pagination support.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">POST</Badge>
                          <span className="text-sm text-muted-foreground">/api/v1/bids</span>
                        </div>
                        <p className="text-sm mt-2">Submit a new bid for a specific tender.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GET</Badge>
                          <span className="text-sm text-muted-foreground">/api/v1/suppliers</span>
                        </div>
                        <p className="text-sm mt-2">List verified suppliers with filtering options.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">PUT</Badge>
                          <span className="text-sm text-muted-foreground">/api/v1/evaluations/:id</span>
                        </div>
                        <p className="text-sm mt-2">Update an evaluation for a specific bid.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    API Reference
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Interactive Docs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Webhooks</CardTitle>
              </div>
              <CardDescription>
                Receive real-time updates about events on the ProcureChain platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Set up webhooks to get notifications about tender updates, bid submissions, evaluation completions, and more.
              </p>
              
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Webhook Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Blockchain Technology</CardTitle>
              </div>
              <CardDescription>
                Learn about the blockchain infrastructure powering ProcureChain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Why Blockchain?</h3>
                  <p className="text-muted-foreground">
                    ProcureChain leverages blockchain technology to ensure transparency, immutability, and security
                    throughout the procurement process. Every transaction and verification is recorded on the blockchain,
                    creating an audit trail that cannot be altered.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Immutable Records</h4>
                    <p className="text-sm text-muted-foreground">
                      All verification certificates, tender awards, and contract details are stored permanently on the blockchain.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Transparent Process</h4>
                    <p className="text-sm text-muted-foreground">
                      The evaluation and award process is transparent and can be audited by all stakeholders.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Smart Contracts</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated contract execution ensures all parties fulfill their obligations.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Blockchain Explorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <BarChart4 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Verification Process</CardTitle>
              </div>
              <CardDescription>
                How blockchain ensures secure and reliable supplier verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  When a supplier completes verification, their credentials are hashed and stored on the blockchain.
                  This creates a tamper-proof record that buyers can trust.
                </p>
                
                <div className="p-4 bg-secondary/50 rounded-md">
                  <h4 className="font-medium mb-2">Verification Flow</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</span>
                      <span>Supplier submits documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">2</span>
                      <span>ProcureChain verifies with official sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">3</span>
                      <span>Documents are hashed and recorded on blockchain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">4</span>
                      <span>Verification certificate issued with blockchain reference</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">5</span>
                      <span>Buyers can verify certificate authenticity via blockchain</span>
                    </li>
                  </ol>
                </div>
                
                <Button variant="outline" className="mt-4">
                  <a href="/verification-guide">Learn More about Verification</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">What is ProcureChain?</h3>
                  <p className="text-muted-foreground">
                    ProcureChain is a blockchain-based procurement platform designed for transparency and efficiency 
                    in tender processes. It serves multiple user roles including suppliers, buyers, and evaluators, 
                    providing features tailored to each role's needs.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How do I sign up as a supplier?</h3>
                  <p className="text-muted-foreground">
                    You can sign up by clicking on the "Sign In" button and selecting "Create an account". 
                    During registration, you'll be asked to specify your role as a supplier. You'll then 
                    need to complete your profile and verification process to access all features.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How does the verification process work?</h3>
                  <p className="text-muted-foreground">
                    Our verification process has multiple levels. Basic verification involves confirming your business 
                    identity. Standard verification adds compliance checks. Advanced verification includes financial and 
                    performance history. Each level increases your trust score and opens up more opportunities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Can I be both a supplier and a buyer?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can have multiple roles in the system. During registration, you can select all applicable 
                    roles, and your dashboard will show features relevant to each role you have.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How secure is my data on ProcureChain?</h3>
                  <p className="text-muted-foreground">
                    We take security very seriously. All data is encrypted both in transit and at rest. Sensitive documents 
                    are stored with additional encryption. Our blockchain implementation ensures that verification records 
                    cannot be tampered with, creating an immutable audit trail.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">What happens after I submit a bid?</h3>
                  <p className="text-muted-foreground">
                    After submission, your bid enters the evaluation phase. You'll receive notifications as your bid 
                    progresses through the evaluation stages. You can track the status of all your bids from your 
                    supplier dashboard.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How are evaluators selected?</h3>
                  <p className="text-muted-foreground">
                    Evaluators are typically experts in relevant fields who are appointed by the buyer. They must register 
                    as evaluators and may need to declare any conflicts of interest before evaluating bids.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
