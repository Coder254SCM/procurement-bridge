
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TenderDetailCardsProps {
  description?: string;
  technicalDetails?: any;
  documents?: any;
}

const TenderDetailCards: React.FC<TenderDetailCardsProps> = ({
  description,
  technicalDetails,
  documents
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tender Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{description || 'No description available'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            {technicalDetails ? (
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap">
                {JSON.stringify(technicalDetails, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No technical details provided</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {documents && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attached Documents</CardTitle>
            <CardDescription>
              Review these documents before submitting your evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(documents || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{key}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TenderDetailCards;
