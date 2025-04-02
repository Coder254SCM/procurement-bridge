
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BlockchainInfo = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Blockchain Verification</CardTitle>
        <CardDescription>
          Your documents are verified using a secure, free blockchain integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            This platform uses Hyperledger Fabric - an open-source, permissioned blockchain framework - to securely verify and store 
            document hashes without any gas fees. This provides enterprise-grade security and immutability for your KYC verification.
          </p>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Key Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Completely free, with no gas fees or transaction costs</li>
              <li>Private, permissioned blockchain network for enterprise security</li>
              <li>Document integrity verification through cryptographic hashing</li>
              <li>Immutable audit trail of all document verifications</li>
              <li>Compliance with regulatory requirements through verifiable records</li>
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
