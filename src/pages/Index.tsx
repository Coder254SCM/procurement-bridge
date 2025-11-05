import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroBg from '@/assets/home-hero-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <img 
              src="/lovable-uploads/2767cbb7-f0e0-4434-a008-9c44991b8a8b.png" 
              alt="ProcureChain Logo" 
              className="h-20 w-auto mx-auto mb-8" 
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Blockchain-Powered Procurement Platform
            </h1>
            <p className="text-xl mb-8 text-foreground/80">
              Secure, transparent, and efficient tender management with immutable blockchain verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="button-hover-effect" asChild>
                <Link to="/tenders">
                  Browse Tenders
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                <Link to="/auth">
                  Sign In / Register
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center mt-12 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-green-500"><path d="M20 7L9 18l-5-5"/></svg>
                <span className="text-sm">Verified Tenders</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-blue-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a2 2 0 0 0 2-2v-6a4 4 0 0 1 4-4h6"/></svg>
                <span className="text-sm">Secure Transactions</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-yellow-500"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-8.49a6 6 0 0 1 8.48 8.49"/></svg>
                <span className="text-sm">Full Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 bg-secondary/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Blockchain Verification</h3>
              <p className="text-foreground/80">Ensure every tender and transaction is immutably recorded on the blockchain for unparalleled transparency.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 bg-secondary/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Automated Compliance</h3>
              <p className="text-foreground/80">Streamline compliance with built-in regulatory checks and automated reporting.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 bg-secondary/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-foreground/80">Protect sensitive data with end-to-end encryption and multi-factor authentication.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Procurement Process?</h2>
            <p className="text-lg mb-8 text-foreground/80">
              Join organizations across Kenya already using ProcureChain to ensure compliance, transparency, and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="button-hover-effect" asChild>
                <Link to="/auth">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                <Link to="/marketplace">
                  Explore Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
