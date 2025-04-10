
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code, List, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SmartContractParam {
  name: string;
  type: string;
  description: string;
}

interface SmartContractFunction {
  description: string;
  params: SmartContractParam[];
  returns: {
    type: string;
    description: string;
  };
}

interface SmartContract {
  name: string;
  version: string;
  functions: {
    [key: string]: SmartContractFunction;
  };
}

interface ChaincodeDefs {
  [key: string]: SmartContract;
}

interface ChaincodeExplorerResponse {
  chaincodeDefinitions: ChaincodeDefs;
  networkInfo: {
    name: string;
    version: string;
    channelName: string;
    blocksCount: number;
  };
}

const ChaincodeExplorer = () => {
  const { toast } = useToast();
  const [selectedContract, setSelectedContract] = useState<string>('tender');
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  
  // Fetch chaincode definitions
  const { data, isLoading, error } = useQuery({
    queryKey: ['chaincode-explorer'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('chaincode-explorer', {});
      if (error) throw error;
      return data as ChaincodeExplorerResponse;
    }
  });
  
  // Set default selected function when contract changes
  useEffect(() => {
    if (data && selectedContract) {
      const contract = data.chaincodeDefinitions[selectedContract];
      if (contract) {
        // Select first function by default
        const firstFunction = Object.keys(contract.functions)[0];
        setSelectedFunction(firstFunction);
      }
    }
  }, [data, selectedContract]);
  
  // Handler for copying function call to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Function call template copied to clipboard",
    });
  };
  
  if (isLoading) {
    return (
      <Card className="w-full h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Loading chaincode definitions...</p>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load chaincode definitions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) {
    return null;
  }
  
  const contracts = Object.keys(data.chaincodeDefinitions);
  const currentContract = data.chaincodeDefinitions[selectedContract];
  const currentFunction = selectedFunction ? currentContract?.functions[selectedFunction] : null;
  
  // Generate sample code for the selected function
  const generateSampleCode = () => {
    if (!currentFunction) return '';
    
    const params = currentFunction.params.map(p => {
      if (p.type === 'string') return `"example-${p.name}"`;
      if (p.type === 'object') return '{ /* example object */ }';
      if (p.type === 'array') return '[]';
      return 'null';
    });
    
    return `// Example call to ${selectedFunction} function in ${selectedContract} chaincode
fabricClient.submitTransaction(
  "${selectedContract}",
  "${selectedFunction}",
  [${params.join(', ')}]
);`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Smart Contract Explorer
        </CardTitle>
        <CardDescription>
          Explore the chaincode (smart contracts) deployed on {data.networkInfo.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={selectedContract} onValueChange={setSelectedContract} className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-4">
            {contracts.map(contract => (
              <TabsTrigger key={contract} value={contract} className="capitalize">
                {contract}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {contracts.map(contract => (
            <TabsContent key={contract} value={contract}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Functions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="flex flex-col gap-1">
                        {Object.keys(data.chaincodeDefinitions[contract].functions).map(fn => (
                          <Button 
                            key={fn} 
                            variant={fn === selectedFunction ? "default" : "ghost"}
                            className="justify-start text-left font-normal"
                            onClick={() => setSelectedFunction(fn)}
                          >
                            {fn}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {selectedFunction || "Select a function"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {currentFunction ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Description</h4>
                          <p className="text-sm text-muted-foreground">{currentFunction.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Parameters</h4>
                          <div className="space-y-2">
                            {currentFunction.params.length > 0 ? (
                              currentFunction.params.map(param => (
                                <div key={param.name} className="grid grid-cols-3 gap-2 text-sm">
                                  <span className="font-mono">{param.name}</span>
                                  <span className="text-muted-foreground">{param.type}</span>
                                  <span className="text-muted-foreground">{param.description}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No parameters</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Returns</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">{currentFunction.returns.type}</span>
                            <span className="text-muted-foreground">{currentFunction.returns.description}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Example Code</h4>
                          <div className="bg-muted p-2 rounded-md relative">
                            <pre className="text-xs overflow-x-auto">{generateSampleCode()}</pre>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => copyToClipboard(generateSampleCode())}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Select a function to view details</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Contract Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{data.chaincodeDefinitions[contract].name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{data.chaincodeDefinitions[contract].version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Network</p>
                      <p className="font-medium">{data.networkInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Channel</p>
                      <p className="font-medium">{data.networkInfo.channelName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChaincodeExplorer;
