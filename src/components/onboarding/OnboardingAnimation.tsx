
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Link, 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  Users, 
  Award, 
  ArrowRight,
  BarChart4,
  Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OnboardingAnimationProps {
  onClose: () => void;
}

const OnboardingAnimation = ({ onClose }: OnboardingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FileText className="w-16 h-16 text-primary" />,
      title: "Tenders On Blockchain",
      description: "Welcome to ProcureChain, where tender processes are transparent, secure, and efficient on the blockchain."
    },
    {
      icon: <Users className="w-16 h-16 text-primary" />,
      title: "Tender Creation",
      description: "Buyers create digital tenders with requirements and evaluation criteria, secured and timestamped on the blockchain."
    },
    {
      icon: <Link className="w-16 h-16 text-primary" />,
      title: "Immutable Record",
      description: "Each tender is stored as a block in the chain, creating an unchangeable record that prevents manipulation."
    },
    {
      icon: <FileCheck className="w-16 h-16 text-primary" />,
      title: "Supplier Submissions",
      description: "Suppliers submit proposals with encrypted document hashes stored on-chain, ensuring document integrity."
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-primary" />,
      title: "Transparent Evaluation",
      description: "Evaluation criteria are executed through smart contracts, eliminating bias and ensuring fair assessment."
    },
    {
      icon: <Lock className="w-16 h-16 text-primary" />,
      title: "Secure Selection",
      description: "The winning bid is selected through consensus mechanisms, with the entire process verifiable by all stakeholders."
    },
    {
      icon: <Award className="w-16 h-16 text-primary" />,
      title: "Contract Execution",
      description: "Smart contracts automatically execute agreed terms, ensuring compliance and expediting payments."
    },
    {
      icon: <BarChart4 className="w-16 h-16 text-primary" />,
      title: "Real-time Analytics",
      description: "Track the entire procurement journey with transparent analytics available to all authorized parties."
    },
    {
      icon: <Handshake className="w-16 h-16 text-primary" />,
      title: "Supplier Marketplace",
      description: "Connect with verified suppliers on our blockchain-powered marketplace for future procurement needs."
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); // Increased time to allow users to read the content
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const skipAnimation = () => {
    onClose();
    navigate('/dashboard');
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      navigate('/dashboard');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const dotVariants = {
    inactive: { scale: 0.8, opacity: 0.5 },
    active: { scale: 1, opacity: 1 }
  };

  // Animation variants for blockchain connection visuals
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50">
      {/* Skip button */}
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4" 
        onClick={skipAnimation}
      >
        Skip <ArrowRight className="ml-2 w-4 h-4" />
      </Button>

      <div className="w-full max-w-3xl mx-auto text-center px-4">
        {/* Blockchain animation container */}
        <motion.div
          className="relative mb-12 h-20 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-full h-full" viewBox="0 0 800 80">
            {/* Blockchain connection lines */}
            {[...Array(8)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${90 + i * 80},40 L${170 + i * 80},40`}
                stroke="#1E88E5"
                strokeWidth="2"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                animate={currentStep > i ? "visible" : "hidden"}
              />
            ))}
            
            {/* Blockchain nodes */}
            {steps.map((_, i) => (
              <motion.circle
                key={i}
                cx={90 + i * 80}
                cy="40"
                r="12"
                fill={currentStep >= i ? "#1E88E5" : "#E0E0E0"}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300
                  }
                }}
              />
            ))}
          </svg>
        </motion.div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center glass-card p-8"
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
            className="mb-8 p-4 rounded-full bg-primary/10"
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
            className="text-muted-foreground mb-8 max-w-xl"
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
              onClick={() => setCurrentStep(index)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={goToNextStep}
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
