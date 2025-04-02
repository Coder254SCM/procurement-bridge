
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, FileCheck, RefreshCw } from 'lucide-react';

const SecurityInfo = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>
              How we protect your sensitive procurement data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            ProcureChain implements enterprise-grade security measures to protect your sensitive procurement data 
            and ensure compliance with Kenya's Data Protection Act (2021) and other relevant regulations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <h4 className="font-medium">End-to-End Encryption</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                AES-256 encryption protects your sensitive data both in transit and at rest, making it unreadable 
                to unauthorized parties.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Multi-Factor Authentication</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Strong MFA prevents unauthorized access even if passwords are compromised, adding an essential 
                layer of security.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Data Minimization</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                We only collect essential information needed for procurement processes, reducing exposure 
                risk in case of a breach.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Automated Data Deletion</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Inactive accounts and completed tenders are automatically purged after the legally required 
                retention period.
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <h4 className="font-medium mb-2">Your Rights Under Kenya's Data Protection Act:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Object to processing of your personal data</li>
              <li>Receive a copy of your data in a structured format</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            For more information on our security practices or to exercise your rights under data protection laws, 
            please contact our Data Protection Officer at dpo@procurechain.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityInfo;
