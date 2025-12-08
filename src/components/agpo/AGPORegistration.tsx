import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { agpoService, AGPOCategory } from "@/services/AGPOService";
import { Users, Award, FileCheck, Shield, Upload } from "lucide-react";

interface AGPORegistrationProps {
  supplierId: string;
  onRegistrationComplete?: () => void;
}

const AGPO_CATEGORIES: AGPOCategory[] = [
  { id: '1', category_code: 'YOUTH', category_name: 'Youth-Owned Enterprise', description: 'Businesses owned by persons aged 18-35 years', preference_percentage: 30, reservation_limit: 0.30, is_active: true },
  { id: '2', category_code: 'WOMEN', category_name: 'Women-Owned Enterprise', description: 'Businesses with at least 70% women ownership', preference_percentage: 30, reservation_limit: 0.30, is_active: true },
  { id: '3', category_code: 'PWD', category_name: 'Persons with Disabilities', description: 'Businesses owned by persons with disabilities', preference_percentage: 30, reservation_limit: 0.30, is_active: true },
  { id: '4', category_code: 'MSME', category_name: 'Micro, Small & Medium Enterprises', description: 'Registered MSMEs as per Kenya law', preference_percentage: 20, reservation_limit: 0.20, is_active: true },
];

export function AGPORegistration({ supplierId, onRegistrationComplete }: AGPORegistrationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [certifyingBody, setCertifyingBody] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !registrationNumber || !certifyingBody || !expiryDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    try {
      await agpoService.registerSupplier({
        supplier_id: supplierId,
        agpo_category_id: selectedCategory,
        certificate_number: registrationNumber,
        certificate_expiry: expiryDate,
        certificate_document_url: undefined,
      });
      toast.success("AGPO registration submitted successfully");
      onRegistrationComplete?.();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            AGPO Registration
          </CardTitle>
          <CardDescription>
            Register for Access to Government Procurement Opportunities (AGPO) to receive preferential treatment in public procurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            {AGPO_CATEGORIES.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{category.category_name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant="secondary">
                      {category.preference_percentage}% preference
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="regNumber">AGPO Registration Number *</Label>
              <Input
                id="regNumber"
                placeholder="e.g., AGPO/2024/12345"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certBody">Certifying Body *</Label>
              <Select value={certifyingBody} onValueChange={setCertifyingBody}>
                <SelectTrigger>
                  <SelectValue placeholder="Select certifying body" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ntsa">National Treasury</SelectItem>
                  <SelectItem value="ppra">Public Procurement Regulatory Authority</SelectItem>
                  <SelectItem value="county">County Government</SelectItem>
                  <SelectItem value="ncpwd">National Council for Persons with Disabilities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Certificate Expiry Date *</Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Document Upload Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Supporting Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload AGPO certificate, ID copies, and business registration documents
                  </p>
                </div>
                <Button variant="outline" className="ml-auto">
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I confirm that all information provided is accurate and I understand that providing false information may result in disqualification and legal action under the Public Procurement and Asset Disposal Act 2015.
            </Label>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedCategory}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit AGPO Registration"}
          </Button>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AGPO Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">30% Reservation</h4>
                <p className="text-sm text-muted-foreground">
                  30% of procurement value reserved for AGPO suppliers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Preference Points</h4>
                <p className="text-sm text-muted-foreground">
                  Additional evaluation points in tender scoring
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Simplified Process</h4>
                <p className="text-sm text-muted-foreground">
                  Reduced documentation for qualifying tenders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
