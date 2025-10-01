import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight
} from 'lucide-react';

const EnterpriseServices = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">Enterprise Solutions</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Enterprise Procurement Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Custom integrations, dedicated support, and advanced features for large organizations requiring seamless connectivity with existing systems like SAP Ariba, Oracle, and custom ERP platforms.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Link2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Seamless Integration</CardTitle>
              <CardDescription>
                Connect ProcureChain with your existing SAP, Oracle, or custom ERP systems
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <HeadphonesIcon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Dedicated Support</CardTitle>
              <CardDescription>
                24/7 technical support with dedicated account management and SLA guarantees
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Advanced security features, private blockchain nodes, and custom compliance controls
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Service Offerings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Enterprise Service Offerings</h2>
          
          <div className="space-y-6">
            {/* SAP Ariba Integration */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Database className="h-6 w-6 text-blue-600" />
                      SAP Ariba Integration
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Bi-directional synchronization with SAP Ariba Procurement and Sourcing
                    </CardDescription>
                  </div>
                  <Badge>Popular</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Real-time tender and supplier data synchronization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Automatic purchase order creation and tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Invoice reconciliation and payment integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Supplier master data management</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Implementation Timeline:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Week 1-2: Discovery and requirements analysis</li>
                      <li>• Week 3-6: Integration development and testing</li>
                      <li>• Week 7-8: UAT and deployment</li>
                      <li>• Ongoing: Support and optimization</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-semibold">Starting at $15,000</p>
                      <p className="text-xs text-muted-foreground">One-time implementation + monthly support</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Oracle Integration */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Workflow className="h-6 w-6 text-purple-600" />
                  Oracle Procurement Cloud Integration
                </CardTitle>
                <CardDescription className="mt-2">
                  Complete integration with Oracle Cloud Procurement and Oracle E-Business Suite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Capabilities:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Requisition-to-pay process automation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Contract lifecycle management sync</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Budget and financial controls integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Approval workflow synchronization</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="p-3 bg-purple-50 rounded">
                      <p className="text-sm font-semibold">Starting at $18,000</p>
                      <p className="text-xs text-muted-foreground">Custom pricing based on scope</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom ERP Integration */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-green-600" />
                  Custom ERP & System Integration
                </CardTitle>
                <CardDescription className="mt-2">
                  Tailored integration solutions for proprietary or custom enterprise systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">What We Integrate:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Microsoft Dynamics 365</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>NetSuite Procurement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Custom-built procurement systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Legacy government systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Financial management systems</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Integration Methods:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• RESTful API connections</li>
                      <li>• SOAP web services</li>
                      <li>• File-based ETL processes</li>
                      <li>• Real-time webhook integrations</li>
                      <li>• Middleware and iPaaS solutions</li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <p className="text-sm font-semibold">Quote-based pricing</p>
                      <p className="text-xs text-muted-foreground">Contact us for assessment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                  Advanced Analytics & Reporting
                </CardTitle>
                <CardDescription className="mt-2">
                  Custom dashboards, predictive analytics, and executive reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>AI-powered spend analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Supplier risk prediction models</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Custom KPI tracking and alerts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Executive dashboards and reports</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="p-3 bg-orange-50 rounded">
                      <p className="text-sm font-semibold">$2,500/month</p>
                      <p className="text-xs text-muted-foreground">Add-on to enterprise subscription</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training & Support */}
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Enterprise Training & Support
                </CardTitle>
                <CardDescription className="mt-2">
                  Comprehensive training programs and dedicated support for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">On-site Training</h4>
                    <ul className="text-sm space-y-1">
                      <li>• User role training</li>
                      <li>• Admin training</li>
                      <li>• Technical workshops</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">24/7 Support</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Dedicated account manager</li>
                      <li>• Priority ticket handling</li>
                      <li>• Emergency hotline</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">SLA Guarantees</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 99.9% uptime commitment</li>
                      <li>• 1-hour critical response</li>
                      <li>• Quarterly reviews</li>
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
              Contact our enterprise team to discuss your specific requirements and get a customized solution proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = 'mailto:enterprise@procurechain.co.ke'}
              >
                Contact Enterprise Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = 'tel:+254700000000'}
              >
                Call +254 700 000 000
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Enterprise inquiries typically receive a response within 24 hours
            </p>
          </CardContent>
        </Card>

        {/* Case Studies Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Trusted by Leading Organizations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Government Ministry</CardTitle>
                <CardDescription>SAP Ariba Integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrated ProcureChain with existing SAP infrastructure, processing over 500 tenders annually with 99.8% system uptime.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">County Government</CardTitle>
                <CardDescription>Custom ERP Integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connected legacy procurement system to ProcureChain, reducing processing time by 60% and improving transparency.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">State Corporation</CardTitle>
                <CardDescription>Oracle Cloud Integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Seamless Oracle Cloud integration enabling real-time budget tracking and automated approval workflows.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseServices;
