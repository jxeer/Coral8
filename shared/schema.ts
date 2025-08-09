/**
 * Coral8 Database Schema and Type Definitions
 * 
 * This file defines the complete database schema for the Coral8 off-chain interface,
 * serving as the single source of truth for all data structures and types.
 * 
 * Core Business Logic:
 * - Cultural labor tracking with value-based multiplier system
 * - Three-tier COW token economics (COW1: liquid, COW2: staked, COW3: governance)
 * - Community-driven governance with proposal and voting mechanisms
 * - Marketplace for cultural goods and services
 * - Comprehensive user analytics and engagement metrics
 * 
 * Technical Architecture:
 * - PostgreSQL database with Drizzle ORM for type safety
 * - Zod validation schemas for runtime type checking
 * - TypeScript types inferred from database schema
 * - Session management for Replit OAuth integration
 * - Flexible authentication supporting multiple methods
 * 
 * Design Principles:
 * - Cultural value recognition through labor multipliers
 * - Economic sustainability via token decay mechanisms
 * - Community governance with transparent voting
 * - Mobile-first data structures for responsive UX
 * - Privacy-conscious user data handling
 * 
 * Key Tables:
 * - users: Authentication and profile management
 * - laborLogs: Cultural work tracking and token calculations
 * - tokenBalances: Multi-tier COW token system
 * - governanceProposals: Community decision-making
 * - votes: Democratic participation tracking
 * - marketplaceItems: Cultural goods marketplace
 * - userStats: Comprehensive engagement analytics
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Sessions Table - Replit Authentication Required
 * 
 * Stores user session data for authentication persistence.
 * This table is mandatory for Replit Auth integration - DO NOT DROP.
 * 
 * Fields:
 * - sid: Session identifier (primary key)
 * - sess: Session data as JSON object
 * - expire: Session expiration timestamp for cleanup
 * 
 * Indexed on expire field for efficient session cleanup queries.
 */
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

/**
 * Users Table - Core Identity Management
 * 
 * Central user table supporting multiple authentication methods.
 * This table is mandatory for Replit Auth integration - DO NOT DROP.
 * 
 * Authentication Methods Supported:
 * - "replit": OAuth via Replit (primary)
 * - "wallet": Web3 wallet connection (MetaMask, etc.)
 * - "password": Traditional username/password
 * - "both": Multiple methods linked to same account
 * 
 * Cultural Focus Features:
 * - Bio field for cultural background and interests
 * - Profile image for community recognition
 * - Verification status for trust building
 * 
 * Privacy Considerations:
 * - Email verification optional (some auth methods don't require email)
 * - Wallet address unique but optional
 * - All personal fields nullable for flexibility
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  googleId: varchar("google_id").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  walletAddress: varchar("wallet_address").unique(),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash"),
  bio: text("bio"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isWalletVerified: boolean("is_wallet_verified").default(false),
  lastLogin: timestamp("last_login"),
  authMethod: text("auth_method").notNull().default("google"), // google, wallet, password, both
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Labor Logs Table - Cultural Work Tracking
 * 
 * Records all cultural labor activities with detailed token calculations.
 * Core feature of Coral8's value recognition system for ancestral wisdom
 * and contemporary cultural work.
 * 
 * Labor Types with Multipliers:
 * - Care Work: 2.0x (childcare, elder care, community support)
 * - Cultural Preservation: 2.1x (language, traditions, storytelling)
 * - Teaching: 1.9x (knowledge sharing, mentorship)
 * - Arts & Crafts: 1.8x (creative cultural expressions)
 * - Community Organizing: 1.7x (collective action, events)
 * - Environmental Stewardship: 1.6x (land care, sustainability)
 * - Food & Agriculture: 1.5x (traditional food systems)
 * - Spiritual Practice: 1.4x (ceremonies, rituals)
 * - Base Labor: 1.0x (general community work)
 * 
 * Token Calculation Formula:
 * cowTokensEarned = hoursWorked × 11 (base rate) × multiplier
 * 
 * Proof System:
 * - proofHash: Cryptographic proof of work completion
 * - attestationUrl: External verification link (photos, videos, witnesses)
 */
