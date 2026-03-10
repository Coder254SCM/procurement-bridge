import React, { useMemo } from 'react';
import { Calculator, Plus, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface PriceItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  vat_applicable: 'yes_16' | 'exempt';
}

interface PriceScheduleFormProps {
  items: PriceItem[];
  onItemsChange: (items: PriceItem[]) => void;
  currency: string;
}

const unitOptions = ['Each', 'Lot', 'Set', 'Pack', 'Kg', 'Tonne', 'Litre', 'Metre', 'Hour', 'Day', 'Month'];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const PriceScheduleForm = ({ items, onItemsChange, currency }: PriceScheduleFormProps) => {
  const addRow = () => {
    onItemsChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        unit: 'Each',
        quantity: 1,
        unit_price: 0,
        vat_applicable: 'yes_16',
      },
    ]);
  };

  const removeRow = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateRow = (id: string, field: keyof PriceItem, value: string | number) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalVat = 0;

    items.forEach((item) => {
      const lineTotal = item.quantity * item.unit_price;
      subtotal += lineTotal;
      if (item.vat_applicable === 'yes_16') {
        totalVat += lineTotal * 0.16;
      }
    });

    const capacityLevy = subtotal * 0.0003;
    const grandTotal = subtotal + capacityLevy + totalVat;

    return { subtotal, capacityLevy, totalVat, grandTotal };
  }, [items]);

  return (
    <div className="space-y-6">
      <Alert className="border-primary/30 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          ✔ Prices are in {currency} by default. The 0.03% capacity building levy is auto-computed. VAT (16%) applies unless exempt.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Price Schedule</CardTitle>
                <CardDescription>Itemised pricing with taxes and levies</CardDescription>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" /> Add Price Row
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead className="min-w-[200px]">Item Description</TableHead>
                  <TableHead className="w-[100px]">Unit</TableHead>
                  <TableHead className="w-[80px]">Qty</TableHead>
                  <TableHead className="w-[130px]">Unit Price ({currency})</TableHead>
                  <TableHead className="w-[130px]">Total ({currency})</TableHead>
                  <TableHead className="w-[130px]">VAT?</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No price items added yet. Click "Add Price Row" to begin.
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item, idx) => {
                  const lineTotal = item.quantity * item.unit_price;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                          placeholder="Description..."
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.unit}
                          onValueChange={(v) => updateRow(item.id, 'unit', v)}
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
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price || ''}
                          onChange={(e) => updateRow(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          readOnly
                          value={formatCurrency(lineTotal, currency)}
                          className="h-9 bg-muted/50 font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.vat_applicable}
                          onValueChange={(v) => updateRow(item.id, 'vat_applicable', v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes_16">Yes (16%)</SelectItem>
                            <SelectItem value="exempt">No (Exempt)</SelectItem>
                          </SelectContent>
                        </Select>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {items.length > 0 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-dashed border-primary/50 text-primary hover:bg-primary/5"
                onClick={addRow}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Another Price Row
              </Button>

              <div className="mt-6 ml-auto max-w-md space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">Sub-total (excl. taxes)</span>
                  <span className="font-semibold">{currency} {formatCurrency(totals.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">Capacity Levy (0.03%)</span>
                  <span className="font-medium">{currency} {formatCurrency(totals.capacityLevy, currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">Total VAT (16%)</span>
                  <span className="font-medium">{currency} {formatCurrency(totals.totalVat, currency)}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-3 rounded-md bg-primary/10 border border-primary/20">
                  <span className="text-sm font-semibold text-primary">TOTAL TENDER PRICE</span>
                  <span className="text-lg font-bold text-primary">{currency} {formatCurrency(totals.grandTotal, currency)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceScheduleForm;
