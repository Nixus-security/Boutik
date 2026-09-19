"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAccount } from "@/lib/data/profile";
import { DEFAULT_CURRENCY } from "@/lib/currency";

const CurrencyContext = createContext<{ currency: string; setCurrency: (c: string) => void }>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    getAccount()
      .then((account) => setCurrency(account.currency))
      .catch(() => {
        // devise par défaut conservée si le profil est indisponible
      });
  }, []);

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
