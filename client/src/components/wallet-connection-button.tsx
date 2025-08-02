/**
 * Wallet Connection Button Component
 * Handles MetaMask wallet integration for authenticated users
 * Provides secondary authentication method alongside Replit OAuth
 * Features signature verification and secure wallet address linking
 * Enables Web3 functionality within the Coral8 ecosystem
 */

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Waves } from 'lucide-react';

interface WalletConnectionButtonProps extends Omit<ButtonProps, 'onClick' | 'onError'> {
  onSuccess?: (token: string, user: any) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnectionButton({ 
  onSuccess, 
  onError, 
  children,
  className = '',
  ...props 
}: WalletConnectionButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        const error = 'MetaMask not detected. Please install MetaMask to continue.';
        onError?.(error);
        toast({
          title: 'MetaMask Required',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      const walletAddress = accounts[0];

      // Get nonce from server
      const nonceResponse = await fetch('/api/auth/nonce');
      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication nonce');
      }
      const { nonce } = await nonceResponse.json();

      // Get message to sign
      const messageResponse = await fetch('/api/auth/wallet-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, nonce }),
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to get authentication message');
      }
      const { message } = await messageResponse.json();

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });

      // Authenticate with server
      const authResponse = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          signature,
          message,
        }),
      });

      if (!authResponse.ok) {
        const error = await authResponse.json();
        throw new Error(error.message || 'Wallet authentication failed');
      }

      const result = await authResponse.json();
      
      onSuccess?.(result.token, result.user);
      
      toast({
        title: 'Wallet Connected!',
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        variant: 'default',
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect wallet';
      onError?.(errorMessage);
      
      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-light via-seafoam-light to-teal-400 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {isConnecting ? (
          <>
            <Waves className="w-4 h-4 animate-pulse" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>{children || 'Connect MetaMask'}</span>
          </>
        )}
      </div>
    </Button>
  );
}