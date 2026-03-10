import React, { useState } from 'react';
import { Package, Plus, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface ScheduleItem {
  id: string;
  unspsc_code: string;
  description: string;
  unit_of_issue: string;
  quantity: number;
  delivery_location: string;
  delivery_timeline: string;
}

const unitOptions = [
  'Each (EA)', 'Lot', 'Set', 'Pack', 'Kg', 'Tonne', 'Litre',
  'Metre', 'Sq. Metre', 'Cu. Metre', 'Hour', 'Day', 'Month', 'Ream', 'Box', 'Carton'
];

interface ScheduleOfRequirementsProps {
  items: ScheduleItem[];
  onItemsChange: (items: ScheduleItem[]) => void;
}

const ScheduleOfRequirements = ({ items, onItemsChange }: ScheduleOfRequirementsProps) => {
  const addRow = () => {
    onItemsChange([
      ...items,
      {
        id: crypto.randomUUID(),
        unspsc_code: '',
        description: '',
        unit_of_issue: 'Each (EA)',
        quantity: 1,
        delivery_location: '',
        delivery_timeline: '',
      },
    ]);
  };

  const removeRow = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateRow = (id: string, field: keyof ScheduleItem, value: string | number) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Add each line item of goods, works, or services required. These map to the Schedule of Requirements (Tables A & B) of the tender document.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Schedule of Requirements</CardTitle>
                <CardDescription>Line items: goods, works, or services to be procured</CardDescription>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" /> Add Line Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead className="w-[130px]">UNSPSC Code</TableHead>
                  <TableHead className="min-w-[220px]">Description of Goods/Services</TableHead>
                  <TableHead className="w-[140px]">Unit of Issue</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                  <TableHead className="w-[160px]">Delivery Location</TableHead>
                  <TableHead className="w-[130px]">Delivery Timeline</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No items added yet. Click "Add Line Item" to begin.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <Input
                        value={item.unspsc_code}
                        onChange={(e) => updateRow(item.id, 'unspsc_code', e.target.value)}
                        placeholder="e.g. 81161801"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                        placeholder="e.g. Communication Materials"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.unit_of_issue}
                        onValueChange={(v) => updateRow(item.id, 'unit_of_issue', v)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateRow(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="h-9 w-[70px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.delivery_location}
                        onChange={(e) => updateRow(item.id, 'delivery_location', e.target.value)}
                        placeholder="e.g. Nairobi"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.delivery_timeline}
                        onChange={(e) => updateRow(item.id, 'delivery_timeline', e.target.value)}
                        placeholder="e.g. 14 days"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeRow(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {items.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-dashed border-primary/50 text-primary hover:bg-primary/5"
              onClick={addRow}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Another Line Item
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleOfRequirements;
