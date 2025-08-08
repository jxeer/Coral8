/**
 * Wallet Connection Component
 * MetaMask integration interface for Coral8 users
 * Provides wallet connection, network switching, and balance display
 * Features oceanic design theme and mobile-optimized interactions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/wallet-context';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  showFullCard?: boolean;
  className?: string;
}

export function WalletConnection({ showFullCard = true, className = '' }: WalletConnectionProps) {
  const {
    isConnected,
    address,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToOptimism,
    isConnecting,
    error,
    isMetaMaskInstalled,
  } = useWallet();
  
  const { toast } = useToast();

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Format balance for display
  const formatBalance = (bal: string | null) => {
    if (!bal) return '0';
    const num = parseFloat(bal);
    return num.toFixed(4);
  };

  // Get network name from chain ID
  const getNetworkName = (id: number | null) => {
    switch (id) {
      case 1: return 'Ethereum Mainnet';
      case 10: return 'Optimism';
      case 420: return 'Optimism Goerli';
      default: return 'Unknown Network';
    }
  };

  // Handle wallet connection with toast feedback
  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask wallet",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Handle network switch to Optimism
  const handleSwitchToOptimism = async () => {
    try {
      await switchToOptimism();
      toast({
        title: "Network Switched",
        description: "Successfully switched to Optimism network",
      });
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "MetaMask wallet has been disconnected",
    });
  };

  // If not showing full card, return compact button version
  if (!showFullCard) {
    if (!isConnected) {
      return (
        <Button
          onClick={handleConnect}
          disabled={!isMetaMaskInstalled || isConnecting}
          className={`bg-orange-500 hover:bg-orange-600 text-white font-medium border border-orange-300 shadow-md transition-all duration-200 ${className}`}
          style={{
            backgroundColor: (!isMetaMaskInstalled || isConnecting) ? '#9ca3af' : '#f97316',
            color: (!isMetaMaskInstalled || isConnecting) ? '#374151' : '#ffffff',
            borderColor: (!isMetaMaskInstalled || isConnecting) ? '#9ca3af' : '#fed7aa'
          }}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4 mr-2" />
          )}
          {!isMetaMaskInstalled ? 'Install MetaMask' : 'Connect Wallet'}
        </Button>
      );
    }

    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="outline" className="bg-seafoam/20 text-deep-navy border-deep-teal">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {formatAddress(address!)}
        </Badge>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="border-coral text-coral hover:bg-coral/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Card className={`border-deep-teal/20 bg-white shadow-lg ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-deep-navy">
          <Wallet className="w-5 h-5 mr-2 text-deep-teal" />
          Web3 Wallet Connection
        </CardTitle>
        <CardDescription className="text-moon-gray">
          Connect your MetaMask wallet to interact with COW tokens on Optimism network
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* MetaMask Installation Check */}
        {!isMetaMaskInstalled && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>MetaMask extension is required for wallet connectivity</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                className="ml-2"
              >
                Install MetaMask
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        {!isConnected ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-seafoam/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-deep-teal" />
            </div>
            <h3 className="text-lg font-semibold text-deep-navy mb-2">Connect Your Wallet</h3>
            <p className="text-moon-gray mb-4">
              Connect MetaMask to access Web3 features and interact with COW tokens
            </p>
            <Button
              onClick={handleConnect}
              disabled={!isMetaMaskInstalled || isConnecting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium border border-orange-300 shadow-md transition-all duration-200"
              style={{
                backgroundColor: (!isMetaMaskInstalled || isConnecting) ? '#9ca3af' : '#f97316',
                color: (!isMetaMaskInstalled || isConnecting) ? '#374151' : '#ffffff',
                borderColor: (!isMetaMaskInstalled || isConnecting) ? '#9ca3af' : '#fed7aa'
              }}
              size="lg"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connected Status */}
            <div className="flex items-center justify-between p-4 bg-seafoam/10 rounded-lg border border-seafoam/30">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-deep-navy">Wallet Connected</p>
                  <p className="text-sm text-moon-gray">{formatAddress(address!)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="border-coral text-coral hover:bg-coral/10"
              >
                Disconnect
              </Button>
            </div>

            {/* Wallet Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-shell-cream/50 rounded-lg">
                <p className="text-xs font-medium text-moon-gray uppercase tracking-wide">Balance</p>
                <p className="text-lg font-semibold text-deep-navy">
                  {formatBalance(balance)} ETH
                </p>
              </div>
              <div className="p-3 bg-shell-cream/50 rounded-lg">
                <p className="text-xs font-medium text-moon-gray uppercase tracking-wide">Network</p>
                <p className="text-sm font-medium text-deep-navy">
                  {getNetworkName(chainId)}
                </p>
              </div>
            </div>

            {/* Network Switch for Optimism */}
            {chainId !== 10 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Switch to Optimism network for COW token interactions</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwitchToOptimism}
                    className="ml-2 border-deep-teal text-deep-teal hover:bg-deep-teal/10"
                  >
                    Switch Network
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Optimism Network Success */}
            {chainId === 10 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Connected to Optimism network - ready for COW token interactions
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Web3 Features Info */}
        <div className="pt-4 border-t border-shell-cream">
          <h4 className="font-medium text-deep-navy mb-2">Web3 Features Available:</h4>
          <ul className="text-sm text-moon-gray space-y-1">
            <li>• COW token transfers and interactions</li>
            <li>• On-chain governance voting</li>
            <li>• Marketplace transactions</li>
            <li>• Proof-of-work verification</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}