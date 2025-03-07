
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Globe, BarChart4, Handshake, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OnboardingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Globe className="w-16 h-16 text-primary" />,
      title: "Welcome to ProcureChain",
      description: "The future of procurement is here. Transparent, secure, and efficient."
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-primary" />,
      title: "Blockchain Security",
      description: "All transactions are secured on the blockchain, ensuring immutability and transparency."
    },
    {
      icon: <FileCheck className="w-16 h-16 text-primary" />,
      title: "Paperless Tenders",
      description: "Submit and evaluate tenders digitally, reducing paperwork and increasing efficiency."
    },
    {
      icon: <BarChart4 className="w-16 h-16 text-primary" />,
      title: "Real-time Analytics",
      description: "Track procurement processes in real-time with powerful analytics tools."
    },
    {
      icon: <Handshake className="w-16 h-16 text-primary" />,
      title: "Connect with Suppliers",
      description: "A marketplace that connects buyers with qualified suppliers across Kenya."
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const skipAnimation = () => {
    navigate('/dashboard');
  };

  const dotVariants = {
    inactive: { scale: 0.8, opacity: 0.5 },
    active: { scale: 1, opacity: 1 }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Skip button */}
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4" 
        onClick={skipAnimation}
      >
        Skip <ArrowRight className="ml-2 w-4 h-4" />
      </Button>

      <div className="w-full max-w-md mx-auto text-center px-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2,
              duration: 0.5,
              type: "spring",
              stiffness: 100 
            }}
            className="mb-8"
          >
            {steps[currentStep].icon}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-semibold mb-4 tracking-tight"
          >
            {steps[currentStep].title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            {steps[currentStep].description}
          </motion.p>
        </motion.div>

        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              variants={dotVariants}
              initial="inactive"
              animate={index === currentStep ? "active" : "inactive"}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>

        {currentStep === steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12"
          >
            <Button 
              className="px-8 py-6 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OnboardingAnimation;
