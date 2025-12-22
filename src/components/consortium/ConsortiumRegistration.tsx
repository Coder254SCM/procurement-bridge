import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { consortiumService, ConsortiumMember } from "@/services/ConsortiumService";
import { Users, Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ConsortiumRegistrationProps {
  tenderId: string;
  leadPartnerId: string;
  onRegistrationComplete?: () => void;
}

interface MemberForm {
  id: string;
  email: string;
  role: 'lead' | 'partner' | 'subcontractor';
  percentage_share: number;
  responsibilities: string;
  financial_capacity: number;
}

export function ConsortiumRegistration({ tenderId, leadPartnerId, onRegistrationComplete }: ConsortiumRegistrationProps) {
  const [consortiumName, setConsortiumName] = useState('');
  const [members, setMembers] = useState<MemberForm[]>([
    { id: '1', email: '', role: 'lead', percentage_share: 51, responsibilities: '', financial_capacity: 0 }
  ]);
  const [jointLiabilityAccepted, setJointLiabilityAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalShare = members.reduce((sum, m) => sum + m.percentage_share, 0);
  const totalFinancialCapacity = members.reduce((sum, m) => sum + m.financial_capacity, 0);
  const isValidShare = totalShare === 100;

  const addMember = () => {
    if (members.length >= 5) {
      toast.error("Maximum 5 consortium members allowed");
      return;
    }
    setMembers([
      ...members,
      { 
        id: Date.now().toString(), 
        email: '', 
        role: 'partner', 
        percentage_share: 0, 
        responsibilities: '',
        financial_capacity: 0 
      }
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) {
      toast.error("At least one member is required");
      return;
    }
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof MemberForm, value: any) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = async () => {
    if (!consortiumName) {
      toast.error("Please enter a consortium name");
      return;
    }

    if (!isValidShare) {
      toast.error("Member shares must total exactly 100%");
      return;
    }

    if (!jointLiabilityAccepted) {
      toast.error("Please accept joint liability terms");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await consortiumService.createConsortium({
        tender_id: tenderId,
        lead_partner_id: leadPartnerId,
        consortium_name: consortiumName,
        total_members: members.length,
        combined_turnover: totalFinancialCapacity,
        joint_liability_accepted: jointLiabilityAccepted,
        status: 'draft'
      });

      if (result.id) {
        // Add members
        for (const member of members) {
          const memberData: ConsortiumMember = {
            member_user_id: member.email,
            member_role: member.role,
            percentage_share: member.percentage_share,
            responsibilities: [member.responsibilities],
            financial_capacity: member.financial_capacity,
            documents_submitted: {},
            accepted_terms: false
          };
          await consortiumService.addMember(result.id, memberData);
        }

        toast.success("Consortium created successfully");
        onRegistrationComplete?.();
      }
    } catch (error) {
      console.error('Consortium creation error:', error);
      toast.error("Failed to create consortium");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Consortium Registration
          </CardTitle>
          <CardDescription>
            Register a consortium (joint venture) to submit a combined bid for this tender
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consortium Name */}
          <div className="space-y-2">
            <Label htmlFor="consortiumName">Consortium Name *</Label>
            <Input
              id="consortiumName"
              placeholder="e.g., ABC-XYZ Joint Venture"
              value={consortiumName}
              onChange={(e) => setConsortiumName(e.target.value)}
            />
          </div>

          {/* Share Progress */}
          <Card className={`${isValidShare ? 'border-green-500' : 'border-destructive'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Share Allocation</span>
                <Badge variant={isValidShare ? 'default' : 'destructive'}>
                  {totalShare}% / 100%
                </Badge>
              </div>
              <Progress value={Math.min(totalShare, 100)} className="h-2" />
              {!isValidShare && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Shares must total exactly 100%
                </p>
              )}
            </CardContent>
          </Card>

          {/* Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Consortium Members</Label>
              <Button variant="outline" size="sm" onClick={addMember}>
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>

            {members.map((member, index) => (
              <Card key={member.id} className="relative">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={member.role === 'lead' ? 'default' : 'secondary'}>
                      {member.role === 'lead' ? 'Lead Partner' : `Partner ${index + 1}`}
                    </Badge>
                    {index > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Email *</Label>
                      <Input
                        type="email"
                        placeholder="partner@company.com"
                        value={member.email}
                        onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Share Percentage *</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={member.percentage_share}
                        onChange={(e) => updateMember(member.id, 'percentage_share', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Financial Capacity (KES)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={member.financial_capacity}
                        onChange={(e) => updateMember(member.id, 'financial_capacity', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <select
                        className="w-full h-10 px-3 border rounded-md bg-background"
                        value={member.role}
                        onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                        disabled={index === 0}
                      >
                        <option value="lead">Lead Partner</option>
                        <option value="partner">Partner</option>
                        <option value="subcontractor">Subcontractor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Responsibilities</Label>
                    <Textarea
                      placeholder="Describe this partner's responsibilities in the consortium..."
                      value={member.responsibilities}
                      onChange={(e) => updateMember(member.id, 'responsibilities', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Consortium Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Members:</span>
                  <span className="font-medium">{members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Combined Financial Capacity:</span>
                  <span className="font-medium">KES {totalFinancialCapacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share Validation:</span>
                  {isValidShare ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Valid
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Invalid
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Joint Liability */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <Checkbox
              id="jointLiability"
              checked={jointLiabilityAccepted}
              onCheckedChange={(checked) => setJointLiabilityAccepted(checked as boolean)}
            />
            <Label htmlFor="jointLiability" className="text-sm leading-relaxed">
              <strong>Joint and Several Liability:</strong> All consortium members agree to be jointly and severally liable for the performance of the contract. Each member accepts responsibility for the entire contract obligations, regardless of their percentage share.
            </Label>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !isValidShare || !jointLiabilityAccepted}
            className="w-full"
          >
            {isSubmitting ? "Creating Consortium..." : "Create Consortium"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
