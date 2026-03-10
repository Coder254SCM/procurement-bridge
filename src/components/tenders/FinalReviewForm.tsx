import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, FileCheck, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ReviewSummaryData {
  title: string;
  tenderNumber: string;
  financialYear: string;
  procurementMethod: string;
  procurementCategory: string;
  category: string;
  budgetAmount: number;
  budgetCurrency: string;
  submissionDeadline: Date | undefined;
  openingDate: Date | undefined;
  validityPeriod: string;
  agpoReservation: string;
  peOrganisation: string;
  contactPerson: string;
  contactDesignation: string;
  contactEmail: string;
  submissionMethod: string;
  awardCriteria: string;
  foreignCurrency: string;
  alternativeTenders: string;
  numberOfLots: string;
  scheduleItemsCount: number;
  techSpecsCount: number;
  priceItemsCount: number;
  declarationsChecked: number;
  declarationsTotal: number;
  requiredDocsCount: number;
  totalDocsCount: number;
  grandTotal: number;
}

interface FinalReviewFormProps {
  digitalSignature: boolean;
  onDigitalSignatureChange: () => void;
  submitting: boolean;
  onCancel: () => void;
  isFormValid: boolean;
  summaryData?: ReviewSummaryData;
}

const FinalReviewForm = ({
  digitalSignature,
  onDigitalSignatureChange,
  submitting,
  onCancel,
  isFormValid,
  summaryData,
}: FinalReviewFormProps) => {
  const SummaryRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );

  const formatDate = (d: Date | undefined) => d ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' }).format(d) : '—';
  const formatCurrency = (amount: number, currency: string) =>
    `${currency} ${new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(amount)}`;

  return (
    <div className="space-y-6">
      {summaryData && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Tender Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryRow label="Tender Name" value={summaryData.title} />
              <SummaryRow label="Tender No." value={summaryData.tenderNumber} />
              <SummaryRow label="Financial Year" value={summaryData.financialYear} />
              <SummaryRow label="Procurement Method" value={summaryData.procurementMethod} />
              <SummaryRow label="Procurement Category" value={summaryData.procurementCategory} />
              <SummaryRow label="Industry Sector" value={summaryData.category} />
              <SummaryRow label="AGPO Reservation" value={summaryData.agpoReservation === 'none' ? 'No Reservation' : summaryData.agpoReservation?.toUpperCase()} />
              <SummaryRow label="Validity Period" value={`${summaryData.validityPeriod || '91'} days`} />
              <SummaryRow label="Submission Deadline" value={formatDate(summaryData.submissionDeadline)} />
              <SummaryRow label="Opening Date" value={formatDate(summaryData.openingDate)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Procuring Entity</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryRow label="Organisation" value={summaryData.peOrganisation} />
              <SummaryRow label="Contact Person" value={`${summaryData.contactPerson} · ${summaryData.contactDesignation}`} />
              <SummaryRow label="Email" value={summaryData.contactEmail} />
              <SummaryRow label="Submission Method" value={summaryData.submissionMethod} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-primary">TDS Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryRow label="Award Criteria" value={summaryData.awardCriteria} />
              <SummaryRow label="Foreign Currency" value={summaryData.foreignCurrency === 'allowed' ? 'Allowed' : 'Not Allowed'} />
              <SummaryRow label="Alternative Tenders" value={summaryData.alternativeTenders === 'allowed' ? 'Allowed' : 'Not Allowed'} />
              <SummaryRow label="Number of Lots" value={summaryData.numberOfLots === 'multiple' ? 'Multiple' : 'One Lot'} />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-primary">Documents & Specs</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryRow label="Required Documents" value={`${summaryData.requiredDocsCount} of ${summaryData.totalDocsCount} selected`} />
                <SummaryRow label="Schedule Items" value={`${summaryData.scheduleItemsCount} line items`} />
                <SummaryRow label="Technical Specs" value={`${summaryData.techSpecsCount} specifications`} />
                <SummaryRow label="Price Items" value={`${summaryData.priceItemsCount} items`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-primary">Price Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryRow label="Budget" value={formatCurrency(summaryData.budgetAmount || 0, summaryData.budgetCurrency)} />
                <SummaryRow label="Grand Total (Price Schedule)" value={formatCurrency(summaryData.grandTotal || 0, summaryData.budgetCurrency)} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Declarations</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryRow
                label="Declarations Confirmed"
                value={`${summaryData.declarationsChecked} of ${summaryData.declarationsTotal}`}
              />
              {summaryData.declarationsChecked < summaryData.declarationsTotal && (
                <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
                  ⚠ Not all declarations have been confirmed
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Kenya Procurement Law Compliance</CardTitle>
              <CardDescription>This tender follows PPADA 2015 and Regulations 2020</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Procurement Standard</h3>
              <p className="text-sm text-muted-foreground">PPADA 2015 & PPADA Regulations 2020</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Anti-corruption Measures</h3>
              <p className="text-sm text-muted-foreground">Blockchain verification & AI pattern detection</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Supply Chain Review</h3>
              <p className="text-sm text-muted-foreground">Professional oversight by certified professionals</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-medium">Required Documentation</h3>
              <p className="text-sm text-muted-foreground">Statutory compliance with KRA, NSSF and NHIF</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2 p-4 border rounded-md">
        <Checkbox
          id="digital-signature"
          checked={digitalSignature}
          onCheckedChange={onDigitalSignatureChange}
        />
        <label
          htmlFor="digital-signature"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add digital signature and blockchain timestamp
        </label>
      </div>

      {!isFormValid && (
        <div className="flex p-3 rounded-md items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm">Please ensure all required fields are completed and evaluation criteria total equals 100%.</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-8">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || !isFormValid}>
          {submitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Tender
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalReviewForm;
