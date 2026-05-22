'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Transaction } from '@/lib/types';

export type CashDeskMethodFilter = Transaction['method'] | 'all';
export type CashDeskTypeFilter = Transaction['type'] | 'all';
export type CashDeskPeriodFilter = 'day' | 'week' | 'month' | 'all';

interface CashDeskFiltersContextValue {
  methodFilter: CashDeskMethodFilter;
  setMethodFilter: (value: CashDeskMethodFilter) => void;
  typeFilter: CashDeskTypeFilter;
  setTypeFilter: (value: CashDeskTypeFilter) => void;
  selectedPeriod: CashDeskPeriodFilter;
  setSelectedPeriod: (value: CashDeskPeriodFilter) => void;
}

const CashDeskFiltersContext = createContext<CashDeskFiltersContextValue | null>(null);

export function CashDeskFiltersProvider({ children }: { children: ReactNode }) {
  const [methodFilter, setMethodFilter] = useState<CashDeskMethodFilter>('all');
  const [typeFilter, setTypeFilter] = useState<CashDeskTypeFilter>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<CashDeskPeriodFilter>('all');

  return (
    <CashDeskFiltersContext.Provider
      value={{
        methodFilter,
        setMethodFilter,
        typeFilter,
        setTypeFilter,
        selectedPeriod,
        setSelectedPeriod,
      }}
    >
      {children}
    </CashDeskFiltersContext.Provider>
  );
}

export function useCashDeskFilters() {
  const context = useContext(CashDeskFiltersContext);
  if (!context) {
    throw new Error('useCashDeskFilters must be used within CashDeskFiltersProvider');
  }
  return context;
}
