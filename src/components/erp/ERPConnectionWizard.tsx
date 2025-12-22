import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { erpIntegrationService, ERPSystem, ERPConnectorConfig } from "@/services/ERPIntegrationService";
import { 
  Database, Check, ArrowRight, ArrowLeft, Plug, 
  FileSpreadsheet, Cloud, Server, Settings, Zap,
  CheckCircle2, XCircle, Loader2
} from "lucide-react";

interface ERPConnectionWizardProps {
  organizationId: string;
  onComplete?: () => void;
}

interface ERPOption {
  id: ERPSystem;
  name: string;
  icon: React.ReactNode;
  description: string;
  authMethods: string[];
}

const ERP_OPTIONS: ERPOption[] = [
  {
    id: 'sap',
    name: 'SAP S/4HANA',
    icon: <Server className="h-8 w-8" />,
    description: 'Enterprise resource planning with procurement modules',
    authMethods: ['api_key', 'oauth2', 'basic']
  },
  {
    id: 'oracle',
    name: 'Oracle Fusion',
    icon: <Database className="h-8 w-8" />,
    description: 'Cloud-based procurement and finance solution',
    authMethods: ['oauth2', 'api_key']
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    icon: <Cloud className="h-8 w-8" />,
    description: 'Integrated business applications',
    authMethods: ['oauth2', 'azure_ad']
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    icon: <FileSpreadsheet className="h-8 w-8 text-green-600" />,
    description: 'Simple spreadsheet-based data sync',
    authMethods: ['oauth2', 'service_account']
  },
  {
    id: 'excel_online',
    name: 'Excel Online',
    icon: <FileSpreadsheet className="h-8 w-8 text-green-700" />,
    description: 'Microsoft 365 spreadsheet integration',
    authMethods: ['oauth2', 'azure_ad']
  },
  {
    id: 'odoo',
    name: 'Odoo',
    icon: <Settings className="h-8 w-8 text-purple-600" />,
    description: 'Open-source ERP with procurement',
    authMethods: ['api_key', 'oauth2']
  },
];

const SYNC_ENTITIES = [
  { id: 'requisitions', label: 'Purchase Requisitions' },
  { id: 'tenders', label: 'Tenders/RFQs' },
  { id: 'bids', label: 'Bid Responses' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'suppliers', label: 'Suppliers/Vendors' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'payments', label: 'Payments' },
];

