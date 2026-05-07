import React, { createContext, useContext, useState, useEffect } from 'react';

type DesignType = 'modern' | 'imperial';

interface DesignContextType {
  design: DesignType;
  setDesign: (design: DesignType) => void;
  toggleDesign: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [design, setDesignState] = useState<DesignType>(() => {
    const saved = localStorage.getItem('app-design-style');
    return (saved as DesignType) || 'modern';
  });

  const setDesign = (newDesign: DesignType) => {
    setDesignState(newDesign);
    localStorage.setItem('app-design-style', newDesign);
  };

  const toggleDesign = () => {
    const nextDesign = design === 'modern' ? 'imperial' : 'modern';
    setDesign(nextDesign);
  };

  return (
    <DesignContext.Provider value={{ design, setDesign, toggleDesign }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};
