import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, Lock, Database, Globe, FileText, Users, Clock, Key, Scale, Eye, 
  Trash2, Download, AlertCircle, CheckCircle2, Server, Fingerprint, ShieldCheck,
  FileKey, UserCheck, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';

const Privacy = () => {
  const lastUpdated = "December 23, 2025";
  const policyVersion = "3.2.0";

  const securityFeatures = [
    { name: 'TLS 1.3 Encryption', status: 'active', score: 100 },
    { name: 'AES-256 At-Rest', status: 'active', score: 100 },
    { name: 'Rate Limiting', status: 'active', score: 100 },
    { name: 'SQL Injection Protection', status: 'active', score: 100 },
    { name: 'XSS Protection', status: 'active', score: 100 },
    { name: 'CSRF Protection', status: 'active', score: 100 },
  ];

  const overallSecurityScore = Math.round(
    securityFeatures.reduce((acc, f) => acc + f.score, 0) / securityFeatures.length
  );

  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | ProcureChain Kenya</title>
        <meta name="description" content="ProcureChain privacy policy detailing data protection practices in compliance with Kenya DPA 2019 and GDPR." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-primary/15 via-background to-secondary/15 border-b overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto py-20 px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-8 ring-4 ring-primary/20">
                <ShieldCheck className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                Your privacy is fundamental to how we operate. We protect your data with 
                enterprise-grade security and full regulatory compliance.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Clock className="h-3 w-3 mr-2" />
                  Updated: {lastUpdated}
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <FileKey className="h-3 w-3 mr-2" />
                  Version {policyVersion}
                </Badge>
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30 px-4 py-2">
                  <CheckCircle2 className="h-3 w-3 mr-2" />
                  GDPR & Kenya DPA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Security Score Banner */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Platform Security Score</span>
                    <Badge className="bg-green-500">{overallSecurityScore}%</Badge>
                  </div>
                  <Progress value={overallSecurityScore} className="h-2" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {securityFeatures.slice(0, 3).map((feature) => (
                    <Badge key={feature.name} variant="outline" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      {feature.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Introduction */}
            <section>
              <Alert className="border-primary/20 bg-primary/5">
                <Shield className="h-4 w-4" />
                <AlertTitle>Our Commitment</AlertTitle>
                <AlertDescription>
                  ProcureChain Kenya Limited is committed to protecting your privacy and ensuring transparent data practices 
                  in compliance with the Kenya Data Protection Act 2019 and GDPR principles.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                  the ProcureChain e-Procurement Platform. Please read this policy carefully. If you do not agree with 
                  these terms, please discontinue use of the platform.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 1: Information We Collect */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Database className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                  <p className="text-muted-foreground mt-1">Categories of personal data we process</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Full name and contact details</p>
                    <p>• Organization name and registration number</p>
                    <p>• Tax Identification Number (PIN/TIN)</p>
                    <p>• Business address and phone number</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Verification Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• National ID or passport copies</p>
                    <p>• Business registration certificates</p>
                    <p>• Tax compliance certificates</p>
                    <p>• Professional licenses</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Procurement Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Tender submissions and proposals</p>
                    <p>• Bid documents and pricing</p>
                    <p>• Contract details and performance</p>
                    <p>• AGPO category registrations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Technical Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• IP address and device information</p>
                    <p>• Browser type and version</p>
                    <p>• Login timestamps and activity logs</p>
                    <p>• Session and security data</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Section 2: How We Use Your Information */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground mt-1">Purposes for processing your data</p>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Service Delivery</h3>
                    <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                        <span>Process tender publications and bid submissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                        <span>Manage contract awards and performance tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                        <span>Verify identity and business credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                        <span>Facilitate communication between parties</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Compliance & Security</h3>
                    <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Ensure PPRA 2015 regulatory compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Conduct fraud detection and prevention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Maintain audit trails for transparency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Process AGPO eligibility verification</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Section 3: Legal Basis */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Scale className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">3. Legal Basis for Processing</h2>
                  <p className="text-muted-foreground mt-1">Kenya Data Protection Act 2019 & GDPR</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-purple-500/5 border-purple-500/20">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 bg-purple-500">Contract Performance</Badge>
                    <p className="text-sm text-muted-foreground">
                      Processing necessary to fulfill our contractual obligations for procurement services.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/20">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 bg-blue-500">Legal Obligation</Badge>
                    <p className="text-sm text-muted-foreground">
                      Compliance with PPRA 2015, tax regulations, and anti-money laundering requirements.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 bg-green-500">Legitimate Interest</Badge>
                    <p className="text-sm text-muted-foreground">
                      Fraud prevention, security monitoring, and platform improvement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 bg-orange-500">Consent</Badge>
                    <p className="text-sm text-muted-foreground">
                      Marketing communications and optional features (withdrawable anytime).
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Section 4: Data Security */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Lock className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">4. Data Security Measures</h2>
                  <p className="text-muted-foreground mt-1">How we protect your information</p>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Technical Security
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs mt-0.5">TLS 1.3</Badge>
                          <span>Encryption for data in transit</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs mt-0.5">AES-256</Badge>
                          <span>Encryption for data at rest</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs mt-0.5">RBAC</Badge>
                          <span>Role-based access control</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs mt-0.5">API</Badge>
                          <span>Rate limiting and input validation</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        Infrastructure
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Automated database backups</li>
                        <li>• Network isolation and firewalls</li>
                        <li>• Regular security updates</li>
                        <li>• Blockchain audit trails (hashes only)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert variant="default" className="bg-amber-500/10 border-amber-500/30">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Transparency Notice</AlertTitle>
                <AlertDescription className="text-sm">
                  While we implement industry-standard security, no system is 100% secure. We commit to notifying 
                  affected users within 72 hours of any confirmed data breach and continuously improving our security posture.
                </AlertDescription>
              </Alert>
            </section>

            <Separator />

            {/* Section 5: Data Retention */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">5. Data Retention Policy</h2>
                  <p className="text-muted-foreground mt-1">How long we keep your data</p>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-semibold">Data Category</th>
                          <th className="text-left py-3 font-semibold">Retention</th>
                          <th className="text-left py-3 font-semibold">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-3">Procurement Records</td>
                          <td className="py-3"><Badge variant="outline">7 Years</Badge></td>
                          <td className="py-3 text-muted-foreground">PPRA 2015 Section 67</td>
                        </tr>
                        <tr>
                          <td className="py-3">Audit Logs</td>
                          <td className="py-3"><Badge variant="outline">10 Years</Badge></td>
                          <td className="py-3 text-muted-foreground">Kenya Evidence Act</td>
                        </tr>
                        <tr>
                          <td className="py-3">User Profiles</td>
                          <td className="py-3"><Badge variant="outline">7 Years</Badge></td>
                          <td className="py-3 text-muted-foreground">Data Protection Act 2019</td>
                        </tr>
                        <tr>
                          <td className="py-3">Appeal Records</td>
                          <td className="py-3"><Badge variant="outline">7 Years</Badge></td>
                          <td className="py-3 text-muted-foreground">PPRA 2015 Section 168</td>
                        </tr>
                        <tr>
                          <td className="py-3">Blockchain Hashes</td>
                          <td className="py-3"><Badge variant="secondary">Permanent</Badge></td>
                          <td className="py-3 text-muted-foreground">Immutable (no PII)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 6: Your Rights */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <Key className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">6. Your Data Protection Rights</h2>
                  <p className="text-muted-foreground mt-1">Under Kenya DPA 2019 and GDPR</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <Eye className="h-5 w-5 text-primary mb-2" />
                    <CardTitle className="text-base">Right of Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Request a copy of all personal data we hold about you within 30 days.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <FileText className="h-5 w-5 text-primary mb-2" />
                    <CardTitle className="text-base">Right to Rectification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Update or correct inaccurate personal data through account settings.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <Trash2 className="h-5 w-5 text-primary mb-2" />
                    <CardTitle className="text-base">Right to Erasure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Request deletion subject to legal retention requirements (7 years for procurement).
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <Download className="h-5 w-5 text-primary mb-2" />
                    <CardTitle className="text-base">Right to Portability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Request your data in machine-readable format (JSON, CSV) for transfer.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Lodge a Complaint</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact the Office of the Data Protection Commissioner (Kenya): {' '}
                    <a href="https://www.odpc.go.ke" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      www.odpc.go.ke
                    </a>
                  </p>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 7: International Transfers */}
            <section className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Globe className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">7. International Data Transfers</h2>
                  <p className="text-muted-foreground mt-1">Cross-border data processing</p>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    Your data may be processed in Kenya or other countries where our service providers operate. 
                    We ensure appropriate safeguards including:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Standard Contractual Clauses (SCCs) with service providers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Data Processing Agreements with all vendors
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Encryption and pseudonymization for transfers
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Contact Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">8. Contact Us</h2>
              
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Data Protection Officer</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>ProcureChain Kenya Limited</p>
                        <p>Email: privacy@procurechain.co.ke</p>
                        <p>Phone: +254 (0) 20 123 4567</p>
                        <p>Address: Nairobi, Kenya</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Policy Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Material changes will be notified via email (30 days advance notice) 
                        and displayed on the platform. Continued use constitutes acceptance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Related Policies */}
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Related Policies:{' '}
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                {' | '}
                <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>
                {' | '}
                <a href="/data-protection" className="text-primary hover:underline">Data Protection Details</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;