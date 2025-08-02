/**
 * Dashboard Cards Component
 * Displays key metrics and statistics for authenticated users
 * Features culturally-rooted tracking including tribe members, emotion scoring, and COW earnings
 * Uses gradient designs inspired by oceanic themes and provides real-time progress indicators
 */

import { useAppContext } from "../contexts/app-context";
import { Card } from "./ui/card";
import { 
  Eye, Users, Heart, DollarSign, Sun, Clock, Star
} from "lucide-react";

export function DashboardCards() {
  const { userStats } = useAppContext();

  if (!userStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-moon-gray/20 rounded mb-2"></div>
            <div className="h-8 bg-moon-gray/20 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Focus Tracker",
      description: "Complete tasks, add expertise",
      value: userStats.focusScore,
      suffix: "tasks today",
      icon: Eye,
      gradient: "from-ocean-blue to-ocean-teal",
      badge: "+12%"
    },
    {
      title: "Tribe",
      description: "Invite members, track growth",
      value: userStats.tribeMembers,
      suffix: "community members",
      icon: Users,
      gradient: "from-seafoam to-ocean-teal",
      badge: "Active"
    },
    {
      title: "Emotion Tracker",
      description: "Monitor well-being",
      value: parseFloat(userStats.emotionScore || "5.0"),
      suffix: "average mood",
      icon: Heart,
      gradient: "from-ocean-teal to-deep-navy",
      badge: "Peaceful"
    },
    {
      title: "Money",
      description: "Monthly COW earned",
      value: Math.floor(parseFloat(userStats.monthlyEarnings || "0")),
      suffix: "COW this month",
      icon: DollarSign,
      gradient: "from-ocean-blue to-ocean-teal",
      badge: "+25%",
      isHighlight: true
    },
    {
      title: "Attention",
      description: "Visibility and metrics",
      value: `${((userStats.attentionViews || 0) / 1000).toFixed(1)}k`,
      suffix: "profile views",
      icon: Sun,
      gradient: "from-deep-navy to-ocean-blue",
      badge: "Trending"
    },
    {
      title: "Time",
      description: "Scheduled events, COW earning",
      value: parseFloat(userStats.scheduledHours || "0"),
      suffix: "hours this week",
      icon: Clock,
      gradient: "from-seafoam to-ocean-blue",
      badge: "On Track"
    },
    {
      title: "Influence",
      description: "Reputation score",
      value: userStats.influenceScore,
      suffix: "influence points",
      icon: Star,
      gradient: "from-ocean-blue to-deep-navy",
      badge: "Rising"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`p-6 border border-ocean-teal/20 hover:shadow-lg transition-all transform hover:scale-[1.02] ${
              card.isHighlight ? `bg-gradient-to-br ${card.gradient} text-pearl-white` : 'bg-pearl-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                card.isHighlight 
                  ? 'bg-pearl-white/20' 
                  : `bg-gradient-to-br ${card.gradient}`
              }`}>
                <Icon className={`w-6 h-6 ${
                  card.isHighlight ? 'text-pearl-white' : 'text-pearl-white'
                }`} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                card.isHighlight
                  ? 'bg-pearl-white/20 text-pearl-white'
                  : getBadgeStyles(card.badge)
              }`}>
                {card.badge}
              </span>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              card.isHighlight ? 'text-pearl-white' : 'text-deep-navy'
            }`}>
              {card.title}
            </h3>
            <p className={`text-sm mb-4 ${
              card.isHighlight ? 'opacity-90' : 'text-moon-gray'
            }`}>
              {card.description}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${
                card.isHighlight ? 'text-pearl-white' : 'text-deep-navy'
              }`}>
                {card.value}
              </span>
              <span className={`text-sm ${
                card.isHighlight ? 'opacity-75' : 'text-moon-gray'
              }`}>
                {card.suffix}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function getBadgeStyles(badge: string) {
  switch (badge) {
    case '+12%':
    case '+25%':
      return 'bg-seafoam/20 text-ocean-blue';
    case 'Active':
      return 'bg-green-100 text-green-600';
    case 'Peaceful':
      return 'bg-pink-100 text-pink-600';
    case 'Trending':
      return 'bg-yellow-100 text-yellow-600';
    case 'On Track':
      return 'bg-blue-100 text-blue-600';
    case 'Rising':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-moon-gray/20 text-moon-gray';
  }
}
