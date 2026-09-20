import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusiness } from '@/contexts/BusinessContext';

const NEW_BUSINESS = '__new__';

const BusinessSwitcher: React.FC = () => {
  const { memberships, currentBusinessId, switchBusiness, loading } = useBusiness();
  const navigate = useNavigate();

  if (loading || memberships.length === 0) return null;

  return (
    <Select
      value={currentBusinessId ?? undefined}
      onValueChange={(value) => {
        if (value === NEW_BUSINESS) navigate('/business?new=1');
        else switchBusiness(value);
      }}
    >
      <SelectTrigger className="h-9 w-[190px] text-sm" aria-label="Current business">
        <div className="flex items-center gap-2 truncate">
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Select business" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {memberships.map((membership) => (
          <SelectItem key={membership.business_id} value={membership.business_id}>
            {membership.business?.name || 'Business'}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={NEW_BUSINESS}>
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New business
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BusinessSwitcher;
