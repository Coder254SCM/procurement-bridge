import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Workflow,
  Shield,
  Zap,
  HeadphonesIcon,
  Database,
  Link2,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Factory,
} from 'lucide-react';

const EnterpriseServices = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">For Private Sector Organizations</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Procurement that Scales with Your Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ProcureChain is built for private sector procurement — from growing SMEs to multinational enterprises.
            Tailor the platform to your organization size, integrate with your ERP, and run sourcing, bidding,
            and contracting on a single transparent system.
          </p>
        </div>

        {/* Organization Sizes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Built for Every Organization Size</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Choose the configuration that fits your team today and scale as you grow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Briefcase className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Small & Mid-Sized Businesses</CardTitle>
                <CardDescription>
                  Lean teams that need fast, structured sourcing without heavy IT setup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Self-serve onboarding</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Pre-built RFQ & tender templates</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Supplier marketplace access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Building2 className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Mid-Market Enterprises</CardTitle>
                <CardDescription>
                  Multi-department organizations needing approvals, budgets, and analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Approval workflows & roles</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Budget allocation & tracking</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Framework agreements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Factory className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Large & Multinational Enterprises</CardTitle>
                <CardDescription>
                  Complex organizations with ERP integrations and global supplier bases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> ERP & finance system integration</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Private blockchain nodes</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Dedicated success manager</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Link2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Seamless Integration</CardTitle>
              <CardDescription>
                Connect ProcureChain with your existing ERP, finance, and HR systems
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <HeadphonesIcon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Dedicated Support</CardTitle>
              <CardDescription>
                Priority support with account management and SLA options for larger plans
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Role-based access, audit trails, and blockchain-verified procurement records
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Service Offerings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Enterprise Capabilities</h2>

          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Database className="h-6 w-6 text-primary" />
                  ERP & Finance System Integration
                </CardTitle>
                <CardDescription className="mt-2">
                  Bi-directional synchronization with leading ERP platforms and custom systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Supported Systems:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> SAP / SAP Ariba</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Oracle Cloud / E-Business Suite</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Microsoft Dynamics 365</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> NetSuite, QuickBooks, Xero</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Custom in-house systems via API</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Integration Methods:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• RESTful APIs and webhooks</li>
                      <li>• SOAP web services</li>
                      <li>• File-based ETL (CSV, XML, JSON)</li>
                      <li>• Middleware / iPaaS connectors</li>
                      <li>• Real-time event streaming</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Workflow className="h-6 w-6 text-primary" />
                  Procurement Workflow Automation
                </CardTitle>
                <CardDescription className="mt-2">
                  Configure approval chains, budgets, and contract lifecycle to match your policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Requisition-to-pay automation</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Multi-tier approval workflows</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Contract lifecycle management</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Budget controls & encumbrance tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Advanced Analytics & Reporting
                </CardTitle>
                <CardDescription className="mt-2">
                  Custom dashboards, predictive analytics, and executive-level reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> AI-powered spend analysis</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Supplier risk prediction</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Custom KPI tracking & alerts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> Executive dashboards & exports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Training & Support
                </CardTitle>
                <CardDescription className="mt-2">
                  Onboarding, training, and ongoing success programs for your teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Onboarding</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Guided implementation</li>
                      <li>• Role-based training</li>
                      <li>• Admin workshops</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Support Tiers</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Standard email support</li>
                      <li>• Priority response queue</li>
                      <li>• Dedicated account manager</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">SLA Options</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Uptime commitments</li>
                      <li>• Response-time targets</li>
                      <li>• Quarterly business reviews</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Procurement?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Talk to our team about your organization's needs and we'll tailor a plan that fits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseServices;
