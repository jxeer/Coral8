import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TokenBalance, UserStats } from '@shared/schema';

interface AppContextType {
  user: User | null;
  tokenBalance: TokenBalance | null;
  userStats: UserStats | null;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>(user?.walletAddress || "");

  const refreshData = async () => {
    try {
      // Fetch user data
      const userResponse = await fetch('/api/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Fetch balance data
      const balanceResponse = await fetch('/api/balances');
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setTokenBalance(balanceData);
      }

      // Fetch stats data
      const statsResponse = await fetch('/api/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      tokenBalance,
      userStats,
      walletAddress,
      setWalletAddress,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
