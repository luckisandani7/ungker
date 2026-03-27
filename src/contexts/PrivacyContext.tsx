import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrivacyContextType {
  hideMoney: boolean;
  toggleHideMoney: () => void;
  formatMoney: (amount: number | string) => string;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [hideMoney, setHideMoney] = useState(() => {
    const saved = localStorage.getItem('hideMoney');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hideMoney', String(hideMoney));
  }, [hideMoney]);

  const toggleHideMoney = () => setHideMoney(prev => !prev);

  const formatMoney = (amount: number | string) => {
    if (hideMoney) return '***';
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return amount.toString();

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <PrivacyContext.Provider value={{ hideMoney, toggleHideMoney, formatMoney }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
