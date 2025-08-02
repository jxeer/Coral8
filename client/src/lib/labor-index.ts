// Labor Index Table for calculating COW token rewards
export const LABOR_INDEX: Record<string, number> = {
  "Art Creation": 1.8,
  "Care Work": 2.0, // Higher multiplier to reflect value
  "Teaching": 1.9,
  "Community Building": 1.7,
  "Cultural Preservation": 2.1, // Highest multiplier for cultural work
  "Environmental Work": 1.6,
  "Healing & Wellness": 1.8,
  "Traditional Crafts": 1.9,
  "Storytelling": 1.7,
  "Food Preparation": 1.5,
};

export function getLaborMultiplier(laborType: string): number {
  return LABOR_INDEX[laborType] || 1.0; // Default multiplier if type not found
}

export function calculateCOWTokens(hoursWorked: number, multiplier: number): number {
  const baseRate = 11; // Base COW tokens per hour
  return Math.round((hoursWorked * baseRate * multiplier) * 100) / 100; // Round to 2 decimal places
}

export function formatCOWAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(1);
}

export function calculateDecayTime(lastActive: Date): {
  hoursLeft: number;
  isWarning: boolean;
  isCritical: boolean;
} {
  const now = new Date();
  const hoursInactive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
  const decayStartsAt = 24; // hours
  const criticalAt = 6; // hours until complete decay
  
  const hoursLeft = Math.max(0, decayStartsAt - hoursInactive);
  const isWarning = hoursLeft <= 12 && hoursLeft > 6;
  const isCritical = hoursLeft <= 6;
  
  return { hoursLeft, isWarning, isCritical };
}

export function formatTimeLeft(hours: number): string {
  if (hours <= 0) return "Decaying";
  if (hours < 1) return `${Math.floor(hours * 60)}m`;
  if (hours < 24) return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`;
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  return `${days}d ${remainingHours}h`;
}
