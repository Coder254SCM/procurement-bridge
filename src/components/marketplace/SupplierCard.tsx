
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface SupplierProps {
  id: string;
  name: string;
  category: string;
  location: string;
  verified: boolean;
  rating: number;
  completedProjects: number;
  description: string;
  contact: string;
}

interface SupplierCardProps {
  supplier: SupplierProps;
}

const SupplierCard = ({ supplier }: SupplierCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

export default SupplierCard;
