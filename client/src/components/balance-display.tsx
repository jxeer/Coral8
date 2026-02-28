/**
 * Balance Display Component
 * Shows the user's COW token balances across three tiers: COW1, COW2, COW3.
 *
 * Token tiers:
 *   COW1 - Base Token: earned from standard labor logging
 *   COW2 - Growth Token: earned from cultural/governance participation
 *   COW3 - Power Token: earned from leadership and premium contributions
 *
 * Each token has a decay timer — tokens begin to lose value if the user
 * hasn't been active for a certain period. A progress bar shows how much
 * time is left before decay kicks in, and the bar turns red when critical.
 *
 * Renders two different layouts via the isMobile prop:
 *   - Desktop: large cards with 64px icons
 *   - Mobile: compact grid with 32px icons
 */

import { useAppContext } from "../contexts/app-context";
import { formatCOWAmount, calculateDecayTime, formatTimeLeft } from "../lib/labor-index";
import { Card } from "./ui/card";
import { Coins, TrendingUp, Zap } from "lucide-react";

export function BalanceDisplay({ isMobile = false }: { isMobile?: boolean }) {
  const { tokenBalance } = useAppContext();

  // Show a loading state while the balance is being fetched from the API
  if (!tokenBalance) {
    return (
      <Card className="p-6">
        <div className="text-center text-moon-gray">Loading balances...</div>
      </Card>
    );
  }

  /**
   * Decay time calculations for each token tier.
   *
   * COW1: based on actual lastActive timestamp from the database
   * COW2: simulated as if the user was last active 2 days ago
   * COW3: simulated as if the user was last active 18 hours ago
   *
   * TODO: Replace COW2/COW3 simulated offsets with real per-token activity
   *       timestamps once the backend tracks them individually.
   */
  const cow1Decay = calculateDecayTime(new Date(tokenBalance.lastActive || Date.now()));
  const cow2Decay = calculateDecayTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
  const cow3Decay = calculateDecayTime(new Date(Date.now() - 18 * 60 * 60 * 1000));

  // Build a unified array so both layouts can share the same render logic
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
      // Switch to red bar when decay is in the critical zone
      color: cow3Decay.isCritical ? "bg-red-400" : "bg-seafoam",
      icon: Zap,
      description: "Power Token"
    }
  ];

  // ── Mobile layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-2xl p-6 text-pearl-white">
        <h3 className="text-lg font-semibold mb-4">My COW Balance</h3>
        <div className="grid grid-cols-3 gap-4">
          {balances.map((balance) => {
            const Icon = balance.icon;
            return (
              <div key={balance.type} className="text-center">
                <div className="bg-pearl-white/20 rounded-xl p-4">
                  <div className="w-8 h-8 bg-pearl-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-pearl-white" />
                  </div>

                  {/* Formatted token balance, e.g. "1.2k" for large amounts */}
                  <p className="text-2xl font-bold">{formatCOWAmount(balance.amount || "0")}</p>
                  <p className="text-sm opacity-90">{balance.type}</p>
                  <p className="text-xs opacity-75 mb-2">{balance.description}</p>

                  {/* Decay progress bar — width = (hoursLeft / 24) clamped to min 10% */}
                  <div className="mt-2 bg-pearl-white/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${balance.color}`}
                      style={{ width: `${Math.max(10, (balance.decay.hoursLeft / 24) * 100)}%` }}
                    ></div>
                  </div>

                  {/* Show "Critical!" warning text when decay is imminent */}
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

  // ── Desktop layout ───────────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-2xl p-8 text-pearl-white">
      <h3 className="text-2xl font-bold mb-6">My COW Token Balances</h3>
      <div className="grid grid-cols-3 gap-8">
        {balances.map((balance) => {
          const Icon = balance.icon;
          return (
            <div key={balance.type} className="text-center">
              <div className="bg-pearl-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="w-16 h-16 bg-pearl-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-pearl-white" />
                </div>

                {/* Formatted token balance */}
                <p className="text-3xl font-bold mb-2">{formatCOWAmount(balance.amount || "0")}</p>
                <p className="text-lg opacity-90 mb-2">{balance.type}</p>
                <p className="text-sm opacity-75 mb-4">{balance.description}</p>

                {/* Decay progress bar — fills left-to-right based on hours remaining */}
                <div className="bg-pearl-white/30 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${balance.color}`}
                    style={{ width: `${Math.max(10, (balance.decay.hoursLeft / 24) * 100)}%` }}
                  ></div>
                </div>

                {/* Time remaining label or critical warning */}
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
