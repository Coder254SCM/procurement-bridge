
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TenderProps } from '@/components/tenders/TenderCard';
import TenderCard from '@/components/tenders/TenderCard';

export interface TendersTabContentProps {
  filteredTenders: TenderProps[];
  loading: boolean;
}

const TendersTabContent = ({ filteredTenders = [], loading = false }: TendersTabContentProps) => {
  return (
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
                <div className="h-40 bg-secondary/40"></div>
                <div className="mt-4 p-6">
                  <div className="h-6 w-3/4 bg-secondary/60 rounded mb-4"></div>
                  <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
                  <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-secondary/40 rounded"></div>
                </div>
              </Card>
            ))
          ) : filteredTenders && filteredTenders.length > 0 ? (
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
          {filteredTenders && filteredTenders.filter(t => t.status === 'open').map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="awarded" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenders && filteredTenders.filter(t => t.status === 'awarded').map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="closed" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenders && filteredTenders.filter(t => t.status === 'closed').map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TendersTabContent;
