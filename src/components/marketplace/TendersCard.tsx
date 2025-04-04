
import React, { useState } from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TendersCardProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

const TendersCard = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sortOrder,
  setSortOrder,
  filterOpen,
  setFilterOpen
}: TendersCardProps) => {
  return (
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
  );
};

export default TendersCard;
