
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, FileCheck, AlertTriangle } from 'lucide-react';

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
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Kenya Procurement Law Compliance</CardTitle>
              <CardDescription>
                This tender follows the Public Procurement and Asset Disposal Act (PPADA) 2015 and regulations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Procurement Standard</h3>
              <p className="text-sm text-muted-foreground">PPADA 2015 & PPADA Regulations 2020</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Anti-corruption Measures</h3>
              <p className="text-sm text-muted-foreground">Blockchain verification & AI pattern detection</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Supply Chain Review</h3>
              <p className="text-sm text-muted-foreground">Professional oversight by certified professionals</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Required Documentation</h3>
              <p className="text-sm text-muted-foreground">Statutory compliance with KRA, NSSF and NHIF</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center space-x-2 p-4 border rounded-md">
        <Checkbox 
          id="digital-signature" 
          checked={digitalSignature}
          onCheckedChange={onDigitalSignatureChange}
        />
        <label 
          htmlFor="digital-signature" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add digital signature and blockchain timestamp
        </label>
      </div>
      
      {!isFormValid && (
        <div className="flex p-3 rounded-md items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm">Please ensure all required fields are completed and evaluation criteria total equals 100%.</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-4 mt-8">
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
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Tender
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalReviewForm;
