
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TenderProps } from '@/components/tenders/TenderCard';

export function useTenders() {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<TenderProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Supabase
        // For now we're using static data
        const fakeTenders: TenderProps[] = [
          {
            id: "T1001",
            title: "Supply and Installation of IT Equipment for County Offices",
            organization: "Ministry of ICT",
            location: "Nairobi County",
            category: "IT & Telecommunications",
            description: "Provision of desktop computers, laptops, printers and networking equipment for county government offices across Nairobi county.",
            deadline: "Jul 15, 2023",
            daysLeft: 12,
            submissions: 8,
            value: "KES 12,500,000",
            status: 'open'
          },
          {
            id: "T1002",
            title: "Construction of Health Center in Kiambu County",
            organization: "Ministry of Health",
            location: "Kiambu County",
            category: "Construction",
            description: "Construction of a new health center including outpatient facilities, maternity ward, laboratory and pharmacy services.",
            deadline: "Jul 22, 2023",
            daysLeft: 19,
            submissions: 5,
            value: "KES 35,800,000",
            status: 'open'
          },
          {
            id: "T1003",
            title: "Supply of School Textbooks and Learning Materials",
            organization: "Ministry of Education",
            location: "Countrywide",
            category: "Education",
            description: "Supply and delivery of approved curriculum textbooks and learning materials for primary and secondary schools across Kenya.",
            deadline: "Jul 10, 2023",
            daysLeft: 7,
            submissions: 12,
            value: "KES 28,000,000",
            status: 'open'
          },
          {
            id: "T1004",
            title: "Renovation of Government Office Buildings",
            organization: "Ministry of Public Works",
            location: "Mombasa County",
            category: "Construction",
            description: "Renovation and refurbishment of government office buildings in Mombasa including painting, electrical repairs, plumbing and general renovations.",
            deadline: "Jun 25, 2023",
            daysLeft: 0,
            submissions: 9,
            value: "KES 15,750,000",
            status: 'evaluation'
          },
          {
            id: "T1005",
            title: "Supply of Medical Equipment and Supplies",
            organization: "Ministry of Health",
            location: "Kisumu County",
            category: "Medical",
            description: "Supply of medical equipment, pharmaceutical products and general hospital supplies for public hospitals in Kisumu county.",
            deadline: "Jun 18, 2023",
            daysLeft: 0,
            submissions: 15,
            value: "KES 22,300,000",
            status: 'awarded'
          },
          {
            id: "T1006",
            title: "Agricultural Irrigation Systems Installation",
            organization: "Ministry of Agriculture",
            location: "Nakuru County",
            category: "Agriculture",
            description: "Design and installation of irrigation systems for agricultural demonstration farms in Nakuru county.",
            deadline: "Jun 15, 2023",
            daysLeft: 0,
            submissions: 7,
            value: "KES 18,450,000",
            status: 'closed'
          }
        ];

        setTenders(fakeTenders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load marketplace tenders",
        });
        setLoading(false);
      }
    };

    fetchTenders();
  }, [toast]);

  return { tenders, loading };
}
