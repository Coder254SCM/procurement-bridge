
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info, FileText } from 'lucide-react';
import { VerificationLevel } from '@/services/BlockchainVerificationService';

interface VerificationFormProps {
  supplierName: string;
  verificationLevel: VerificationLevel;
  setVerificationLevel: (level: VerificationLevel) => void;
  documentHash: string;
  setDocumentHash: (hash: string) => void;
  handleGenerateHash: () => void;
  isProcessing: boolean;
  getLevelDescription: (level: VerificationLevel) => string;
}

export const VerificationForm = ({
  supplierName,
  verificationLevel,
  setVerificationLevel,
  documentHash,
  setDocumentHash,
  handleGenerateHash,
  isProcessing,
  getLevelDescription
}: VerificationFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Supplier</label>
        <Input value={supplierName} disabled />
      </div>
      
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Verification Level</label>
        <Select
          value={verificationLevel}
          onValueChange={(value) => setVerificationLevel(value as VerificationLevel)}
          disabled={isProcessing}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select verification level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={VerificationLevel.BASIC}>
              <div className="flex flex-col">
                <span>Basic</span>
                <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.BASIC)}</span>
              </div>
            </SelectItem>
            <SelectItem value={VerificationLevel.STANDARD}>
              <div className="flex flex-col">
                <span>Standard</span>
                <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.STANDARD)}</span>
              </div>
            </SelectItem>
            <SelectItem value={VerificationLevel.ADVANCED}>
              <div className="flex flex-col">
                <span>Advanced</span>
                <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.ADVANCED)}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          <Info className="h-3 w-3 inline mr-1" />
          Higher verification levels require more comprehensive checks
        </p>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium">Document Hash</label>
          <Button
            variant="outline" 
            size="sm"
            className="h-7 text-xs"
            onClick={handleGenerateHash}
            disabled={isProcessing}
          >
            <FileText className="h-3 w-3 mr-1" />
            Generate
          </Button>
        </div>
        <Input 
          placeholder="Enter document hash or generate one" 
          value={documentHash}
          onChange={(e) => setDocumentHash(e.target.value)}
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground mt-1">
          <Info className="h-3 w-3 inline mr-1" />
          The hash represents the cryptographic fingerprint of supplier documents
        </p>
      </div>
    </>
  );
};
