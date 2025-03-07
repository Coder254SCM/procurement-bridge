
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Building, MapPin, Tag } from 'lucide-react';

export interface TenderProps {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  description: string;
  deadline: string;
  daysLeft: number;
  submissions: number;
  value: string;
  status: 'open' | 'closed' | 'evaluation' | 'awarded';
}

const TenderCard: React.FC<{ tender: TenderProps }> = ({ tender }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'closed':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'evaluation':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'awarded':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'evaluation':
        return 'Under Evaluation';
      case 'awarded':
        return 'Awarded';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="overflow-hidden hover-lift transition-all h-full flex flex-col">
      <CardHeader className="pb-4 relative">
        <div className="space-y-1 mb-1">
          <div className="flex items-center justify-between">
            <Badge 
              className={`${getStatusColor(tender.status)} font-medium`} 
              variant="outline"
            >
              {getStatusLabel(tender.status)}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">#{tender.id}</span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{tender.title}</h3>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Building className="h-3.5 w-3.5 mr-1" />
          <span>{tender.organization}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {tender.description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span>{tender.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            <span>{tender.category}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>{tender.deadline}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {tender.status === 'open' 
                ? `${tender.daysLeft} day${tender.daysLeft !== 1 ? 's' : ''} left` 
                : 'Deadline passed'}
            </span>
          </div>
        </div>
        
        {tender.value && (
          <div className="mt-4 flex items-center">
            <div className="bg-secondary/70 rounded-lg py-1.5 px-3">
              <span className="text-xs font-medium text-foreground/80">Estimated Value:</span>
              <span className="text-sm font-semibold ml-1.5 text-foreground">{tender.value}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex items-center justify-between border-t border-border pt-4 mt-auto">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          <span>{tender.submissions} submission{tender.submissions !== 1 ? 's' : ''}</span>
        </div>
        
        <Button className="ml-auto">
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderCard;
