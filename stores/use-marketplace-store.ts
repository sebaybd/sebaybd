"use client";

import { create } from "zustand";

export interface MarketplaceState {
  query: string;
  division?: string;
  district?: string;
  area?: string;
  setQuery: (query: string) => void;
  setLocation: (division?: string, district?: string, area?: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()((set: (partial: Partial<MarketplaceState>) => void) => ({
  query: "",
  division: undefined,
  district: undefined,
  area: undefined,
  setQuery: (query: string) => set({ query }),
  setLocation: (division?: string, district?: string, area?: string) =>
    set({ division, district, area }),
}));
