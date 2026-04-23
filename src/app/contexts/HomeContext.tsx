import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Home {
  id: string;
  name: string;
  address: string;
  createdBy: string;
  createdAt: string;
}

interface HomeContextType {
  currentHome: Home | null;
  createHome: (name: string, address: string, userId: string) => void;
}

export const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Mock data inicial
const MOCK_HOME: Home = {
  id: '1',
  name: 'Casa Familia García',
  address: 'Av. Principal 123',
  createdBy: '1',
  createdAt: '2026-03-01',
};

export function HomeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [currentHome, setCurrentHome] = useState<Home | null>(MOCK_HOME);

  const createHome = (name: string, address: string, userId: string) => {
    const newHome: Home = {
      id: Date.now().toString(),
      name,
      address,
      createdBy: userId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentHome(newHome);
  };

  return (
    <HomeContext.Provider value={{ currentHome, createHome }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
}
