import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { addendumService, Addendum, TenderChange } from "@/services/AddendumService";
import { FileText, Plus, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AddendumManagementProps {
  tenderId: string;
  isOwner: boolean;
  onAddendumAcknowledged?: () => void;
}

interface ChangeItem {
  field: string;
  reason: string;
  original_value: string;
  new_value: string;
}

export function AddendumManagement({ tenderId, isOwner, onAddendumAcknowledged }: AddendumManagementProps) {
  const [addendums, setAddendums] = useState<Addendum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [changes, setChanges] = useState<ChangeItem[]>([{ field: '', reason: '', original_value: '', new_value: '' }]);
  const [newDeadline, setNewDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAddendums();
  }, [tenderId]);

  const loadAddendums = async () => {
    setIsLoading(true);
    try {
      const data = await addendumService.getAddendums(tenderId);
      setAddendums(data);
    } catch (error) {
      console.error('Error loading addendums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addChangeItem = () => {
    setChanges([...changes, { field: '', reason: '', original_value: '', new_value: '' }]);
  };

  const updateChange = (index: number, field: keyof ChangeItem, value: string) => {
    const updated = [...changes];
    updated[index] = { ...updated[index], [field]: value };
    setChanges(updated);
  };

  const removeChange = (index: number) => {
    if (changes.length <= 1) return;
    setChanges(changes.filter((_, i) => i !== index));
  };

  const handleCreateAddendum = async () => {
    if (!title || !description || changes.some(c => !c.field || !c.reason)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const tenderChanges: TenderChange[] = changes.map(c => ({
        field: c.field,
        original_value: c.original_value,
        new_value: c.new_value,
        reason: c.reason,
      }));

      await addendumService.createAddendum({
        tender_id: tenderId,
        title: title,
        description: description,
        changes: tenderChanges,
        extends_deadline: !!newDeadline,
        new_deadline: newDeadline || undefined,
        requires_acknowledgment: true,
      });

      toast.success("Addendum created and suppliers notified");
      setShowCreateForm(false);
      resetForm();
      loadAddendums();
    } catch (error) {
      console.error('Error creating addendum:', error);
      toast.error("Failed to create addendum");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcknowledge = async (addendumId: string) => {
    try {
      await addendumService.acknowledgeAddendum(addendumId);
      toast.success("Addendum acknowledged");
      loadAddendums();
      onAddendumAcknowledged?.();
    } catch (error) {
      console.error('Error acknowledging addendum:', error);
      toast.error("Failed to acknowledge addendum");
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setChanges([{ field: '', reason: '', original_value: '', new_value: '' }]);
    setNewDeadline('');
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-muted rounded-lg" />
      <div className="h-32 bg-muted rounded-lg" />
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Tender Addendums
          </h3>
          <p className="text-sm text-muted-foreground">
            {addendums.length} addendum{addendums.length !== 1 ? 's' : ''} issued
          </p>
        </div>
        {isOwner && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Issue Addendum
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && isOwner && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Create New Addendum</CardTitle>
            <CardDescription>
              Issue a formal amendment to the tender documents. All interested suppliers will be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Addendum Title *</Label>
                <Input
                  placeholder="e.g., Amendment to Technical Specifications"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>New Submission Deadline (if extending)</Label>
                <Input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe the purpose of this amendment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Changes</Label>
                <Button variant="outline" size="sm" onClick={addChangeItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Change
                </Button>
              </div>

              {changes.map((change, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Field/Section *</Label>
                        <Input
                          placeholder="e.g., Section 3.2 - Technical Requirements"
                          value={change.field}
                          onChange={(e) => updateChange(index, 'field', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>New Value</Label>
                        <Input
                          placeholder="Updated value or reference"
                          value={change.new_value}
                          onChange={(e) => updateChange(index, 'new_value', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Change *</Label>
                      <Textarea
                        placeholder="Explain why this change is being made..."
                        value={change.reason}
                        onChange={(e) => updateChange(index, 'reason', e.target.value)}
                      />
                    </div>
                    {changes.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => removeChange(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAddendum} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Issue Addendum"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Addendum List */}
      {addendums.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium mb-1">No Addendums Issued</h4>
            <p className="text-sm text-muted-foreground">
              No amendments have been made to this tender yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {addendums.map((addendum, index) => (
            <Card key={addendum.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">Addendum #{addendum.addendum_number}</Badge>
                      {addendum.extends_deadline && (
                        <Badge className="bg-amber-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Deadline Extended
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{addendum.title}</CardTitle>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(addendum.issued_at), 'PPp')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">DESCRIPTION</Label>
                  <p className="text-sm mt-1">{addendum.description}</p>
                </div>

                {addendum.changes_summary && addendum.changes_summary.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">CHANGES</Label>
                    <div className="mt-2 space-y-2">
                      {addendum.changes_summary.map((change, idx) => (
                        <div key={idx} className="flex flex-col gap-1 text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium">{change.field}</span>
                          <span className="text-muted-foreground">{change.reason}</span>
                          {change.new_value && (
                            <span className="text-primary">New: {String(change.new_value)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {addendum.new_deadline && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <Label className="text-xs text-muted-foreground">NEW DEADLINE</Label>
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      {format(new Date(addendum.new_deadline), 'PPpp')}
                    </p>
                  </div>
                )}

                {!isOwner && addendum.requires_acknowledgment && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">Acknowledgment required to continue bidding</span>
                    </div>
                    <Button size="sm" onClick={() => handleAcknowledge(addendum.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
