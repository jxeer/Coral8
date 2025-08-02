/**
 * Authentication Login Page Component
 * Provides sign-in interface for unauthenticated users
 * Features Google OAuth through Replit Auth integration
 * Uses oceanic Yemaya-inspired design with wave animations
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WaveAnimation } from "@/components/wave-animation";
import { ArrowRight } from "lucide-react";

export default function AuthLogin() {
  /**
   * Initiates OAuth flow by redirecting to Replit Auth endpoint
   * Triggers PKCE-secured authentication with Google provider
   */
  const handleReplitSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleMetaMaskConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      // Connect wallet for existing user after they're authenticated
      // This would be implemented as a secondary feature post-authentication
      console.log("Wallet connected:", walletAddress);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-navy via-ocean-blue to-seafoam flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-pearl-white/95 backdrop-blur-sm border-seafoam/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <WaveAnimation />
          </div>
          <CardTitle className="text-2xl font-bold text-deep-navy">Welcome to Coral8</CardTitle>
          <CardDescription className="text-ocean-blue">
            Sign in to join the Cowrie ecosystem and start earning COW tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleReplitSignIn}
            className="w-full bg-ocean-teal hover:bg-ocean-blue text-white"
          >
            Sign in with Google <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-xs text-center text-moon-gray mt-4">
            Join the Cowrie ecosystem to start logging labor and earning COW tokens
          </p>
        </CardContent>
      </Card>
    </div>
  );
}