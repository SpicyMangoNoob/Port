import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CURRENCIES, CurrencyCode, DEFAULT_CURRENCY } from "@/lib/currency";

function isValidCurrencyCode(value: string | null): value is CurrencyCode {
  return !!value && CURRENCIES.some((c) => c.code === value);
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "spicymango-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window === "undefined") return DEFAULT_CURRENCY;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValidCurrencyCode(stored) ? stored : DEFAULT_CURRENCY;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => setCurrencyState(code);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
