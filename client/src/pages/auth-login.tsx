import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WaveAnimation } from "@/components/wave-animation";
import { ArrowRight, Wallet } from "lucide-react";

export default function AuthLogin() {
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ocean-teal/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-pearl-white px-2 text-moon-gray">Or connect wallet later</span>
            </div>
          </div>
          
          <Button 
            onClick={handleMetaMaskConnect}
            variant="outline" 
            className="w-full border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect MetaMask (Optional)
          </Button>
          
          <p className="text-xs text-center text-moon-gray mt-4">
            After signing in, you can optionally connect your MetaMask wallet for blockchain features
          </p>
        </CardContent>
      </Card>
    </div>
  );
}