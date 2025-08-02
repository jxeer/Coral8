/**
 * Demo Context Hook
 * Provides mock data for demo mode without requiring authentication
 * Simulates the full AppContext experience for feature demonstration
 */

import { createContext, useContext } from "react";

export interface DemoContextType {
  walletAddress: string;
  tokenBalance: {
    cow1Balance: string;
    cow2Balance: string;
    cow3Balance: string;
    lastActive: string;
  };
  userStats: {
    focusScore: number;
    tribeMembers: number;
    emotionScore: string;
    monthlyEarnings: string;
    attentionViews: number;
    totalProjects: number;
    completionRate: number;
  };
  connectWallet: () => void;
  disconnectWallet: () => void;
  refreshBalance: () => void;
}

export const mockDemoData: DemoContextType = {
  walletAddress: "0x742d35Cc6634C0532925a3b8D5c01f5ca7Dc5bF8",
  tokenBalance: {
    cow1Balance: "1,247.50",
    cow2Balance: "892.75",
    cow3Balance: "156.25",
    lastActive: new Date().toISOString(),
  },
  userStats: {
    focusScore: 87,
    tribeMembers: 23,
    emotionScore: "7.8",
    monthlyEarnings: "2,847.50",
    attentionViews: 5420,
    totalProjects: 12,
    completionRate: 94,
  },
  connectWallet: () => console.log("Demo: Wallet connected"),
  disconnectWallet: () => console.log("Demo: Wallet disconnected"),
  refreshBalance: () => console.log("Demo: Balance refreshed"),
};

export const DemoContext = createContext<DemoContextType>(mockDemoData);

export function useDemoContext() {
  return useContext(DemoContext);
}