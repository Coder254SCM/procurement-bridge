
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
  ShieldCheck,
  Users,
  Gavel,
  ClipboardCheck,
  TrendingUp
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container py-8 px-4 md:px-6 mt-16">
      <div className="mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ RESTRICTED ACCESS:</strong> This documentation contains technical architecture details. Access limited to authenticated technical staff and administrators only. Public users: See User Guides instead.
              </p>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-semibold">ProcureChain Technical Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Complete technical guide to ProcureChain - Kenya's blockchain-powered procurement platform with advanced verification and compliance features
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="verification">Verification System</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation Process</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Framework</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Integration</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                System Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ProcureChain is a comprehensive blockchain-based procurement platform built specifically for the Kenyan market. 
                It integrates with local regulatory frameworks and provides advanced verification capabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Multi-Role System
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Support for 12 distinct user roles including buyers, suppliers, evaluators, and auditors
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Advanced Verification
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    4-level verification system with blockchain-backed certificates and KYC integration
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-primary" />
                    Smart Procurement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    14 procurement methods with automated evaluation and compliance checking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">For Suppliers</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Multi-level verification (None, Basic, Intermediate, Advanced)</li>
                    <li>• Document upload with blockchain hashing</li>
                    <li>• Real-time bid tracking and notifications</li>
                    <li>• Digital identity verification with PPIP integration</li>
                    <li>• Performance analytics and risk scoring</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">For Buyers</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Template-based tender creation</li>
                    <li>• Advanced evaluation criteria configuration</li>
                    <li>• Supplier list management and filtering</li>
                    <li>• Contract lifecycle management</li>
                    <li>• Supply chain professional reviews</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">For Evaluators</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Specialized evaluation by expertise (Finance, Technical, Legal, etc.)</li>
                    <li>• Comprehensive scoring with 35+ criteria categories</li>
                    <li>• Blockchain-recorded evaluation trails</li>
                    <li>• Collaborative evaluation workflows</li>
                    <li>• Automated compliance checking</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Platform Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Hyperledger Fabric blockchain integration</li>
                    <li>• Advanced behavior analysis and fraud detection</li>
                    <li>• Comprehensive audit logging</li>
                    <li>• Real-time notifications and alerts</li>
                    <li>• Analytics dashboard with insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Buyer</h4>
                    <p className="text-sm text-blue-700">Creates tenders, manages procurement processes, awards contracts</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Supplier</h4>
                    <p className="text-sm text-green-700">Submits bids, completes verification, delivers contracted services</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Admin</h4>
                    <p className="text-sm text-purple-700">Platform administration, user management, system configuration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluator Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Finance Evaluator</span>
                    <Badge variant="outline">Financial</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Technical Evaluator</span>
                    <Badge variant="outline">Technical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Legal Evaluator</span>
                    <Badge variant="outline">Legal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Procurement Evaluator</span>
                    <Badge variant="outline">Process</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Engineering Evaluator</span>
                    <Badge variant="outline">Technical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Accounting Evaluator</span>
                    <Badge variant="outline">Financial</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specialized Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900">Supply Chain Professional</h4>
                    <p className="text-sm text-orange-700">Reviews tender requirements, validates supply chain feasibility</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Auditor</h4>
                    <p className="text-sm text-red-700">Conducts compliance audits, reviews blockchain records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Levels</CardTitle>
              <CardDescription>
                ProcureChain implements a comprehensive 4-level verification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <Badge className="mb-2">None</Badge>
                  <h4 className="font-semibold mb-2">Unverified</h4>
                  <p className="text-sm text-muted-foreground">Basic registration only. Limited platform access.</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <Badge className="mb-2 bg-blue-100 text-blue-800">Basic</Badge>
                  <h4 className="font-semibold mb-2">Basic Verification</h4>
                  <p className="text-sm text-muted-foreground">Identity verification, business registration check.</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <Badge className="mb-2 bg-green-100 text-green-800">Intermediate</Badge>
                  <h4 className="font-semibold mb-2">Intermediate Verification</h4>
                  <p className="text-sm text-muted-foreground">Financial records, tax compliance, operational capacity.</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <Badge className="mb-2 bg-purple-100 text-purple-800">Advanced</Badge>
                  <h4 className="font-semibold mb-2">Advanced Verification</h4>
                  <p className="text-sm text-muted-foreground">Full compliance, performance history, blockchain certificates.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verification Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Identity & Business</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Business Registry Verification</li>
                    <li>• Identity Document Verification</li>
                    <li>• Regulatory Compliance Check</li>
                    <li>• Operational Capacity Assessment</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Financial & Tax</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Financial Statement Review</li>
                    <li>• Tax Compliance Verification</li>
                    <li>• Credit Rating Assessment</li>
                    <li>• Banking Reference Check</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Blockchain & Digital</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Blockchain Certificate Issuance</li>
                    <li>• Digital Identity Creation</li>
                    <li>• Immutable Record Storage</li>
                    <li>• Smart Contract Integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Process</CardTitle>
              <CardDescription>
                Comprehensive multi-stage evaluation with specialized evaluator roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-800 font-semibold">1</span>
                    </div>
                    <h4 className="font-semibold text-sm">Bid Submission</h4>
                    <p className="text-xs text-muted-foreground">Suppliers submit bids with required documents</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-800 font-semibold">2</span>
                    </div>
                    <h4 className="font-semibold text-sm">Initial Review</h4>
                    <p className="text-xs text-muted-foreground">Compliance and eligibility check</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-800 font-semibold">3</span>
                    </div>
                    <h4 className="font-semibold text-sm">Expert Evaluation</h4>
                    <p className="text-xs text-muted-foreground">Specialized evaluators score bids</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-800 font-semibold">4</span>
                    </div>
                    <h4 className="font-semibold text-sm">Final Review</h4>
                    <p className="text-xs text-muted-foreground">Consolidated scoring and ranking</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-800 font-semibold">5</span>
                    </div>
                    <h4 className="font-semibold text-sm">Award Decision</h4>
                    <p className="text-xs text-muted-foreground">Contract award and notification</p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Evaluation Criteria Categories (35+ Categories)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Financial (5 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Price Competitiveness</li>
                        <li>• Financial Stability</li>
                        <li>• Cost Effectiveness</li>
                        <li>• Lifecycle Costs</li>
                        <li>• Payment Terms</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">Technical (5 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Technical Capability</li>
                        <li>• Methodology</li>
                        <li>• Innovation</li>
                        <li>• Quality Standards</li>
                        <li>• Technical Compliance</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-purple-800 mb-2">Experience (6 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Relevant Experience</li>
                        <li>• Past Performance</li>
                        <li>• Qualifications</li>
                        <li>• Industry Expertise</li>
                        <li>• Key Personnel</li>
                        <li>• Project Management</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-orange-800 mb-2">Operational (5 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Delivery Timeframe</li>
                        <li>• Implementation Plan</li>
                        <li>• Operational Capacity</li>
                        <li>• Quality Assurance</li>
                        <li>• Service Level Agreements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-red-800 mb-2">Compliance (5 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Legal Compliance</li>
                        <li>• Regulatory Compliance</li>
                        <li>• Risk Management</li>
                        <li>• Insurance Coverage</li>
                        <li>• Security Measures</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-teal-800 mb-2">Sustainability (5 criteria)</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Environmental Sustainability</li>
                        <li>• Social Responsibility</li>
                        <li>• Local Content</li>
                        <li>• Diversity & Inclusion</li>
                        <li>• Community Impact</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Framework</CardTitle>
              <CardDescription>
                Multi-layered compliance system with automated checking and blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">KYC Compliance</h4>
                    <p className="text-sm text-muted-foreground">Know Your Customer verification with document validation</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">AML Checks</h4>
                    <p className="text-sm text-muted-foreground">Anti-Money Laundering screening and monitoring</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Tax Compliance</h4>
                    <p className="text-sm text-muted-foreground">Kenya Revenue Authority integration and verification</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Regulatory Checks</h4>
                    <p className="text-sm text-muted-foreground">Industry-specific regulatory compliance verification</p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Specialized Compliance Validators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Construction Compliance</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Building permit verification</li>
                        <li>• Safety standards compliance</li>
                        <li>• Environmental impact assessment</li>
                        <li>• Professional certification checks</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3">Financial Compliance</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Financial statement validation</li>
                        <li>• Credit rating verification</li>
                        <li>• Banking reference checks</li>
                        <li>• Insurance coverage validation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3">Ethics Compliance</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Conflict of interest checks</li>
                        <li>• Anti-corruption verification</li>
                        <li>• Code of conduct compliance</li>
                        <li>• Transparency requirements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3">Procurement Compliance</h5>
                      <ul className="text-sm space-y-1">
                        <li>• PPRA regulations compliance</li>
                        <li>• Procurement method validation</li>
                        <li>• Document requirement checks</li>
                        <li>• Process adherence monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Hyperledger Fabric Integration
              </CardTitle>
              <CardDescription>
                Enterprise-grade blockchain infrastructure for transparent and secure procurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Immutable Records</h4>
                    <p className="text-sm text-muted-foreground">
                      All verification certificates, tender awards, and contract details are permanently stored on blockchain
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Smart Contracts</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated contract execution with milestone-based payments and compliance triggers
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Audit Trail</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trail for all transactions with cryptographic proof of integrity
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Blockchain Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Document Verification</h5>
                      <ul className="text-sm space-y-1">
                        <li>• SHA-256 hashing of all documents</li>
                        <li>• Blockchain storage of document hashes</li>
                        <li>• Tamper-proof verification certificates</li>
                        <li>• Real-time integrity checking</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Transaction Recording</h5>
                      <ul className="text-sm space-y-1">
                        <li>• All bid submissions recorded</li>
                        <li>• Evaluation scores immutably stored</li>
                        <li>• Contract awards with timestamps</li>
                        <li>• Payment milestone tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                API Documentation
              </CardTitle>
              <CardDescription>
                RESTful API endpoints for system integration and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Authentication Endpoints</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/auth/login</span>
                        <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/auth/logout</span>
                        <Badge className="bg-red-100 text-red-800">POST</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/auth/refresh</span>
                        <Badge className="bg-green-100 text-green-800">POST</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Tender Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/tenders</span>
                        <Badge className="bg-green-100 text-green-800">GET</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/tenders</span>
                        <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/tenders/:id</span>
                        <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Bid Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/bids</span>
                        <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/bids/:id</span>
                        <Badge className="bg-green-100 text-green-800">GET</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/bids/:id/status</span>
                        <Badge className="bg-yellow-100 text-yellow-800">PATCH</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Verification</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/verification/start</span>
                        <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/verification/status</span>
                        <Badge className="bg-green-100 text-green-800">GET</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-mono">/api/verification/blockchain</span>
                        <Badge className="bg-purple-100 text-purple-800">GET</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Webhook Events</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Tender Events</h5>
                      <ul className="text-xs space-y-1">
                        <li>• tender.created</li>
                        <li>• tender.published</li>
                        <li>• tender.deadline_approaching</li>
                        <li>• tender.closed</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Bid Events</h5>
                      <ul className="text-xs space-y-1">
                        <li>• bid.submitted</li>
                        <li>• bid.evaluated</li>
                        <li>• bid.awarded</li>
                        <li>• bid.rejected</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Verification Events</h5>
                      <ul className="text-xs space-y-1">
                        <li>• verification.started</li>
                        <li>• verification.completed</li>
                        <li>• verification.failed</li>
                        <li>• certificate.issued</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Compliance Events</h5>
                      <ul className="text-xs space-y-1">
                        <li>• compliance.check_started</li>
                        <li>• compliance.violation_detected</li>
                        <li>• compliance.status_updated</li>
                        <li>• audit.trail_created</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">How does the verification system work?</h3>
                  <p className="text-muted-foreground">
                    ProcureChain uses a 4-level verification system (None, Basic, Intermediate, Advanced). Each level requires 
                    progressively more documentation and compliance checks. All verifications are recorded on the blockchain 
                    for immutable proof. Basic verification includes identity and business registration checks, while Advanced 
                    verification includes comprehensive financial, operational, and performance assessments.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">What procurement methods are supported?</h3>
                  <p className="text-muted-foreground">
                    The platform supports 14 procurement methods including Open Tender, Restricted Tender, Direct Procurement, 
                    Request for Proposal (RFP), Request for Quotation (RFQ), Framework Agreement, Electronic Reverse Auction, 
                    Forward Auction, Dutch Auction, Design Contest, Competitive Dialogue, Innovation Partnership, 
                    Two-Stage Tendering, and Design Competition.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How are evaluations conducted?</h3>
                  <p className="text-muted-foreground">
                    Evaluations are conducted by specialized evaluators (Finance, Technical, Legal, Procurement, Engineering, 
                    Accounting) using 35+ criteria categories. Each evaluator scores bids in their area of expertise using 
                    standardized criteria. All evaluations are recorded on the blockchain for transparency and audit purposes. 
                    The system supports both individual and collaborative evaluation workflows.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">What compliance frameworks are implemented?</h3>
                  <p className="text-muted-foreground">
                    The platform implements multiple compliance frameworks including KYC (Know Your Customer), AML (Anti-Money 
                    Laundering), Tax compliance with Kenya Revenue Authority integration, PPRA (Public Procurement Regulatory 
                    Authority) regulations, and industry-specific compliance checks. Specialized validators handle Construction, 
                    Financial, Ethics, and Procurement compliance.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How does blockchain integration work?</h3>
                  <p className="text-muted-foreground">
                    ProcureChain uses Hyperledger Fabric, an enterprise-grade blockchain platform. All critical data including 
                    verification certificates, bid submissions, evaluation scores, and contract awards are hashed and stored 
                    on the blockchain. This creates an immutable audit trail that cannot be tampered with. Smart contracts 
                    automate certain processes like milestone payments and compliance checking.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Can I have multiple roles on the platform?</h3>
                  <p className="text-muted-foreground">
                    Yes, users can have multiple roles. For example, a company can be both a supplier and a buyer, or an 
                    individual can be an evaluator in multiple specializations. The dashboard adapts to show features 
                    relevant to each role you have. Role assignments are managed through the user profile and may require 
                    additional verification depending on the role.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How secure is the platform?</h3>
                  <p className="text-muted-foreground">
                    Security is implemented at multiple levels: end-to-end encryption for data transmission, blockchain 
                    immutability for critical records, multi-factor authentication, role-based access control, comprehensive 
                    audit logging, and regular security audits. All sensitive documents are encrypted before storage, and 
                    access is logged for accountability.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">What happens after a contract is awarded?</h3>
                  <p className="text-muted-foreground">
                    After contract award, the system supports full contract lifecycle management including milestone tracking, 
                    payment processing, performance monitoring, and compliance checking. Smart contracts can automate certain 
                    aspects like milestone-based payments. All contract activities are recorded on the blockchain for 
                    transparency and audit purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How does the behavior analysis work?</h3>
                  <p className="text-muted-foreground">
                    The platform includes advanced behavior analysis that monitors patterns in bidding, pricing, timing, and 
                    other activities to detect potential fraud or anomalies. This includes risk scoring based on historical 
                    performance, pattern matching against known fraud indicators, and anomaly detection algorithms. All 
                    analysis is performed automatically and helps maintain platform integrity.
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
