
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Plus, ArrowUpDown } from 'lucide-react';
import TenderCard, { TenderProps } from './TenderCard';

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

const TendersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTenders = fakeTenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || tender.category.toLowerCase().includes(category.toLowerCase());
    const matchesStatus = status === 'all' || tender.status === status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Tenders</h1>
        <Button className="ml-auto">
          <Plus className="w-4 h-4 mr-2" />
          Post New Tender
        </Button>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="browse" className="flex-1">Browse Tenders</TabsTrigger>
            <TabsTrigger value="my-tenders" className="flex-1">My Tenders</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <Button variant="ghost" className="flex-shrink-0">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-secondary/30 animate-fade-in">
                <div>
                  <label className="text-sm font-medium block mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="it">IT & Telecommunications</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <Select value={status} onValueChange={setStatus}>
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
                  <label className="text-sm font-medium block mb-2">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="nairobi">Nairobi County</SelectItem>
                      <SelectItem value="mombasa">Mombasa County</SelectItem>
                      <SelectItem value="kisumu">Kisumu County</SelectItem>
                      <SelectItem value="nakuru">Nakuru County</SelectItem>
                      <SelectItem value="kiambu">Kiambu County</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Value Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Value</SelectItem>
                      <SelectItem value="0-10m">0 - 10M KES</SelectItem>
                      <SelectItem value="10m-50m">10M - 50M KES</SelectItem>
                      <SelectItem value="50m-100m">50M - 100M KES</SelectItem>
                      <SelectItem value="100m+">Above 100M KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenders.length > 0 ? (
                filteredTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No tenders found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="my-tenders">
            <div className="bg-secondary/30 rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">My Tenders</h3>
              <p className="text-muted-foreground mb-4">View and manage tenders you've created or applied to</p>
              <Button>View My Tenders</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="bg-secondary/30 rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Saved Tenders</h3>
              <p className="text-muted-foreground mb-4">View tenders you've saved for later</p>
              <Button>Browse Saved Tenders</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TendersList;
