
import React, { useState } from 'react';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import TenderTimeline from '@/components/tenders/TenderTimeline';
import BlockchainVerificationDetails from '@/components/verification/BlockchainVerificationDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, Shield, Activity, Server } from 'lucide-react';

const Verification = () => {
  const [demoHash, setDemoHash] = useState<string>('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
  
  const runDemoVerification = () => {
    // Generate a new random hash for demo purposes
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const hash = '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setDemoHash(hash);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Verification & Procurement Process</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Blockchain Foundation</CardTitle>
            <CardDescription>
              Hyperledger Fabric secures our procurement process with immutable verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
              <Button 
                className="w-full sm:w-auto"
                onClick={runDemoVerification}
              >
                <Database className="mr-2 h-4 w-4" />
                Run Demo Verification
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Click to generate a new blockchain verification for demonstration
              </div>
            </div>
            
            <BlockchainVerificationDetails hash={demoHash} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Security Features</CardTitle>
            <CardDescription>
              Advanced protection for procurement integrity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-1 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Immutable Records</p>
                  <p className="text-xs text-muted-foreground">All verification data is permanently recorded on blockchain</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-1 text-amber-500" />
                <div>
                  <p className="font-medium text-sm">Risk Detection</p>
                  <p className="text-xs text-muted-foreground">AI analyzes patterns to detect potential fraud risks</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <Activity className="h-4 w-4 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Behavioral Analysis</p>
                  <p className="text-xs text-muted-foreground">Real-time monitoring for suspicious activity</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2">
                <Server className="h-4 w-4 mt-1 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Distributed Validation</p>
                  <p className="text-xs text-muted-foreground">Multi-node consensus prevents single-point manipulation</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="verification">Verification Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">Tender Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification">
          <VerificationDashboard />
        </TabsContent>
        
        <TabsContent value="timeline">
          <TenderTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Verification;
