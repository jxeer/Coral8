import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Wallet, Waves, CheckCircle } from "lucide-react";
import { useAppContext } from "../contexts/app-context";

export function WalletConnectionButton() {
  const { walletAddress, setWalletAddress } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWaves, setShowWaves] = useState(false);

  const handleConnect = async () => {
    if (walletAddress) {
      // Disconnect wallet
      setWalletAddress("");
      return;
    }

    setIsConnecting(true);
    setShowWaves(true);

    try {
      // Simulate wallet connection with Web3
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a sample wallet address
      const sampleWallet = "0x" + Math.random().toString(16).substr(2, 40);
      setWalletAddress(sampleWallet);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
      setTimeout(() => setShowWaves(false), 1000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {/* Animated wave background when connecting */}
      {showWaves && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-ocean-blue via-ocean-teal to-seafoam opacity-20"
            animate={{
              x: ["-100%", "100%", "-100%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-seafoam via-ocean-teal to-ocean-blue opacity-30"
            animate={{
              x: ["100%", "-100%", "100%"],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.5,
            }}
          />
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isConnecting ? { 
          boxShadow: [
            "0 0 0 0 rgba(192, 132, 252, 0.4)",
            "0 0 0 10px rgba(192, 132, 252, 0)",
            "0 0 0 0 rgba(192, 132, 252, 0.4)"
          ]
        } : {}}
        transition={isConnecting ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`
            relative overflow-hidden px-6 py-3 min-w-[200px]
            ${walletAddress 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-ocean-blue to-ocean-teal hover:from-ocean-teal hover:to-seafoam'
            }
            text-pearl-white font-medium rounded-xl shadow-lg
            transition-all duration-300 ease-in-out
            ${isConnecting ? 'cursor-not-allowed' : 'hover:shadow-xl'}
          `}
        >
          {/* Wave animation overlay */}
          {isConnecting && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          )}

          <div className="relative flex items-center space-x-3">
            {isConnecting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Waves className="w-5 h-5" />
                </motion.div>
                <span>Connecting Waves...</span>
              </>
            ) : walletAddress ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{formatAddress(walletAddress)}</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </div>

          {/* Ripple effect on click */}
          {isConnecting && (
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-xl"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Connection status indicator */}
      {walletAddress && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            Connected to Optimism Sepolia
          </div>
        </motion.div>
      )}
    </div>
  );
}