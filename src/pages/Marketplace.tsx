import React, { useState, useEffect } from 'react';
import { ArrowDown, Filter, Search, SortAsc, SortDesc, Users, Building, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const [activeTab, setActiveTab] = useState('tenders');

  // Simulated supplier data
  const suppliers = [
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

  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('all');
  const [supplierFilterOpen, setSupplierFilterOpen] = useState(false);

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

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
                          supplier.description.toLowerCase().includes(supplierSearchTerm.toLowerCase());
    const matchesCategory = supplierCategory === 'all' || supplier.category.toLowerCase().includes(supplierCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Procurement Marketplace</h1>
        <p className="text-muted-foreground">
          Connect with tenders and suppliers in one centralized platform. Contact us at: 
          <span className="ml-1 font-medium">+254115852616</span> | 
          <span className="ml-1 font-medium">procurechain@tenderzville-portal.co.ke</span>
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="tenders">Discover Tenders</TabsTrigger>
          <TabsTrigger value="suppliers">Find Suppliers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenders" className="mt-0">
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
          
          <Tabs defaultValue="all" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-0">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Find Qualified Suppliers</CardTitle>
              <CardDescription>
                Browse verified suppliers across various industries and connect with them directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers by name or industry..."
                    className="pl-10"
                    value={supplierSearchTerm}
                    onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setSupplierFilterOpen(!supplierFilterOpen)}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
              
              {supplierFilterOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg mb-4 animate-in fade-in-50">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry Category</label>
                    <Select value={supplierCategory} onValueChange={setSupplierCategory}>
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
                        <SelectItem value="Security Services">Security Services</SelectItem>
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
                        <SelectItem value="kiambu">Kiambu County</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Verification Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Suppliers</SelectItem>
                        <SelectItem value="verified">Verified Only</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {supplier.location}
                          </div>
                        </div>
                      </div>
                      {supplier.verified && (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2 text-sm">
                      <Badge variant="secondary" className="mr-2">
                        {supplier.category}
                      </Badge>
                      <span className="text-yellow-500 flex items-center">
                        ★ {supplier.rating}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-muted-foreground">
                        {supplier.completedProjects} projects completed
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {supplier.description}
                    </p>
                    <div className="text-sm">
                      <strong>Contact:</strong> {supplier.contact}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-1">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm">Contact Supplier</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No suppliers found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
