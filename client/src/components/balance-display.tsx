/**
 * Balance Display Component
 * Shows user's COW token balances across three token tiers (COW1, COW2, COW3)
 * Features decay mechanism visualization with time-based warning and critical states
 * Provides both mobile and desktop layouts with oceanic gradient styling
 * Core to Coral8's multi-tier token economics system
 */

import { useAppContext } from "../contexts/app-context";
import { formatCOWAmount, calculateDecayTime, formatTimeLeft } from "../lib/labor-index";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Coins, TrendingUp, Zap } from "lucide-react";

export function BalanceDisplay({ isMobile = false }: { isMobile?: boolean }) {
  const { tokenBalance } = useAppContext();

  if (!tokenBalance) {
    return (
      <Card className="p-6">
        <div className="text-center text-moon-gray">Loading balances...</div>
      </Card>
    );
  }

  const cow1Decay = calculateDecayTime(new Date(tokenBalance.lastActive || Date.now()));
  const cow2Decay = calculateDecayTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
  const cow3Decay = calculateDecayTime(new Date(Date.now() - 18 * 60 * 60 * 1000));

  const balances = [
    {
      type: "COW1",
      amount: tokenBalance.cow1Balance,
      decay: cow1Decay,
      color: "bg-seafoam",
      icon: Coins,
      description: "Base Token"
    },
    {
      type: "COW2", 
      amount: tokenBalance.cow2Balance,
      decay: cow2Decay,
      color: "bg-seafoam",
      icon: TrendingUp,
      description: "Growth Token"
    },
    {
      type: "COW3",
      amount: tokenBalance.cow3Balance,
      decay: cow3Decay,
      color: cow3Decay.isCritical ? "bg-red-400" : "bg-seafoam",
      icon: Zap,
      description: "Power Token"
    }
  ];

  if (isMobile) {
    return (
      <div className="bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-2xl p-6 text-pearl-white">
        <h3 className="text-lg font-semibold mb-4">My COW Balance</h3>
        <div className="grid grid-cols-3 gap-4">
          {balances.map((balance, index) => {
            const Icon = balance.icon;
            return (
              <div key={balance.type} className="text-center">
                <div className="bg-pearl-white/20 rounded-xl p-4">
                  <div className="w-8 h-8 bg-pearl-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-pearl-white" />
                  </div>
                  <p className="text-2xl font-bold">{formatCOWAmount(balance.amount || "0")}</p>
                  <p className="text-sm opacity-90">{balance.type}</p>
                  <p className="text-xs opacity-75 mb-2">{balance.description}</p>
                  <div className="mt-2 bg-pearl-white/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${balance.color}`}
                      style={{ width: `${Math.max(10, (balance.decay.hoursLeft / 24) * 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 opacity-75 ${balance.decay.isCritical ? 'text-red-200' : ''}`}>
                    {balance.decay.isCritical ? 'Critical!' : formatTimeLeft(balance.decay.hoursLeft)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-2xl p-8 text-pearl-white">
      <h3 className="text-2xl font-bold mb-6">My COW Token Balances</h3>
      <div className="grid grid-cols-3 gap-8">
        {balances.map((balance, index) => {
          const Icon = balance.icon;
          return (
            <div key={balance.type} className="text-center">
              <div className="bg-pearl-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="w-16 h-16 bg-pearl-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-pearl-white" />
                </div>
                <p className="text-3xl font-bold mb-2">{formatCOWAmount(balance.amount || "0")}</p>
                <p className="text-lg opacity-90 mb-2">{balance.type}</p>
                <p className="text-sm opacity-75 mb-4">{balance.description}</p>
                <div className="bg-pearl-white/30 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${balance.color}`}
                    style={{ width: `${Math.max(10, (balance.decay.hoursLeft / 24) * 100)}%` }}
                  ></div>
                </div>
                <p className={`text-sm opacity-75 ${balance.decay.isCritical ? 'text-red-200' : ''}`}>
                  {balance.decay.isCritical ? 'Critical!' : `${formatTimeLeft(balance.decay.hoursLeft)} left`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
