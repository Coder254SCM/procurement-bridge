
import { useState, useEffect } from 'react';
import { SupplierProps } from '@/components/marketplace/SupplierCard';
import { VerificationDetails } from '@/components/marketplace/SupplierVerificationBadge';

export function useSuppliers() {
  // Simulated supplier data with blockchain verification details
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
      contact: "+254 712 345 678",
      verification: {
        status: 'verified',
        level: 'advanced',
        lastVerified: '2024-03-15T08:30:00Z',
        blockchainTxId: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        verificationScore: 92,
        completedProjects: 24,
        performanceRating: 4.8
      }
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
      contact: "+254 723 456 789",
      verification: {
        status: 'verified',
        level: 'standard',
        lastVerified: '2024-02-28T14:15:00Z',
        blockchainTxId: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verificationScore: 85,
        completedProjects: 18,
        performanceRating: 4.6
      }
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
      contact: "+254 734 567 890",
      verification: {
        status: 'verified',
        level: 'advanced',
        lastVerified: '2024-03-05T10:45:00Z',
        blockchainTxId: '0x5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
        verificationScore: 89,
        completedProjects: 32,
        performanceRating: 4.7
      }
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
      contact: "+254 745 678 901",
      verification: {
        status: 'pending',
        level: 'basic',
        lastVerified: undefined,
        blockchainTxId: undefined,
        verificationScore: 65,
        completedProjects: 15,
        performanceRating: 4.2
      }
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
      contact: "+254 756 789 012",
      verification: {
        status: 'verified',
        level: 'standard',
        lastVerified: '2024-01-20T13:25:00Z',
        blockchainTxId: '0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        verificationScore: 82,
        completedProjects: 21,
        performanceRating: 4.5
      }
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
      contact: "+254 767 890 123",
      verification: {
        status: 'verified',
        level: 'advanced',
        lastVerified: '2024-03-18T16:10:00Z',
        blockchainTxId: '0xd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        verificationScore: 95,
        completedProjects: 42,
        performanceRating: 4.9
      }
    }
  ];

  return { suppliers };
}
