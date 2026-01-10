
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'KES 8,000/year',
      description: 'Perfect for small suppliers getting started',
      features: [
        'Up to 5 tender submissions per month',
        'Basic verification level access',
        'Standard document storage (500MB)',
        'Email support',
        'Basic marketplace access',
        'Standard notification system'
      ],
      limitations: [
        'No advanced verification levels',
        'Limited compliance frameworks',
        'No API access'
      ]
    },
    {
      name: 'Professional',
      price: 'KES 20,000/year',
      description: 'For growing businesses and regular participants',
      features: [
        'Unlimited tender submissions',
        'Intermediate verification level access',
        'Enhanced document storage (10GB)',
        'Priority email & chat support',
        'Advanced marketplace features',
        'Real-time notifications',
        'Basic analytics dashboard',
        'Multi-role support',
        'Contract management tools',
        'Advanced evaluation criteria access',
        'Team members (up to 5)'
      ],
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: 'KES 50,000/year',
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Professional',
        'Advanced verification level access',
        'Unlimited document storage',
        'Dedicated account manager',
        'Phone & video support',
        'Custom compliance frameworks',
        'Advanced analytics & reporting',
        'API access with rate limits',
        'Blockchain certificate priority',
        'Advanced behavior analysis',
        'Custom evaluation workflows',
        'Multi-organization management',
        'Full regulatory compliance suite',
        'PPRA integration & reporting',
        'KRA direct integration',
        'Custom procurement methods',
        'Advanced audit trails',
        'Unlimited team members',
        '24/7 priority support'
      ],
      badge: 'Enterprise'
    }
  ];

  const verificationLevels = [
    {
      level: 'Basic',
      description: 'Identity & business registration verification',
      plans: ['Starter', 'Professional', 'Enterprise']
    },
    {
      level: 'Intermediate',
      description: 'Financial records & tax compliance verification',
      plans: ['Professional', 'Enterprise']
    },
    {
      level: 'Advanced',
      description: 'Full compliance & blockchain certification',
      plans: ['Enterprise']
    }
  ];

  const complianceFeatures = [
    {
      name: 'KYC/AML Compliance',
      description: 'Know Your Customer and Anti-Money Laundering checks',
      plans: ['Professional', 'Enterprise']
    },
    {
      name: 'Tax Compliance (KRA)',
      description: 'Direct integration with Kenya Revenue Authority',
      plans: ['Enterprise']
    },
    {
      name: 'PPRA Compliance',
      description: 'Public Procurement Regulatory Authority compliance',
      plans: ['Enterprise']
    },
    {
      name: 'Custom Frameworks',
      description: 'Industry-specific compliance frameworks',
      plans: ['Enterprise']
    }
  ];

  return (
    <div className="container py-10 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transparent pricing for Kenya's premier blockchain-powered procurement platform. 
          All plans include our enterprise-grade Hyperledger Fabric blockchain integration.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : plan.badge === 'Enterprise' ? 'border-purple-500 shadow-lg' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className={`px-3 py-1 ${
                  plan.popular ? 'bg-primary text-primary-foreground' : 
                  plan.badge === 'Enterprise' ? 'bg-purple-600 text-white' : 'bg-secondary'
                }`}>
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {plan.badge === 'Enterprise' && <Shield className="h-5 w-5 text-purple-600" />}
                {plan.popular && <Star className="h-5 w-5 text-primary" />}
                {plan.name}
              </CardTitle>
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.limitations && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Limitations:</p>
                  <ul className="space-y-1">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="text-xs text-muted-foreground">
                        • {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-primary' : plan.badge === 'Enterprise' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                variant={plan.popular || plan.badge === 'Enterprise' ? 'default' : 'outline'}
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Levels Comparison */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Verification Levels by Plan</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {verificationLevels.map((level, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  {level.level} Verification
                </CardTitle>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {level.plans.map((planName, planIndex) => (
                    <Badge key={planIndex} variant="outline" className="mr-1">
                      {planName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliance Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Compliance Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {complianceFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{feature.name}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {feature.plans.map((planName, planIndex) => (
                    <Badge key={planIndex} variant="secondary" className="text-xs mr-1">
                      {planName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Blockchain & Security */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Blockchain-Powered Security
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            All plans include our enterprise-grade Hyperledger Fabric blockchain integration 
            for document verification, audit trails, and transparency - completely free of gas fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Immutable Records</h3>
            <p className="text-sm text-muted-foreground">
              All verification certificates and transaction records stored permanently on blockchain
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Transparent Process</h3>
            <p className="text-sm text-muted-foreground">
              Complete audit trail for all procurement activities with cryptographic proof
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Contracts</h3>
            <p className="text-sm text-muted-foreground">
              Automated contract execution with milestone-based payments and compliance triggers
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">14 procurement methods supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">35+ evaluation criteria categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">12 specialized user roles</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Advanced behavior analysis & fraud detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Real-time compliance monitoring</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Support & Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Comprehensive user documentation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Role-specific training programs</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm">API documentation & support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Dedicated account management (Enterprise)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-600" />
              <span className="text-sm">24/7 priority support (Enterprise)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">
          All plans include a 30-day free trial. No setup fees. Cancel anytime.
        </p>
        <Button size="lg" className="mr-4">
          Start Free Trial
        </Button>
        <Button size="lg" variant="outline">
          Schedule Demo
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
