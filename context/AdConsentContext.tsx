import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AdConsentStatus = 'unknown' | 'granted' | 'denied';

interface AdConsentContextType {
  status: AdConsentStatus;
  setConsent: (next: Exclude<AdConsentStatus, 'unknown'>) => void;
}

const STORAGE_KEY = 'ai-coding-hub-ad-consent-v1';

const AdConsentContext = createContext<AdConsentContextType | undefined>(undefined);

export const AdConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AdConsentStatus>('unknown');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      setStatus(stored);
    }
  }, []);

  const setConsent = (next: Exclude<AdConsentStatus, 'unknown'>) => {
    setStatus(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({
      status,
      setConsent,
    }),
    [status]
  );

  return <AdConsentContext.Provider value={value}>{children}</AdConsentContext.Provider>;
};

export const useAdConsent = () => {
  const context = useContext(AdConsentContext);
  if (!context) {
    throw new Error('useAdConsent must be used within an AdConsentProvider');
  }
  return context;
};
