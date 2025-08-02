/**
 * Coral8 Labor Index - Cultural Value Recognition System
 * 
 * This module implements the core economic philosophy of Coral8 by providing
 * multiplier-based token rewards that recognize the true value of cultural work,
 * ancestral wisdom, and community-essential labor that has been historically
 * undervalued in traditional economic systems.
 * 
 * Cultural Philosophy:
 * The Labor Index directly challenges Western capitalist frameworks by explicitly
 * valuing care work, cultural preservation, and community organizing. These forms
 * of labor are essential for community wellbeing but have been systematically
 * devalued or unpaid in dominant economic systems.
 * 
 * Labor Value Framework:
 * - Cultural Preservation (2.1x): Highest value for ancestral knowledge, language
 * - Care Work (2.0x): Essential community support, healing, childcare
 * - Teaching (1.9x): Knowledge transmission, mentorship, skill sharing
 * - Traditional Crafts (1.9x): Ancestral techniques, cultural expressions
 * - Arts & Healing (1.8x): Creative expressions, wellness practices
 * - Community Building (1.7x): Organizing, events, collective action
 * - Storytelling (1.7x): Oral traditions, narrative preservation
 * - Environmental Work (1.6x): Land stewardship, sustainability
 * - Food Preparation (1.5x): Traditional food systems, nourishment
 * - Base Labor (1.0x): General community support and assistance
 * 
 * Economic Formula:
 * COW Tokens Earned = Hours Worked × 11 (sacred base rate) × Cultural Multiplier
 * 
 * Sacred Base Rate:
 * The number 11 represents balance and transition in many indigenous traditions,
 * symbolizing the bridge between material and spiritual realms, making it
 * appropriate for valuing cultural labor.
 */

// Labor Index Table: Multipliers for calculating COW token rewards
// Higher multipliers reflect cultural and community value of different labor types
export const LABOR_INDEX: Record<string, number> = {
  "Art Creation": 1.8,
  "Care Work": 2.0, // Higher multiplier to reflect traditionally undervalued work
  "Teaching": 1.9,
  "Community Building": 1.7,
  "Cultural Preservation": 2.1, // Highest multiplier - core to Coral8 mission
  "Environmental Work": 1.6,
  "Healing & Wellness": 1.8,
  "Traditional Crafts": 1.9,
  "Storytelling": 1.7,
  "Food Preparation": 1.5,
};

/**
 * Retrieves the labor multiplier for a specific type of work
 * @param laborType - The type of labor being performed
 * @returns Multiplier value, defaulting to 1.0 for unrecognized types
 */
export function getLaborMultiplier(laborType: string): number {
  return LABOR_INDEX[laborType] || 1.0; // Default multiplier if type not found
}

/**
 * Calculates COW tokens earned based on hours worked and labor type multiplier
 * Uses base rate of 11 COW tokens per hour (honoring cultural significance)
 * @param hoursWorked - Number of hours of labor performed
 * @param multiplier - Labor type multiplier from LABOR_INDEX
 * @returns Total COW tokens earned, rounded to 2 decimal places
 */
export function calculateCOWTokens(hoursWorked: number, multiplier: number): number {
  const baseRate = 11; // Base COW tokens per hour (culturally significant number)
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
