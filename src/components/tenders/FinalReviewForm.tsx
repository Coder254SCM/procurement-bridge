
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FinalReviewFormProps {
  digitalSignature: boolean;
  onDigitalSignatureChange: () => void;
  submitting: boolean;
  onCancel: () => void;
  isFormValid: boolean;
}

const FinalReviewForm = ({
  digitalSignature,
  onDigitalSignatureChange,
  submitting,
  onCancel,
  isFormValid
}: FinalReviewFormProps) => {
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kenya Procurement Law Compliance</CardTitle>
          <CardDescription>
            This tender follows the Public Procurement and Asset Disposal Act (PPADA) 2015 and regulations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Procurement Standard</h3>
              <p className="text-sm text-muted-foreground">PPADA 2015 & PPADA Regulations 2020</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Anti-corruption Measures</h3>
              <p className="text-sm text-muted-foreground">Blockchain verification & AI pattern detection</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Supply Chain Review</h3>
              <p className="text-sm text-muted-foreground">Professional oversight by certified professionals</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Required Documentation</h3>
              <p className="text-sm text-muted-foreground">Statutory compliance with KRA, NSSF and NHIF</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="digital-signature" 
          checked={digitalSignature}
          onChange={onDigitalSignatureChange}
          className="rounded border-gray-300"
        />
        <label htmlFor="digital-signature" className="text-sm">
          Add digital signature and blockchain timestamp
        </label>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={submitting || !isFormValid}
        >
          {submitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Creating...
            </>
          ) : (
            'Create Tender'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalReviewForm;