export function ERPConnectionWizard({ organizationId, onComplete }: ERPConnectionWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedERP, setSelectedERP] = useState<ERPOption | null>(null);
  const [connectionName, setConnectionName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [authMethod, setAuthMethod] = useState('');
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleEntity = (entityId: string) => {
    setSelectedEntities(prev => 
      prev.includes(entityId) 
        ? prev.filter(e => e !== entityId)
        : [...prev, entityId]
    );
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus('success');
    toast.success('Connection test successful');
  };

  const handleComplete = async () => {
    if (!selectedERP || !connectionName || !endpointUrl) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsConnecting(true);
    try {
      const connection = await erpIntegrationService.createConnection({
        organization_id: organizationId,
        erp_system: selectedERP.id,
        connection_name: connectionName,
        endpoint_url: endpointUrl,
        authentication_method: authMethod,
        sync_frequency: syncFrequency
      });

      // Configure connector
      const connectorType = selectedERP.id === 'sap' ? 'sap_s4hana' 
        : selectedERP.id === 'oracle' ? 'oracle_fusion'
        : selectedERP.id === 'dynamics' ? 'ms_dynamics_365'
        : 'custom';

      await erpIntegrationService.configureConnector({
        connection_id: connection.id,
        connector_type: connectorType as ERPConnectorConfig['connector_type'],
        field_mappings: erpIntegrationService.getDefaultFieldMappings(connectorType as ERPConnectorConfig['connector_type']),
        sync_entities: selectedEntities
      });

      toast.success('ERP connection created successfully');
      onComplete?.();
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to create ERP connection');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            ERP Connection Wizard
          </CardTitle>
          <CardDescription>
            Connect your ERP system to sync procurement data automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Select System</span>
              <span>Configure</span>
              <span>Data Sync</span>
              <span>Connect</span>
            </div>
          </div>

          {/* Step 1: Select ERP */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Your ERP System</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ERP_OPTIONS.map(erp => (
                  <Card 
                    key={erp.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedERP?.id === erp.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedERP(erp)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3 text-muted-foreground">
                        {erp.icon}
                      </div>
                      <h4 className="font-semibold mb-1">{erp.name}</h4>
                      <p className="text-xs text-muted-foreground">{erp.description}</p>
                      {selectedERP?.id === erp.id && (
                        <Badge className="mt-2" variant="default">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure Connection */}
          {step === 2 && selectedERP && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                {selectedERP.icon}
                Configure {selectedERP.name} Connection
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Connection Name *</Label>
                  <Input
                    value={connectionName}
                    onChange={(e) => setConnectionName(e.target.value)}
                    placeholder={`My ${selectedERP.name} Connection`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {selectedERP.id === 'google_sheets' ? 'Spreadsheet URL' : 'Endpoint URL'} *
                  </Label>
                  <Input
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    placeholder={
                      selectedERP.id === 'google_sheets' 
                        ? 'https://docs.google.com/spreadsheets/d/...'
                        : 'https://api.example.com/v1'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Authentication Method</Label>
                  <Select value={authMethod} onValueChange={setAuthMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedERP.authMethods.map(method => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Test Connection</h4>
                      <p className="text-sm text-muted-foreground">
                        Verify your credentials before proceeding
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={testConnection}
                      disabled={!endpointUrl || connectionStatus === 'testing'}
                    >
                      {connectionStatus === 'testing' ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
                      ) : connectionStatus === 'success' ? (
                        <><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Connected</>
                      ) : connectionStatus === 'error' ? (
                        <><XCircle className="h-4 w-4 mr-2 text-destructive" /> Failed</>
                      ) : (
                        <><Zap className="h-4 w-4 mr-2" /> Test Connection</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Data Sync Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold">Select Data to Sync</h3>
              <p className="text-sm text-muted-foreground">
                Choose which data entities should be synchronized between ProcureChain and your ERP
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {SYNC_ENTITIES.map(entity => (
                  <Card 
                    key={entity.id}
                    className={`cursor-pointer ${
                      selectedEntities.includes(entity.id) ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleEntity(entity.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Checkbox 
                        checked={selectedEntities.includes(entity.id)}
                        onCheckedChange={() => toggleEntity(entity.id)}
                      />
                      <div>
                        <p className="font-medium">{entity.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Sync Direction</h4>
                  <p className="text-sm text-muted-foreground">
                    Data will sync bi-directionally. Changes in ProcureChain will push to your ERP,
                    and changes in your ERP will sync back to ProcureChain.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Review & Connect */}
          {step === 4 && selectedERP && (
            <div className="space-y-6">
              <h3 className="font-semibold">Review & Connect</h3>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground">{selectedERP.icon}</div>
                    <div>
                      <h4 className="font-semibold">{connectionName || selectedERP.name}</h4>
                      <p className="text-sm text-muted-foreground">{endpointUrl}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ERP System:</span>
                      <span className="ml-2 font-medium">{selectedERP.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auth Method:</span>
                      <span className="ml-2 font-medium">{authMethod || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sync Frequency:</span>
                      <span className="ml-2 font-medium capitalize">{syncFrequency}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entities:</span>
                      <span className="ml-2 font-medium">{selectedEntities.length} selected</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm text-muted-foreground">Selected Entities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEntities.map(id => (
                        <Badge key={id} variant="secondary">
                          {SYNC_ENTITIES.find(e => e.id === id)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button 
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !selectedERP}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting...</>
                ) : (
                  <><Check className="h-4 w-4 mr-2" /> Complete Setup</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}