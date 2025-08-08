/**
 * Wallet Context - MetaMask Integration for Coral8
 * Provides Web3 wallet connection functionality for authenticated users
 * Handles wallet state, network switching, and transaction capabilities
 * Integrated with Coral8's cultural economics and COW token system
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http, formatEther, parseEther } from 'viem';
import { optimism, optimismGoerli, mainnet } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  
  // Connection methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToOptimism: () => Promise<void>;
  
  // Transaction methods
  sendTransaction: (to: string, amount: string) => Promise<string>;
  
  // Status
  isConnecting: boolean;
  error: string | null;
  isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Optimism network configuration for COW token deployment
const OPTIMISM_CHAIN_CONFIG = {
  chainId: '0xA', // 10 in hex
  chainName: 'Optimism',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // State management for wallet connection
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        // Check if already connected
        checkConnection();
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    // Add a small delay to ensure DOM is ready and MetaMask has loaded
    const timer = setTimeout(checkMetaMask, 100);
    
    // Also check immediately if window.ethereum is already available
    if (typeof window !== 'undefined' && window.ethereum) {
      checkMetaMask();
    }
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Handle account changes (user switches accounts in MetaMask)
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAddress(accounts[0]);
      fetchBalance(accounts[0]);
    }
  }, []);

  // Handle chain changes (user switches networks)
  const handleChainChanged = useCallback((chainId: string) => {
    const chainIdNumber = parseInt(chainId, 16);
    setChainId(chainIdNumber);
    
    // Refresh balance when chain changes
    if (address) {
      fetchBalance(address);
    }
  }, [address]);

  // Check if wallet is already connected
  const checkConnection = async () => {
    try {
      if (!window.ethereum) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setChainId(parseInt(chainId, 16));
        setIsConnected(true);
        await fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async (walletAddress: string) => {
    try {
      if (!window.ethereum) return;
      
      const publicClient = createPublicClient({
        chain: optimism,
        transport: http()
      });
      
      const balance = await publicClient.getBalance({ 
        address: walletAddress as `0x${string}` 
      });
      
      setBalance(formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    }
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setAddress(account);
        setChainId(parseInt(chainId, 16));
        setIsConnected(true);
        
        await fetchBalance(account);
        
        // Update user profile with wallet address
        try {
          await fetch('/api/user/wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress: account }),
          });
        } catch (error) {
          console.error('Error updating wallet address:', error);
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  };

  // Switch to Optimism network for COW token interactions
  const switchToOptimism = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not available');
      return;
    }

    try {
      // Try to switch to Optimism
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: OPTIMISM_CHAIN_CONFIG.chainId }],
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [OPTIMISM_CHAIN_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding Optimism network:', addError);
          setError('Failed to add Optimism network');
        }
      } else {
        console.error('Error switching to Optimism:', error);
        setError('Failed to switch to Optimism network');
      }
    }
  };

  // Send transaction (for COW token transfers or other operations)
  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!window.ethereum || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const walletClient = createWalletClient({
        chain: optimism,
        transport: custom(window.ethereum)
      });

      const hash = await walletClient.sendTransaction({
        account: address as `0x${string}`,
        to: to as `0x${string}`,
        value: parseEther(amount),
      });

      return hash;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      throw new Error(error.message || 'Transaction failed');
    }
  };

  const value: WalletContextType = {
    // Connection state
    isConnected,
    address,
    balance,
    chainId,
    
    // Methods
    connectWallet,
    disconnectWallet,
    switchToOptimism,
    sendTransaction,
    
    // Status
    isConnecting,
    error,
    isMetaMaskInstalled,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}