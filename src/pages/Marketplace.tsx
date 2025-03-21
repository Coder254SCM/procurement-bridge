
import React, { useState, useEffect } from 'react';
import { ArrowDown, Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { TenderProps } from '@/components/tenders/TenderCard';
import TenderCard from '@/components/tenders/TenderCard';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<TenderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);

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

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || tender.category.toLowerCase().includes(category.toLowerCase());
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
  });

  return (
    <div className="container py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Tender Marketplace</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Find Opportunities</CardTitle>
            <CardDescription>
              Browse open tenders from various government agencies and private institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders by keyword..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  Deadline
                </Button>
              </div>
            </div>
            
            {filterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg mb-4 animate-in fade-in-50">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="IT & Telecommunications">IT & Telecommunications</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select defaultValue="open">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="evaluation">Under Evaluation</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="nairobi">Nairobi County</SelectItem>
                      <SelectItem value="mombasa">Mombasa County</SelectItem>
                      <SelectItem value="kisumu">Kisumu County</SelectItem>
                      <SelectItem value="nakuru">Nakuru County</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Budget</SelectItem>
                      <SelectItem value="0-5m">0 - 5M KES</SelectItem>
                      <SelectItem value="5m-20m">5M - 20M KES</SelectItem>
                      <SelectItem value="20m-50m">20M - 50M KES</SelectItem>
                      <SelectItem value="50m+">Above 50M KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Tenders</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="awarded">Awarded</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-40 bg-secondary/40"></CardHeader>
                  <CardContent className="mt-4">
                    <div className="h-6 w-3/4 bg-secondary/60 rounded mb-4"></div>
                    <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
                    <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-secondary/40 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredTenders.length > 0 ? (
              filteredTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No tenders found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="open" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.filter(t => t.status === 'open').map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="awarded" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.filter(t => t.status === 'awarded').map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.filter(t => t.status === 'closed').map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
