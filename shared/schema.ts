import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  authMethod: text("auth_method").notNull().default("replit"), // replit, wallet, both
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const laborLogs = pgTable("labor_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  laborType: text("labor_type").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }).notNull(),
  cowTokensEarned: decimal("cow_tokens_earned", { precision: 10, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).notNull(),
  proofHash: text("proof_hash"),
  attestationUrl: text("attestation_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenBalances = pgTable("token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cow1Balance: decimal("cow1_balance", { precision: 10, scale: 2 }).default("0"),
  cow2Balance: decimal("cow2_balance", { precision: 10, scale: 2 }).default("0"),
  cow3Balance: decimal("cow3_balance", { precision: 10, scale: 2 }).default("0"),
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

export const marketplaceItems = pgTable("marketplace_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
