
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for small suppliers getting started',
      features: [
        'Up to 5 tender submissions per month',
        'Basic document storage (100MB)',
        'Standard verification',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: 'KES 5,000/month',
      description: 'For growing businesses and regular bidders',
      features: [
        'Unlimited tender submissions',
        'Enhanced document storage (10GB)',
        'Advanced blockchain verification',
        'Priority support',
        'Analytics dashboard',
        'Supplier performance tracking'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations and government entities',
      features: [
        'Everything in Professional',
        'Custom compliance frameworks',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Advanced audit trails',
        'Multi-tenant support'
      ]
    }
  ];

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Transparent pricing for Kenya's premier procurement platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.price === 'Free' ? 'Get Started' : 
                 plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Blockchain-Powered Security</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          All plans include our enterprise-grade Hyperledger Fabric blockchain integration 
          for document verification, audit trails, and transparency - completely free of gas fees.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
