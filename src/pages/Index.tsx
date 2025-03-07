
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Shield, BarChart, Handshake, ArrowRight } from "lucide-react";
import OnboardingAnimation from "@/components/onboarding/OnboardingAnimation";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if the user has seen the onboarding animation before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      // If not, show the onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <>
      {showOnboarding && <OnboardingAnimation onClose={handleCloseOnboarding} />}
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-balance font-bold">Revolutionizing Procurement Through Blockchain</h1>
                <p className="text-xl text-muted-foreground">
                  Transparent, secure, and efficient tendering on the blockchain.
                  Eliminating corruption and streamlining the entire procurement process.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" onClick={handleStartOnboarding}>
                    Learn How It Works
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/dashboard">
                      Browse Tenders <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="glass-card p-8 rounded-2xl">
                <img 
                  src="/placeholder.svg" 
                  alt="Blockchain procurement" 
                  className="w-full h-auto rounded-lg" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="mb-4">Blockchain-Powered Procurement</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform transforms the entire tendering process using secure blockchain technology, 
                ensuring transparency, efficiency, and accountability.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card p-6 rounded-xl hover-lift">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Digital Tenders</h3>
                <p className="text-muted-foreground">
                  Create, submit, and evaluate tenders digitally with immutable records
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Tamper-Proof</h3>
                <p className="text-muted-foreground">
                  Blockchain security ensures all data remains authentic and unaltered
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Track and analyze procurement data for better decision making
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover-lift">
                <Handshake className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Supplier Marketplace</h3>
                <p className="text-muted-foreground">
                  Connect with verified suppliers for all your procurement needs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="mb-6">Ready to Transform Your Procurement Process?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join organizations across Kenya that are eliminating corruption and inefficiency 
              in procurement through our blockchain platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={handleStartOnboarding}>
                Explore How It Works
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
