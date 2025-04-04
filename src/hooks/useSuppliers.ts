
import { useState } from 'react';
import { SupplierProps } from '@/components/marketplace/SupplierCard';

export function useSuppliers() {
  // Simulated supplier data
  const suppliers: SupplierProps[] = [
    {
      id: "S1001",
      name: "TechSolutions Ltd",
      category: "IT & Telecommunications",
      location: "Nairobi County",
      verified: true,
      rating: 4.8,
      completedProjects: 24,
      description: "Specialized in IT infrastructure, networking and software solutions for government and private institutions.",
      contact: "+254 712 345 678"
    },
    {
      id: "S1002",
      name: "BuildRight Construction",
      category: "Construction",
      location: "Mombasa County",
      verified: true,
      rating: 4.6,
      completedProjects: 18,
      description: "Construction company specializing in commercial and institutional building projects across Kenya.",
      contact: "+254 723 456 789"
    },
    {
      id: "S1003",
      name: "MediEquip Suppliers",
      category: "Medical",
      location: "Kisumu County",
      verified: true,
      rating: 4.7,
      completedProjects: 32,
      description: "Leading supplier of medical equipment, pharmaceuticals and hospital supplies for healthcare institutions.",
      contact: "+254 734 567 890"
    },
    {
      id: "S1004",
      name: "EduResources Kenya",
      category: "Education",
      location: "Nakuru County",
      verified: false,
      rating: 4.2,
      completedProjects: 15,
      description: "Provider of educational resources, textbooks and learning materials for schools and educational institutions.",
      contact: "+254 745 678 901"
    },
    {
      id: "S1005",
      name: "AgriTech Solutions",
      category: "Agriculture",
      location: "Kiambu County",
      verified: true,
      rating: 4.5,
      completedProjects: 21,
      description: "Agricultural technology and irrigation systems providers focusing on modern farming solutions.",
      contact: "+254 756 789 012"
    },
    {
      id: "S1006",
      name: "SafeGuard Security",
      category: "Security Services",
      location: "Nairobi County",
      verified: true,
      rating: 4.9,
      completedProjects: 42,
      description: "Comprehensive security services including personnel, equipment and electronic surveillance systems.",
      contact: "+254 767 890 123"
    }
  ];

  return { suppliers };
}
