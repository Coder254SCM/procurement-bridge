import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Send, Eye, Edit, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
export interface RequisitionItem {
  id?: string;
  catalog_item_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  specifications?: Record<string, any>;
}

export interface PurchaseRequisition {
  id: string;
  requisition_number: string;
  requester_id: string;
  department: string;
  title: string;
  description?: string;
  justification: string;
  budget_code?: string;
  estimated_value: number;
  currency: string;
  required_date: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  approval_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  items: RequisitionItem[];
  approvers: any[];
  approval_workflow: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const RequisitionManagement = () => {
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<PurchaseRequisition | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isBuyer, loading: rolesLoading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newRequisition, setNewRequisition] = useState({
    title: '',
    description: '',
    department: '',
    justification: '',
    budget_code: '',
    estimated_value: 0,
    required_date: '',
    priority: 'normal' as const,
    items: [] as RequisitionItem[]
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0
  });

  useEffect(() => {
    loadRequisitions();
  }, [user]);

  const loadRequisitions = async () => {
    setLoading(true);
    
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('purchase_requisitions')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map the data to the expected format with proper type casting
      const formattedData = (data || []).map(req => ({
        id: req.id,
        requisition_number: req.requisition_number,
        requester_id: req.requester_id,
        department: req.department,
        title: req.title,
        description: req.description || '',
        justification: req.justification,
        budget_code: req.budget_code || '',
        estimated_value: req.estimated_value,
        currency: req.currency,
        required_date: req.required_date,
        priority: req.priority as 'low' | 'normal' | 'high' | 'urgent',
        approval_status: req.approval_status as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled',
        items: (Array.isArray(req.items) ? req.items : []) as unknown as RequisitionItem[],
        approvers: Array.isArray(req.approvers) ? req.approvers : [],
        approval_workflow: (typeof req.approval_workflow === 'object' && req.approval_workflow !== null) ? req.approval_workflow as Record<string, any> : {},
        created_at: req.created_at,
        updated_at: req.updated_at
      }));
      
      setRequisitions(formattedData);
    } catch (error: any) {
      console.error('Error loading requisitions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load requisitions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const totalPrice = newItem.quantity * newItem.unit_price;
    const item: RequisitionItem = {
      ...newItem,
      total_price: totalPrice
    };
    
    setNewRequisition({
      ...newRequisition,
      items: [...newRequisition.items, item],
      estimated_value: newRequisition.estimated_value + totalPrice
    });
    
    setNewItem({
      name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = newRequisition.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
    
    setNewRequisition({
      ...newRequisition,
      items: updatedItems,
      estimated_value: newTotal
    });
  };

  const handleCreateRequisition = async () => {
    if (!user) return;
    
    try {
      // Generate requisition number
      const reqNumber = `REQ-${Date.now().toString(36).toUpperCase()}`;
      
      const insertData: any = {
        requisition_number: reqNumber,
        requester_id: user.id,
        title: newRequisition.title,
        description: newRequisition.description,
        department: newRequisition.department,
        justification: newRequisition.justification,
        budget_code: newRequisition.budget_code,
        estimated_value: newRequisition.estimated_value,
        required_date: newRequisition.required_date,
        priority: newRequisition.priority,
        items: newRequisition.items,
        currency: 'KES',
        approval_status: 'draft'
      };
      
      const { data, error } = await supabase
        .from('purchase_requisitions')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;

      const formattedData: PurchaseRequisition = {
        id: data.id,
        requisition_number: data.requisition_number,
        requester_id: data.requester_id,
        department: data.department,
        title: data.title,
        description: data.description || '',
        justification: data.justification,
        budget_code: data.budget_code || '',
        estimated_value: data.estimated_value,
        currency: data.currency,
        required_date: data.required_date,
        priority: data.priority as 'low' | 'normal' | 'high' | 'urgent',
        approval_status: data.approval_status as 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled',
        items: (Array.isArray(data.items) ? data.items : []) as unknown as RequisitionItem[],
        approvers: Array.isArray(data.approvers) ? data.approvers : [],
        approval_workflow: (typeof data.approval_workflow === 'object' && data.approval_workflow !== null) ? data.approval_workflow as Record<string, any> : {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setRequisitions([formattedData, ...requisitions]);
      setNewRequisition({
        title: '',
        description: '',
        department: '',
        justification: '',
        budget_code: '',
        estimated_value: 0,
        required_date: '',
        priority: 'normal',
        items: []
      });
      setIsCreateOpen(false);
      
      toast({
        title: "Success",
        description: "Requisition created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmitForApproval = async (requisitionId: string) => {
    try {
      const { error } = await supabase
        .from('purchase_requisitions')
        .update({ approval_status: 'submitted' })
        .eq('id', requisitionId);
      
      if (error) throw error;

      // Update local state
      setRequisitions(requisitions.map(req => 
        req.id === requisitionId 
          ? { ...req, approval_status: 'submitted' }
          : req
      ));

      toast({
        title: "Success",
        description: "Requisition submitted for approval"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading || rolesLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading requisitions...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Purchase Requisitions</h1>
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sign in required</h3>
            <p className="text-muted-foreground">Please sign in to create and manage requisitions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Requisitions are for buyers only
  if (!isBuyer) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Purchase Requisitions</h1>
        <Card>
          <CardContent className="text-center py-12">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Buyer Access Required</h3>
            <p className="text-muted-foreground mb-4">
              Purchase requisitions are for buyers (organizations) to request internal approvals before creating tenders.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              As a supplier, you can browse and bid on published tenders instead.
            </p>
            <Button onClick={() => navigate('/tenders')}>
              Browse Tenders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Requisitions</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Requisition</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Requisition Title"
                  value={newRequisition.title}
                  onChange={(e) => setNewRequisition({...newRequisition, title: e.target.value})}
                />
                <Input
                  placeholder="Department"
                  value={newRequisition.department}
                  onChange={(e) => setNewRequisition({...newRequisition, department: e.target.value})}
                />
              </div>
              
              <Textarea
                placeholder="Description"
                value={newRequisition.description}
                onChange={(e) => setNewRequisition({...newRequisition, description: e.target.value})}
              />
              
              <Textarea
                placeholder="Justification"
                value={newRequisition.justification}
                onChange={(e) => setNewRequisition({...newRequisition, justification: e.target.value})}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Budget Code"
                  value={newRequisition.budget_code}
                  onChange={(e) => setNewRequisition({...newRequisition, budget_code: e.target.value})}
                />
                <Input
                  type="date"
                  value={newRequisition.required_date}
                  onChange={(e) => setNewRequisition({...newRequisition, required_date: e.target.value})}
                />
                <Select value={newRequisition.priority} onValueChange={(value: any) => setNewRequisition({...newRequisition, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Items Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Requisition Items</h3>
                
                {/* Add Item Form */}
                <div className="grid grid-cols-5 gap-2">
                  <Input
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                  <Input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({...newItem, unit_price: parseFloat(e.target.value)})}
                  />
                  <Button onClick={handleAddItem} disabled={!newItem.name}>
                    Add Item
                  </Button>
                </div>

                {/* Items List */}
                {newRequisition.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Items:</h4>
                    {newRequisition.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {item.quantity} × KES {item.unit_price.toLocaleString()} = KES {item.total_price.toLocaleString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="text-right font-semibold">
                      Total: KES {newRequisition.estimated_value.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleCreateRequisition} className="w-full" disabled={!newRequisition.title || newRequisition.items.length === 0}>
                Create Requisition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requisitions List */}
      <div className="grid gap-4">
        {requisitions.map(requisition => (
          <Card key={requisition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{requisition.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {requisition.requisition_number} • {requisition.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(requisition.approval_status)}>
                    {requisition.approval_status}
                  </Badge>
                  <Badge variant={getPriorityColor(requisition.priority)}>
                    {requisition.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{requisition.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">Estimated Value:</span> 
                  <span className="ml-2">KES {requisition.estimated_value.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Required Date:</span>
                  <span className="ml-2">{format(new Date(requisition.required_date), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Created {format(new Date(requisition.created_at), 'MMM dd, yyyy')}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRequisition(requisition);
                      setIsViewOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {requisition.approval_status === 'draft' && (
                    <>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitForApproval(requisition.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Submit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requisitions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No requisitions found</h3>
            <p className="text-muted-foreground">
              Start by creating your first purchase requisition.
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Requisition Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Requisition Details</DialogTitle>
          </DialogHeader>
          {selectedRequisition && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Basic Information</h3>
                  <p><strong>Title:</strong> {selectedRequisition.title}</p>
                  <p><strong>Number:</strong> {selectedRequisition.requisition_number}</p>
                  <p><strong>Department:</strong> {selectedRequisition.department}</p>
                  <p><strong>Priority:</strong> {selectedRequisition.priority}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status & Dates</h3>
                  <p><strong>Status:</strong> {selectedRequisition.approval_status}</p>
                  <p><strong>Required Date:</strong> {format(new Date(selectedRequisition.required_date), 'MMM dd, yyyy')}</p>
                  <p><strong>Created:</strong> {format(new Date(selectedRequisition.created_at), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm">{selectedRequisition.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Justification</h3>
                <p className="text-sm">{selectedRequisition.justification}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedRequisition.items.map((item, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">KES {item.total_price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × KES {item.unit_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-semibold text-lg">
                    Total: KES {selectedRequisition.estimated_value.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};