export const laborLogs = pgTable("labor_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  laborType: text("labor_type").notNull(),
  hoursWorked: text("hours_worked").notNull(), // Stored as string for precision
  cowTokensEarned: text("cow_tokens_earned").notNull(), // Calculated value
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).notNull(),
  proofHash: text("proof_hash"),
  attestationUrl: text("attestation_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Token Balances Table - Three-Tier COW Token System
 * 
 * Manages the multi-tier COW token ecosystem that powers Coral8's
 * cultural economy. Each token type serves different purposes in
 * the community governance and economic system.
 * 
 * Token Types:
 * - COW1 (Liquid): Primary currency for marketplace transactions
 *   * Earned through labor logging
 *   * Used for buying/selling goods and services
 *   * Subject to decay if user inactive (sustainability mechanism)
 *   * Most liquid and transferable
 * 
 * - COW2 (Staked): Governance participation tokens
 *   * Converted from COW1 through staking
 *   * Required for voting on community proposals
 *   * Earns additional rewards for active governance
 *   * Locked for minimum periods to prevent gaming
 * 
 * - COW3 (Governance): Advanced community leadership tokens
 *   * Earned through consistent community contributions
 *   * Required for creating new proposals
 *   * Grants access to advanced features
 *   * Represents established community standing
 * 
 * Decay Mechanism:
 * - 1% decay per hour after 24 hours of inactivity
 * - Encourages active participation and engagement
 * - Prevents token hoarding and speculation
 * - Maintains economic balance and sustainability
 * 
 * Activity Tracking:
 * - lastActive: Timestamp of most recent user action
 * - decayWarningTime: When to warn user about impending decay
 * - Used for calculating token preservation requirements
 */
export const tokenBalances = pgTable("token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cow1Balance: text("cow1_balance").default("0"), // Stored as string for precision
  cow2Balance: text("cow2_balance").default("0"), // Governance staked tokens
  cow3Balance: text("cow3_balance").default("0"), // Leadership tokens
  lastActive: timestamp("last_active").defaultNow(),
  decayWarningTime: timestamp("decay_warning_time"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const governanceProposals = pgTable("governance_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, voting, passed, rejected
  votesYes: integer("votes_yes").default(0),
  votesNo: integer("votes_no").default(0),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  proposalId: varchar("proposal_id").notNull().references(() => governanceProposals.id),
  vote: boolean("vote").notNull(), // true for yes, false for no
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Marketplace Items Table - Cultural Economy Platform
 * 
 * Enables community members to trade goods and services using COW tokens,
 * creating a circular economy that values cultural products and traditional
 * knowledge while supporting local artisans and service providers.
 * 
 * Marketplace Philosophy:
 * - Cultural goods prioritized: traditional crafts, handmade items, cultural foods
 * - Service economy: teaching, healing, consultation, cultural guidance
 * - Community focus: local production and consumption over mass market
 * - Fair pricing: COW token system ensures labor value recognition
 * - Sustainability: encouraging reuse, repair, and local exchange
 * 
 * Item Categories:
 * - Traditional Crafts: pottery, textiles, jewelry, woodwork
 * - Cultural Foods: traditional recipes, preserved foods, specialty ingredients
 * - Healing Services: herbalism, energy work, therapeutic massage
 * - Educational Services: language lessons, skill workshops, cultural mentoring
 * - Art & Expression: paintings, music, storytelling, performance
 * - Tools & Equipment: traditional tools, musical instruments, ceremonial items
 * 
 * Pricing in COW Tokens:
 * - Encourages local circulation of community currency
 * - Reflects true labor value through token economics
 * - Supports creators and service providers directly
 * - Builds economic resilience within the community
 * 
 * Trust & Safety:
 * - Seller verification through community reputation
 * - Photo documentation for physical goods
 * - Community feedback and rating systems
 * - Dispute resolution through governance proposals
 */
export const marketplaceItems = pgTable("marketplace_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // Stored as string for COW token precision
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Token Transfers Table - Web3 Transaction Records
 * 
 * Tracks all COW token transfers between wallet addresses on the Optimism network.
 * Essential for maintaining transaction history and enabling blockchain integration.
 * Supports the three-tier token system with comprehensive transaction metadata.
 * 
 * Transfer Types:
 * - COW1: Base labor rewards and general transactions
 * - COW2: Enhanced cultural work premiums and governance stakes
 * - COW3: Leadership tokens and premium community functions
 * 
 * Blockchain Integration:
 * - Links to Optimism network transactions via transaction hash
 * - Tracks gas costs and block confirmations
 * - Maintains status for pending/confirmed/failed transactions
 * - Enables Web3 wallet integration and smart contract interactions
 */
export const tokenTransfers = pgTable("token_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id, { onDelete: 'set null' }),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  tokenType: text("token_type").notNull(), // 'COW1', 'COW2', 'COW3'
  amount: text("amount").notNull(), // Stored as string for precision
  transactionHash: text("transaction_hash"),
  blockNumber: integer("block_number"),
  gasUsed: text("gas_used"),
  gasPrice: text("gas_price"),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'failed'
  networkId: integer("network_id").default(10), // Optimism network ID
  timestamp: timestamp("timestamp").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  failureReason: text("failure_reason"),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  focusScore: integer("focus_score").default(0),
  tribeMembers: integer("tribe_members").default(0),
  emotionScore: decimal("emotion_score", { precision: 3, scale: 1 }).default("5.0"),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0"),
  attentionViews: integer("attention_views").default(0),
  scheduledHours: decimal("scheduled_hours", { precision: 5, scale: 2 }).default("0"),
  influenceScore: integer("influence_score").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLaborLogSchema = createInsertSchema(laborLogs).omit({
  id: true,
  userId: true,
  cowTokensEarned: true,
  multiplier: true,
  proofHash: true,
  createdAt: true,
});

export const insertTokenBalanceSchema = createInsertSchema(tokenBalances).omit({
  id: true,
  updatedAt: true,
});

export const insertGovernanceProposalSchema = createInsertSchema(governanceProposals).omit({
  id: true,
  votesYes: true,
  votesNo: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).omit({
  id: true,
  sellerId: true,
  createdAt: true,
});

export const insertTokenTransferSchema = createInsertSchema(tokenTransfers).omit({
  id: true,
  timestamp: true,
  confirmedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TokenTransfer = typeof tokenTransfers.$inferSelect;
export type InsertTokenTransfer = z.infer<typeof insertTokenTransferSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type InsertLaborLog = z.infer<typeof insertLaborLogSchema>;
export type LaborLog = typeof laborLogs.$inferSelect;

export type InsertTokenBalance = z.infer<typeof insertTokenBalanceSchema>;
export type TokenBalance = typeof tokenBalances.$inferSelect;

export type InsertGovernanceProposal = z.infer<typeof insertGovernanceProposalSchema>;
export type GovernanceProposal = typeof governanceProposals.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceItemSchema>;
export type MarketplaceItem = typeof marketplaceItems.$inferSelect;

export type UserStats = typeof userStats.$inferSelect;

// Note: sessions table already defined above for Replit Auth

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const walletLoginSchema = z.object({
  walletAddress: z.string().min(1),
  signature: z.string().min(1),
  message: z.string().min(1),
});

export type Session = typeof sessions.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type WalletLoginRequest = z.infer<typeof walletLoginSchema>;
