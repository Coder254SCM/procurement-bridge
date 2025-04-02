
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LockKeyhole, FileDigit } from 'lucide-react';

const BlockchainInfo = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileDigit className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Blockchain Verification</CardTitle>
            <CardDescription>
              Your documents are verified using a secure, enterprise-grade blockchain integration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-center mb-4">
            <img 
              src="/lovable-uploads/c08e5583-71a0-475d-ba45-b7e39e7dc377.png" 
              alt="ProcureChain Logo" 
              className="h-16 w-auto" 
            />
            <p>
              ProcureChain uses Hyperledger Fabric - an enterprise-grade, permissioned blockchain framework - to securely verify and store 
              document hashes without any gas fees. This provides industry-leading security and immutability for your KYC verification.
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Key Security Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Completely free, with no gas fees or transaction costs</li>
              <li>Private, permissioned blockchain network for enterprise security</li>
              <li>Document integrity verification through cryptographic hashing</li>
              <li>Immutable audit trail of all document verifications</li>
              <li>Compliance with regulatory requirements through verifiable records</li>
            </ul>
          </div>
          
          <div className="border border-primary/20 p-4 rounded-md bg-primary/5">
            <div className="flex items-center space-x-2 mb-2">
              <LockKeyhole className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Data Encryption & Privacy</h4>
            </div>
            <p className="text-sm">
              Only cryptographic hashes of your documents are stored on the blockchain, not the actual files. 
              This ensures:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Your sensitive data remains private</li>
              <li>Documents cannot be reconstructed from the blockchain data</li>
              <li>You maintain full control over your original documents</li>
              <li>AES-256 encryption protects your data before hashing</li>
              <li>Zero-knowledge proofs allow verification without revealing content</li>
            </ul>
          </div>
          
          <div className="border border-primary/20 p-4 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Protection Against Fraud</h4>
            </div>
            <p className="text-sm">
              Our blockchain implementation protects against:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Document tampering and forgery</li>
              <li>Unauthorized modifications to tender submissions</li>
              <li>Bid rigging and collusion through transparent audit trails</li>
              <li>Backdating of submissions or evaluations</li>
              <li>Manipulation of tender evaluation criteria</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Only document hashes are stored on the blockchain, not the actual files, ensuring your data remains private while providing
            cryptographic proof of document integrity and timestamp verification.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainInfo;
