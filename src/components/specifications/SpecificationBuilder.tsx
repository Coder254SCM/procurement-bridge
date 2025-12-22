import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { specificationService, SpecificationTemplate, TenderSpecification, SpecificationItem } from "@/services/SpecificationService";
import { FileText, Plus, Trash2, CheckCircle2, AlertTriangle, Wand2, Save } from "lucide-react";

interface SpecificationBuilderProps {
  tenderId: string;
  category: string;
  onSave?: () => void;
}

interface SpecificationEntry {
  id: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  unit?: string;
  isMandatory: boolean;
  tolerance?: string;
  options?: string[];
}

const CATEGORIES = [
  { value: 'construction', label: 'Construction & Works' },
  { value: 'it_equipment', label: 'IT Equipment & Software' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'medical', label: 'Medical Equipment' },
  { value: 'vehicles', label: 'Vehicles & Transport' },
  { value: 'consultancy', label: 'Consultancy Services' },
  { value: 'general', label: 'General Goods' },
];

export function SpecificationBuilder({ tenderId, category, onSave }: SpecificationBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [template, setTemplate] = useState<SpecificationTemplate | null>(null);
  const [specifications, setSpecifications] = useState<SpecificationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const completeness = template 
    ? Math.round((specifications.filter(s => s.value).length / Math.max(specifications.length, 1)) * 100)
    : 0;

  const mandatoryComplete = specifications.filter(s => s.isMandatory && s.value).length;
  const mandatoryTotal = specifications.filter(s => s.isMandatory).length;

  useEffect(() => {
    if (selectedCategory) {
      loadTemplate(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (tenderId) {
      loadExistingSpecifications();
    }
  }, [tenderId]);

  const loadTemplate = async (cat: string) => {
    setIsLoading(true);
    try {
      const t = await specificationService.getTemplateForCategory(cat);
      setTemplate(t);
      if (t && specifications.length === 0) {
        // Initialize from template
        const entries: SpecificationEntry[] = t.specifications.map((spec, index) => ({
          id: `spec_${index}`,
          key: spec.key,
          label: spec.label,
          value: '',
          type: spec.type,
          isMandatory: spec.required,
          options: spec.options
        }));
        setSpecifications(entries);
      }
    } catch (error) {
      console.error('Load template error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingSpecifications = async () => {
    try {
      const existing = await specificationService.getSpecifications(tenderId);
      if (existing.length > 0) {
        const entries: SpecificationEntry[] = existing.map((spec, index) => ({
          id: spec.id || `existing_${index}`,
          key: spec.specification_key,
          label: spec.specification_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: spec.specification_value,
          type: 'text',
          unit: spec.unit_of_measure,
          isMandatory: spec.is_mandatory,
          tolerance: spec.tolerance_range
        }));
        setSpecifications(entries);
      }
    } catch (error) {
      console.error('Load existing specs error:', error);
    }
  };

  const addSpecification = () => {
    setSpecifications([
      ...specifications,
      {
        id: `custom_${Date.now()}`,
        key: '',
        label: '',
        value: '',
        type: 'text',
        isMandatory: false
      }
    ]);
  };

  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter(s => s.id !== id));
  };

  const updateSpecification = (id: string, field: keyof SpecificationEntry, value: any) => {
    setSpecifications(specifications.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const applyTemplate = async () => {
    if (!template) return;
    
    const entries: SpecificationEntry[] = template.specifications.map((spec, index) => ({
      id: `template_${index}`,
      key: spec.key,
      label: spec.label,
      value: '',
      type: spec.type,
      isMandatory: spec.required,
      options: spec.options
    }));
    setSpecifications(entries);
    toast.success(`Applied ${template.template_name} template with ${entries.length} specifications`);
  };

  const handleSave = async () => {
    if (!tenderId) {
      toast.error("Tender ID is required");
      return;
    }

    if (mandatoryComplete < mandatoryTotal) {
      toast.error(`Please complete all mandatory specifications (${mandatoryComplete}/${mandatoryTotal})`);
      return;
    }

    setIsSaving(true);
    try {
      const specsToSave: TenderSpecification[] = specifications
        .filter(s => s.value)
        .map(s => ({
          tender_id: tenderId,
          category: selectedCategory,
          specification_type: s.type,
          specification_key: s.key || s.label.toLowerCase().replace(/\s+/g, '_'),
          specification_value: s.value,
          unit_of_measure: s.unit,
          is_mandatory: s.isMandatory,
          tolerance_range: s.tolerance
        }));

      const result = await specificationService.saveSpecifications(tenderId, specsToSave);
      if (result.success) {
        toast.success(`Saved ${specsToSave.length} specifications`);
        onSave?.();
      } else {
        toast.error(result.error || "Failed to save specifications");
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save specifications");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Specification Builder
          </CardTitle>
          <CardDescription>
            Define detailed specifications for your tender using templates or custom entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Procurement Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              {template && (
                <Button variant="outline" onClick={applyTemplate} className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  Apply {template.template_name} Template
                </Button>
              )}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completeness</span>
                  <Badge variant={completeness >= 80 ? 'default' : 'secondary'}>
                    {completeness}%
                  </Badge>
                </div>
                <Progress value={completeness} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum 80% required for publication
                </p>
              </CardContent>
            </Card>

            <Card className={`${mandatoryComplete === mandatoryTotal ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mandatory Fields</span>
                  <Badge variant={mandatoryComplete === mandatoryTotal ? 'default' : 'destructive'}>
                    {mandatoryComplete}/{mandatoryTotal}
                  </Badge>
                </div>
                {mandatoryComplete === mandatoryTotal ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> All mandatory specifications complete
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {mandatoryTotal - mandatoryComplete} mandatory fields remaining
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Specifications List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Specifications ({specifications.length})</Label>
              <Button variant="outline" size="sm" onClick={addSpecification}>
                <Plus className="h-4 w-4 mr-1" />
                Add Custom
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading template...</div>
            ) : specifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                Select a category to load specifications template, or add custom specifications
              </div>
            ) : (
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <Card key={spec.id} className={spec.isMandatory ? 'border-primary/30' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Specification Name</Label>
                            <Input
                              value={spec.label}
                              onChange={(e) => updateSpecification(spec.id, 'label', e.target.value)}
                              placeholder="e.g., Processor Speed"
                              className="h-9"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs">
                              Value {spec.isMandatory && <span className="text-destructive">*</span>}
                            </Label>
                            {spec.type === 'select' && spec.options ? (
                              <Select 
                                value={spec.value} 
                                onValueChange={(v) => updateSpecification(spec.id, 'value', v)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {spec.options.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : spec.type === 'number' ? (
                              <Input
                                type="number"
                                value={spec.value}
                                onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                                placeholder="Enter value"
                                className="h-9"
                              />
                            ) : (
                              <Input
                                value={spec.value}
                                onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                                placeholder="Enter specification value"
                                className="h-9"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Unit</Label>
                            <Input
                              value={spec.unit || ''}
                              onChange={(e) => updateSpecification(spec.id, 'unit', e.target.value)}
                              placeholder="e.g., GHz, mm"
                              className="h-9"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          {spec.isMandatory && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeSpecification(spec.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {/* Tolerance field for technical specs */}
                      {(spec.type === 'number' || selectedCategory === 'construction') && (
                        <div className="mt-3 grid gap-4 md:grid-cols-4">
                          <div className="space-y-2 md:col-start-2 md:col-span-2">
                            <Label className="text-xs">Tolerance Range (optional)</Label>
                            <Input
                              value={spec.tolerance || ''}
                              onChange={(e) => updateSpecification(spec.id, 'tolerance', e.target.value)}
                              placeholder="e.g., ±5%, 10-15mm"
                              className="h-9"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Required Documents */}
          {template && template.mandatory_documents.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Required Documents for {template.template_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.mandatory_documents.map((doc, i) => (
                    <Badge key={i} variant="outline">{doc.replace(/_/g, ' ')}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || completeness < 80}
            className="w-full"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Specifications ({specifications.filter(s => s.value).length} items)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}