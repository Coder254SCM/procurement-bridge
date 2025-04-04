
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SuppliersCardProps {
  supplierSearchTerm: string;
  setSupplierSearchTerm: (term: string) => void;
  supplierCategory: string;
  setSupplierCategory: (category: string) => void;
  supplierFilterOpen: boolean;
  setSupplierFilterOpen: (open: boolean) => void;
}

const SuppliersCard = ({
  supplierSearchTerm,
  setSupplierSearchTerm,
  supplierCategory,
  setSupplierCategory,
  supplierFilterOpen,
  setSupplierFilterOpen
}: SuppliersCardProps) => {
  return (
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
  );
};

export default SuppliersCard;
