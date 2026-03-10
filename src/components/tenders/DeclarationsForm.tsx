import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

export interface Declaration {
  id: string;
  text: string;
  checked: boolean;
  required: boolean;
}

export interface ConflictOfInterest {
  id: string;
  statement: string;
  response: 'no' | 'yes';
  details: string;
}

const defaultDeclarations: Declaration[] = [
  { id: 'no_reservations', text: '(A) No Reservations – We have examined the tender document fully and have no reservations.', checked: false, required: true },
  { id: 'eligibility', text: '(B) Eligibility – We are eligible to participate in public procurement per PPADA 2015.', checked: false, required: true },
  { id: 'conformity', text: '(C) Conformity – We offer to supply in conformity with the tendering document.', checked: false, required: true },
  { id: 'ethical_conduct', text: '(D) Code of Ethical Conduct – We commit to abide by the PPRA Code of Ethics for procurement.', checked: false, required: true },
  { id: 'price_validity', text: '(E) Price Validity – Our prices are fixed and firm for the entire validity period.', checked: false, required: true },
  { id: 'one_quotation', text: '(F) One Quotation Per Tenderer – We are not submitting any other quotation for this tender.', checked: false, required: true },
  { id: 'suspension', text: '(G) Suspension & Debarment – We are not subject to any debarment by PPRA or any authority.', checked: false, required: true },
  { id: 'fraud_corruption', text: '(H) Fraud & Corruption – No person acting for us will engage in any corrupt, fraudulent, coercive, or collusive practice.', checked: false, required: true },
  { id: 'anti_competitive', text: '(I) Anti-Competitive Practices – Our tender is genuine and non-collusive per the Competition Act 2010.', checked: false, required: true },
  { id: 'beneficial_ownership', text: '(J) Beneficial Ownership – We commit to provide beneficial ownership information if awarded.', checked: false, required: true },
  { id: 'tax_compliance', text: '(K) Tax Compliance – We have a valid Tax Compliance Certificate from KRA.', checked: false, required: true },
  { id: 'local_content', text: '(L) Local Content – We comply with Buy Kenya Build Kenya policy requirements where applicable.', checked: false, required: false },
];

const defaultConflicts: ConflictOfInterest[] = [
  { id: 'common_control', statement: 'Tenderer is directly/indirectly controlled by or under common control with another tenderer', response: 'no', details: '' },
  { id: 'same_legal_rep', statement: 'Tenderer has the same legal representative as another tenderer', response: 'no', details: '' },
  { id: 'family_relationship', statement: 'Tenderer has close business or family relationship with a staff of the Procuring Entity', response: 'no', details: '' },
  { id: 'former_employee', statement: 'Any director/partner was previously employed by the Procuring Entity within the last 12 months', response: 'no', details: '' },
];

interface DeclarationsFormProps {
  declarations: Declaration[];
  onDeclarationsChange: (declarations: Declaration[]) => void;
  conflicts: ConflictOfInterest[];
  onConflictsChange: (conflicts: ConflictOfInterest[]) => void;
}

const DeclarationsForm = ({ declarations, onDeclarationsChange, conflicts, onConflictsChange }: DeclarationsFormProps) => {
  const toggleDeclaration = (id: string) => {
    onDeclarationsChange(
      declarations.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d))
    );
  };

  const updateConflict = (id: string, field: keyof ConflictOfInterest, value: string) => {
    onConflictsChange(
      conflicts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const allRequiredChecked = declarations.filter((d) => d.required).every((d) => d.checked);
  const checkedCount = declarations.filter((d) => d.checked).length;

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          The following declarations are standard per the Public Procurement & Asset Disposal Act 2015 (PPADA). All required declarations must be confirmed.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Statutory Declarations</CardTitle>
                <CardDescription>
                  {checkedCount}/{declarations.length} declarations confirmed
                </CardDescription>
              </div>
            </div>
            {!allRequiredChecked && (
              <span className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full">
                Required declarations incomplete
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {declarations.map((decl) => (
              <label
                key={decl.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  decl.checked
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleDeclaration(decl.id)}
              >
                <Checkbox
                  checked={decl.checked}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm">{decl.text}</span>
                  {decl.required && !decl.checked && (
                    <span className="ml-2 text-xs text-destructive font-medium">Required</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Conflict of Interest Disclosure</CardTitle>
              <CardDescription>Declare any potential conflicts per PPADA S.57</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Statement</TableHead>
                  <TableHead className="w-[120px]">Response</TableHead>
                  <TableHead className="min-w-[200px]">Details (if Yes)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conflicts.map((conflict) => (
                  <TableRow key={conflict.id}>
                    <TableCell className="text-sm">{conflict.statement}</TableCell>
                    <TableCell>
                      <Select
                        value={conflict.response}
                        onValueChange={(v) => updateConflict(conflict.id, 'response', v)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={conflict.details}
                        onChange={(e) => updateConflict(conflict.id, 'details', e.target.value)}
                        placeholder={conflict.response === 'yes' ? 'Provide details...' : 'N/A'}
                        disabled={conflict.response === 'no'}
                        className="h-9"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { defaultDeclarations, defaultConflicts };
export default DeclarationsForm;
