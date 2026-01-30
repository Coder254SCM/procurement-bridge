
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: 'KES 8,000/year',
      description: 'Perfect for small suppliers getting started',
      features: [
        'Up to 10 tender submissions per month',
        'Basic supplier verification',
        'Document storage (500MB) via Supabase',
        'Email support',
        'Tender search & discovery',
        'Basic bid management',
        'Standard notifications'
      ],
      limitations: [
        'No team management',
        'No advanced analytics',
        'No API access'
      ]
    },
    {
      name: 'Professional',
      price: 'KES 20,000/year',
      description: 'For growing businesses and regular participants',
      features: [
        'Unlimited tender submissions',
        'Intermediate verification level',
        'Document storage (5GB) via Supabase',
        'Priority email support',
        'Full tender management',
        'Bid tracking & analytics',
        'Team members (up to 5)',
        'Contract management',
        'Requisition management',
        'Basic reporting dashboard',
        'Framework agreement access'
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
        'Advanced verification level',
        'Unlimited document storage',
        'Dedicated support channel',
        'Unlimited team members',
        'Advanced analytics dashboard',
        'Custom approval workflows',
        'Budget allocation tools',
        'E-catalog management',
        'Full audit trails',
        'Role-based access control',
        'Blockchain verification certificates',
        'AGPO compliance tracking',
        'Multi-organization support'
      ],
      badge: 'Enterprise'
    }
  ];

  const integrationStatus = [
    {
      name: 'Document Storage',
      description: 'Secure cloud storage via Supabase',
      status: 'Available',
      available: true
    },
    {
      name: 'Blockchain Verification',
      description: 'Certificate verification & audit trails',
      status: 'Available',
      available: true
    },
    {
      name: 'Real-time Notifications',
      description: 'In-app tender alerts and status updates',
      status: 'Available',
      available: true
    },
    {
      name: 'Email Notifications',
      description: 'External email alerts for deadlines',
      status: 'Planned',
      available: false
    },
    {
      name: 'Payment Gateway',
      description: 'Subscription payment processing',
      status: 'Planned',
      available: false
    }
  ];

  return (
    <div className="container py-10 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Simple, transparent pricing for Kenya's procurement platform. 
          All plans include core procurement features with secure document storage.
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
                  <p className="text-xs font-medium text-muted-foreground mb-2">Not included:</p>
                  <ul className="space-y-1">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-primary' : plan.badge === 'Enterprise' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                variant={plan.popular || plan.badge === 'Enterprise' ? 'default' : 'outline'}
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Status - Transparency Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Platform Capabilities</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          We believe in transparency. Here's what's available now and what's on our roadmap.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {integrationStatus.map((item, index) => (
            <Card key={index} className={item.available ? 'border-green-200' : 'border-gray-200'}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant={item.available ? 'default' : 'secondary'} className={item.available ? 'bg-green-100 text-green-800' : ''}>
                    {item.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            What's Included in All Plans
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure Storage</h3>
            <p className="text-sm text-muted-foreground">
              All documents stored securely with Supabase cloud infrastructure
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Live bid status tracking and tender deadline notifications
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">PWA Support</h3>
            <p className="text-sm text-muted-foreground">
              Install as an app on your device with automatic updates
            </p>
          </div>
        </div>
      </div>

      {/* Buyer vs Supplier Features */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle>For Buyers</CardTitle>
            <CardDescription>Organizations issuing tenders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Create & publish tenders</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Receive and evaluate bids</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Manage contracts & milestones</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Budget tracking & requisitions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Team & role management</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Procurement analytics</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>For Suppliers</CardTitle>
            <CardDescription>Businesses bidding on tenders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Discover tender opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Submit bids with documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Track bid status & history</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Company verification & KYC</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Contract performance tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Tender recommendation matching</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Questions about our platform? Contact us for a demo.
        </p>
        <Button size="lg" onClick={() => navigate('/auth')}>
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
