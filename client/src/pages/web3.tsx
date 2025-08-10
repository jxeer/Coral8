/**
 * Web3 Integration Page
 * Dedicated interface for MetaMask wallet connection and blockchain features
 * Provides comprehensive Web3 functionality for COW token interactions
 * Features wallet management, network switching, and transaction capabilities
 */

import { WalletConnection } from "@/components/wallet-connection";
import { TokenTransfer } from "@/components/token-transfer";
import { useWallet } from "@/contexts/wallet-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, ExternalLink, Coins, Vote, ShoppingCart, Info } from "lucide-react";

export default function Web3() {
  const { isConnected, address, chainId, balance } = useWallet();

  return (
    <div className="min-h-screen bg-shell-cream p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy mb-2">Web3 Integration</h1>
        <p className="text-moon-gray">
          Connect your MetaMask wallet to access blockchain features and COW token functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet Connection Card */}
        <div className="lg:col-span-2">
          <WalletConnection showFullCard={true} />
        </div>

        {/* Web3 Features Available */}
        {isConnected && (
          <>
            {/* Token Transfer */}
            <TokenTransfer />

            {/* COW Token Operations */}
            <Card className="border-deep-teal/20">
              <CardHeader>
                <CardTitle className="flex items-center text-deep-navy">
                  <Coins className="w-5 h-5 mr-2 text-deep-teal" />
                  Token Overview
                </CardTitle>
                <CardDescription>
                  Monitor your COW token balances and system overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-seafoam/10 rounded-lg">
                    <div className="text-lg font-bold text-deep-navy">COW1</div>
                    <div className="text-sm text-moon-gray">Base Token</div>
                    <div className="text-xs text-deep-teal mt-1">Balance: 0</div>
                  </div>
                  <div className="text-center p-3 bg-seafoam/10 rounded-lg">
                    <div className="text-lg font-bold text-deep-navy">COW2</div>
                    <div className="text-sm text-moon-gray">Enhanced</div>
                    <div className="text-xs text-deep-teal mt-1">Balance: 0</div>
                  </div>
                  <div className="text-center p-3 bg-seafoam/10 rounded-lg">
                    <div className="text-lg font-bold text-deep-navy">COW3</div>
                    <div className="text-sm text-moon-gray">Premium</div>
                    <div className="text-xs text-deep-teal mt-1">Balance: 0</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full border-deep-teal text-deep-teal" disabled>
                    View Token History
                  </Button>
                  <Button variant="outline" className="w-full border-deep-teal text-deep-teal" disabled>
                    Token Analytics
                  </Button>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    COW token smart contracts coming soon to Optimism network
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Governance Voting */}
            <Card className="border-deep-teal/20">
              <CardHeader>
                <CardTitle className="flex items-center text-deep-navy">
                  <Vote className="w-5 h-5 mr-2 text-deep-teal" />
                  On-Chain Governance
                </CardTitle>
                <CardDescription>
                  Participate in decentralized governance with COW tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-shell-cream/50 rounded-lg">
                  <h4 className="font-medium text-deep-navy mb-2">Voting Power</h4>
                  <p className="text-sm text-moon-gray">
                    Your voting power is determined by your COW token holdings and community participation
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-deep-teal hover:bg-deep-teal/90 text-white" disabled>
                    <Vote className="w-4 h-4 mr-2" />
                    Cast Blockchain Vote
                  </Button>
                  <Button variant="outline" className="w-full border-deep-teal text-deep-teal" disabled>
                    View Voting History
                  </Button>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    On-chain governance features will be available after smart contract deployment
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Marketplace Transactions */}
            <Card className="border-deep-teal/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-deep-navy">
                  <ShoppingCart className="w-5 h-5 mr-2 text-deep-teal" />
                  Blockchain Marketplace
                </CardTitle>
                <CardDescription>
                  Buy and sell goods with COW tokens using smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-shell-cream/50 rounded-lg">
                    <h4 className="font-medium text-deep-navy mb-2">Secure Transactions</h4>
                    <p className="text-sm text-moon-gray">
                      All marketplace transactions are secured by smart contracts on Optimism
                    </p>
                  </div>
                  <div className="p-4 bg-shell-cream/50 rounded-lg">
                    <h4 className="font-medium text-deep-navy mb-2">Escrow Protection</h4>
                    <p className="text-sm text-moon-gray">
                      Built-in escrow system protects both buyers and sellers
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button className="flex-1 bg-deep-teal hover:bg-deep-teal/90 text-white" disabled>
                    Browse Blockchain Items
                  </Button>
                  <Button variant="outline" className="flex-1 border-deep-teal text-deep-teal" disabled>
                    List Item for Sale
                  </Button>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Blockchain marketplace transactions coming with smart contract deployment
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </>
        )}

        {/* Getting Started Guide */}
        {!isConnected && (
          <Card className="lg:col-span-2 border-coral/20">
            <CardHeader>
              <CardTitle className="flex items-center text-deep-navy">
                <Info className="w-5 h-5 mr-2 text-coral" />
                Getting Started with Web3
              </CardTitle>
              <CardDescription>
                Follow these steps to unlock blockchain features in Coral8
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge className="bg-coral text-white">1</Badge>
                  <div>
                    <h4 className="font-medium text-deep-navy">Install MetaMask</h4>
                    <p className="text-sm text-moon-gray">
                      Download and install the MetaMask browser extension
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open('https://metamask.io/download/', '_blank')}
                    >
                      Download MetaMask
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Badge className="bg-coral text-white">2</Badge>
                  <div>
                    <h4 className="font-medium text-deep-navy">Connect Your Wallet</h4>
                    <p className="text-sm text-moon-gray">
                      Use the wallet connection card above to link your MetaMask wallet
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Badge className="bg-coral text-white">3</Badge>
                  <div>
                    <h4 className="font-medium text-deep-navy">Switch to Optimism</h4>
                    <p className="text-sm text-moon-gray">
                      Connect to the Optimism network for COW token interactions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Badge className="bg-coral text-white">4</Badge>
                  <div>
                    <h4 className="font-medium text-deep-navy">Start Using Web3 Features</h4>
                    <p className="text-sm text-moon-gray">
                      Access governance voting, token transfers, and marketplace transactions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}