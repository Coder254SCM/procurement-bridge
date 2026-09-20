import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BusinessService, { Business, BusinessMembership, BusinessRole } from '@/services/BusinessService';

const STORAGE_KEY = 'procurechain.currentBusinessId';

interface BusinessContextValue {
  loading: boolean;
  memberships: BusinessMembership[];
  currentBusiness: Business | null;
  currentBusinessId: string | null;
  currentRole: BusinessRole | null;
  canManage: boolean;
  switchBusiness: (businessId: string) => void;
  createBusiness: (input: Partial<Business> & { name: string }) => Promise<Business>;
  refresh: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<BusinessMembership[]>([]);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setMemberships([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const rows = await BusinessService.listMyMemberships(user.id);
      setMemberships(rows);
      setCurrentBusinessId((previous) => {
        const stillValid = previous && rows.some((r) => r.business_id === previous);
        return stillValid ? previous : rows[0]?.business_id ?? null;
      });
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (currentBusinessId) localStorage.setItem(STORAGE_KEY, currentBusinessId);
    else localStorage.removeItem(STORAGE_KEY);
  }, [currentBusinessId]);

  const switchBusiness = useCallback((businessId: string) => {
    setCurrentBusinessId(businessId);
  }, []);

  const createBusiness = useCallback(
    async (input: Partial<Business> & { name: string }) => {
      if (!user) throw new Error('You must be signed in to create a business.');
      const business = await BusinessService.createBusiness(user.id, input);
      await refresh();
      setCurrentBusinessId(business.id);
      return business;
    },
    [user, refresh]
  );

  const value = useMemo<BusinessContextValue>(() => {
    const active = memberships.find((m) => m.business_id === currentBusinessId) ?? null;
    return {
      loading,
      memberships,
      currentBusiness: active?.business ?? null,
      currentBusinessId: active?.business_id ?? null,
      currentRole: active?.role ?? null,
      canManage: active?.role === 'owner' || active?.role === 'admin',
      switchBusiness,
      createBusiness,
      refresh,
    };
  }, [loading, memberships, currentBusinessId, switchBusiness, createBusiness, refresh]);

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
