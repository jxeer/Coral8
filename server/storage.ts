/**
 * Storage Layer Implementation
 * Provides data access abstractions for both in-memory and database storage
 * Implements the IStorage interface for consistent data operations across the application
 * Supports both development (MemStorage) and production (DatabaseStorage) environments
 */

import { 
  type User, type InsertUser, type UpsertUser,
  type LaborLog, type InsertLaborLog,
  type TokenBalance, type InsertTokenBalance,
  type GovernanceProposal, type InsertGovernanceProposal,
  type Vote, type InsertVote,
  type MarketplaceItem, type InsertMarketplaceItem,
  type UserStats,
  type TokenTransfer, type InsertTokenTransfer
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, laborLogs, tokenBalances, governanceProposals, votes, marketplaceItems, userStats, tokenTransfers } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

/**
 * Storage Interface
 * Defines all data access methods for consistent storage operations
 * Must be implemented by both in-memory and database storage classes
 * User methods marked as mandatory are required for Replit Auth integration
 */
export interface IStorage {
  // Users (Updated for Google OAuth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  getUserByEmail?(email: string): Promise<User | undefined>;
  getUserByGoogleId?(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleId?(userId: string, googleId: string): Promise<void>;
  updateUser?(userId: string, updates: Partial<User>): Promise<void>;

  // Labor Logs
  createLaborLog(laborLog: InsertLaborLog & { userId: string; cowTokensEarned: string; multiplier: string; proofHash?: string }): Promise<LaborLog>;
  getUserLaborLogs(userId: string): Promise<LaborLog[]>;

  // Token Balances
  getTokenBalance(userId: string): Promise<TokenBalance | undefined>;
  createTokenBalance(balance: InsertTokenBalance): Promise<TokenBalance>;
  updateTokenBalance(userId: string, updates: Partial<TokenBalance>): Promise<TokenBalance>;

  // Governance
  getActiveProposals(): Promise<GovernanceProposal[]>;
  getProposal(id: string): Promise<GovernanceProposal | undefined>;
  createProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal>;
  createVote(vote: InsertVote): Promise<Vote>;
  getUserVote(userId: string, proposalId: string): Promise<Vote | undefined>;
  updateProposalVotes(proposalId: string, votesYes: number, votesNo: number): Promise<void>;

  // Marketplace
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined>;
  createMarketplaceItem(item: InsertMarketplaceItem & { sellerId: string }): Promise<MarketplaceItem>;

  // User Stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(userId: string): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;

  // Token Transfers
  createTokenTransfer(transfer: InsertTokenTransfer): Promise<TokenTransfer>;
  getTokenTransfers(userId: string): Promise<TokenTransfer[]>;
  getTokenTransfersByAddress(address: string): Promise<TokenTransfer[]>;
  updateTokenTransferStatus(transferId: string, status: string, transactionHash?: string, blockNumber?: number): Promise<void>;
}

/**
 * MemStorage — In-Memory Storage Implementation
 *
 * Used during development when no database connection is available.
 * All data is stored in JavaScript Maps and is lost when the server restarts.
 *
 * The constructor seeds sample data (a default user, proposals, marketplace items)
 * so the UI looks populated immediately without needing any database records.
 *
 * Switch to DatabaseStorage for production (see bottom of this file).
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private laborLogs: Map<string, LaborLog>;
  private tokenBalances: Map<string, TokenBalance>;
  private governanceProposals: Map<string, GovernanceProposal>;
  private votes: Map<string, Vote>;
  private marketplaceItems: Map<string, MarketplaceItem>;
  private userStats: Map<string, UserStats>;
  private tokenTransfers: Map<string, TokenTransfer>;

  constructor() {
    this.users = new Map();
    this.laborLogs = new Map();
    this.tokenBalances = new Map();
    this.governanceProposals = new Map();
    this.votes = new Map();
    this.marketplaceItems = new Map();
    this.userStats = new Map();
    this.tokenTransfers = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a default user with all required fields
    const defaultUser: User = {
      id: "default-user",
      email: "demo@coral8.com",
      firstName: "Ocean",
      lastName: "Guardian",
      profileImageUrl: null,
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      username: "ocean_guardian",
      passwordHash: null,
      bio: "Demo user for Coral8 cultural labor platform",
      isEmailVerified: true,
      isWalletVerified: true,
      lastLogin: new Date(),
      authMethod: "replit",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default token balance with all required fields
    const defaultBalance: TokenBalance = {
      id: "default-balance",
      userId: defaultUser.id,
      cow1Balance: "125.7",
      cow2Balance: "89.3",
      cow3Balance: "42.1",
      lastActive: new Date(),
      decayWarningTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours
      updatedAt: new Date(),
    };
    this.tokenBalances.set(defaultUser.id, defaultBalance);

    // Create default user stats
    const defaultStats: UserStats = {
      id: "default-stats",
      userId: defaultUser.id,
      focusScore: 8,
      tribeMembers: 156,
      emotionScore: "8.2",
      monthlyEarnings: "1247",
      attentionViews: 2400,
      scheduledHours: "24.5",
      influenceScore: 892,
      updatedAt: new Date(),
    };
    this.userStats.set(defaultUser.id, defaultStats);

    // Sample governance proposals
    const proposal1: GovernanceProposal = {
      id: "proposal-1",
      title: "Increase Labor Index Multiplier for Care Work",
      description: "Proposal to increase the multiplier for care work from 1.5x to 2.0x COW tokens per hour to better reflect the value of this essential labor.",
      status: "active",
      votesYes: 180,
      votesNo: 54,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      createdAt: new Date(),
    };

    const proposal2: GovernanceProposal = {
      id: "proposal-2",
      title: "Community Treasury Allocation",
      description: "Allocate 10% of community treasury to fund educational programs and cultural preservation initiatives within our ecosystem.",
      status: "voting",
      votesYes: 97,
      votesNo: 59,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      createdAt: new Date(),
    };

    this.governanceProposals.set(proposal1.id, proposal1);
    this.governanceProposals.set(proposal2.id, proposal2);

    // Sample marketplace items
    const item1: MarketplaceItem = {
      id: "item-1",
      sellerId: defaultUser.id,
      title: "Handcrafted Ceramic Bowl",
      description: "Beautiful oceanic-inspired ceramic bowl crafted with traditional techniques.",
      price: "45",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: new Date(),
    };

    const item2: MarketplaceItem = {
      id: "item-2",
      sellerId: defaultUser.id,
      title: "Traditional Woven Textile",
      description: "Authentic hand-woven textile featuring ancestral patterns and oceanic motifs.",
      price: "120",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: new Date(),
    };

    this.marketplaceItems.set(item1.id, item1);
    this.marketplaceItems.set(item2.id, item2);
  }

  /**
   * Get user by ID
   * Required for Replit Auth integration
   */
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  /**
   * Upsert user (insert or update)
   * Required for Replit Auth integration - creates or updates user from OAuth claims
   */
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id || "");
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(updatedUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: userData.id || randomUUID(),
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        walletAddress: userData.walletAddress || null,
        username: userData.username || null,
        passwordHash: userData.passwordHash || null,
        bio: userData.bio || null,
        isEmailVerified: userData.isEmailVerified || false,
        isWalletVerified: userData.isWalletVerified || false,
        lastLogin: userData.lastLogin || null,
        authMethod: userData.authMethod || "replit",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  /**
   * Google OAuth Support Methods - MemStorage Implementation
   * 
   * In-memory implementation of Google OAuth methods for development.
   * Comments added for clarity and debugging support.
   */

  // Find user by email address (for Google OAuth account linking)
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  // Find user by Google ID (primary Google OAuth lookup)
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) return user;
    }
    return undefined;
  }

  // Link Google ID to existing user account
  async updateUserGoogleId(userId: string, googleId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.googleId = googleId;
      user.updatedAt = new Date();
      this.users.set(userId, user);
    }
  }

  // Update user profile with Google OAuth data
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
      this.users.set(userId, user);
    }
  }

  // ── Labor Logs ────────────────────────────────────────────────────────────

  /** Creates a new labor log entry with a generated UUID and current timestamp */
  async createLaborLog(laborLog: InsertLaborLog & { userId: string; cowTokensEarned: string; multiplier: string; proofHash?: string }): Promise<LaborLog> {
    const id = randomUUID();
    const log: LaborLog = { 
      ...laborLog, 
      id,
      createdAt: new Date()
    };
    this.laborLogs.set(id, log);
    return log;
  }

  /** Returns all labor logs belonging to a specific user, unordered */
  async getUserLaborLogs(userId: string): Promise<LaborLog[]> {
    return Array.from(this.laborLogs.values()).filter(log => log.userId === userId);
  }

  // ── Token Balances ─────────────────────────────────────────────────────────

  /**
   * Retrieves the token balance record for a user.
   * The map is keyed by userId (not the balance's own UUID) for O(1) lookup.
   */
  async getTokenBalance(userId: string): Promise<TokenBalance | undefined> {
    return this.tokenBalances.get(userId);
  }

  /** Creates a new token balance record, keyed by userId for fast retrieval */
  async createTokenBalance(balance: InsertTokenBalance): Promise<TokenBalance> {
    const id = randomUUID();
    const tokenBalance: TokenBalance = { 
      ...balance, 
      id,
      updatedAt: new Date()
    };
    this.tokenBalances.set(balance.userId, tokenBalance);
    return tokenBalance;
  }

  /** Merges partial updates into an existing balance; throws if no record found */
  async updateTokenBalance(userId: string, updates: Partial<TokenBalance>): Promise<TokenBalance> {
    const existing = this.tokenBalances.get(userId);
    if (!existing) {
      throw new Error("Token balance not found");
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.tokenBalances.set(userId, updated);
    return updated;
  }

  // ── Governance ─────────────────────────────────────────────────────────────

  /**
   * Returns proposals with status "active" or "voting".
   * Proposals in other states (passed, rejected) are excluded from the dashboard.
   */
  async getActiveProposals(): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values()).filter(
      proposal => proposal.status === "active" || proposal.status === "voting"
    );
  }

  /** Retrieves a single proposal by its ID */
  async getProposal(id: string): Promise<GovernanceProposal | undefined> {
    return this.governanceProposals.get(id);
  }

  /** Creates a new proposal; vote counts start at 0 regardless of insert data */
  async createProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const id = randomUUID();
    const governanceProposal: GovernanceProposal = { 
      ...proposal, 
      id,
      votesYes: 0,   // Always initialise to 0 — votes come in via createVote
      votesNo: 0,
      createdAt: new Date()
    };
    this.governanceProposals.set(id, governanceProposal);
    return governanceProposal;
  }

  /** Records a user's Yes/No vote; one record per user per proposal */
  async createVote(vote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const newVote: Vote = { 
      ...vote, 
      id,
      createdAt: new Date()
    };
    this.votes.set(id, newVote);
    return newVote;
  }

  /**
   * Checks whether a user has already voted on a specific proposal.
   * Used server-side to prevent duplicate votes.
   */
  async getUserVote(userId: string, proposalId: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.proposalId === proposalId
    );
  }

  /**
   * Updates the Yes/No vote tallies on a proposal after a new vote is cast.
   * Called after createVote to keep counts in sync.
   */
  async updateProposalVotes(proposalId: string, votesYes: number, votesNo: number): Promise<void> {
    const proposal = this.governanceProposals.get(proposalId);
    if (proposal) {
      proposal.votesYes = votesYes;
      proposal.votesNo = votesNo;
      this.governanceProposals.set(proposalId, proposal);
    }
  }

  // ── Marketplace ────────────────────────────────────────────────────────────

  /** Returns only active (non-deleted/non-sold) marketplace items */
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values()).filter(item => item.isActive);
  }

  /** Retrieves a single marketplace item by its ID regardless of active status */
  async getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
    return this.marketplaceItems.get(id);
  }

  /** Creates a new marketplace listing; isActive defaults to true in the schema */
  async createMarketplaceItem(item: InsertMarketplaceItem & { sellerId: string }): Promise<MarketplaceItem> {
    const id = randomUUID();
    const marketplaceItem: MarketplaceItem = { 
      ...item, 
      id,
      createdAt: new Date()
    };
    this.marketplaceItems.set(id, marketplaceItem);
    return marketplaceItem;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async createUserStats(userId: string): Promise<UserStats> {
    const id = randomUUID();
    const newStats: UserStats = {
      id,
      userId,
      focusScore: 0,
      tribeMembers: 0,
      emotionScore: "5.0",
      monthlyEarnings: "0",
      attentionViews: 0,
      scheduledHours: "0",
      influenceScore: 0,
      updatedAt: new Date(),
    };
    this.userStats.set(userId, newStats);
    return newStats;
  }

  async updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats> {
    const existing = this.userStats.get(userId);
    if (!existing) {
      const id = randomUUID();
      const newStats: UserStats = {
        id,
        userId,
        focusScore: 0,
        tribeMembers: 0,
        emotionScore: "5.0",
        monthlyEarnings: "0",
        attentionViews: 0,
        scheduledHours: "0",
        influenceScore: 0,
        updatedAt: new Date(),
        ...stats
      };
      this.userStats.set(userId, newStats);
      return newStats;
    }
    const updated = { ...existing, ...stats, updatedAt: new Date() };
    this.userStats.set(userId, updated);
    return updated;
  }

  // ── Token Transfers ────────────────────────────────────────────────────────

  /** Records a new token transfer in its initial "pending" state */
  async createTokenTransfer(transfer: InsertTokenTransfer): Promise<TokenTransfer> {
    const id = randomUUID();
    const tokenTransfer: TokenTransfer = {
      ...transfer,
      id,
      timestamp: new Date(),
      confirmedAt: null,   // Set when status transitions to "confirmed"
    };
    this.tokenTransfers.set(id, tokenTransfer);
    return tokenTransfer;
  }

  /** Returns all transfers initiated by a specific user ID */
  async getTokenTransfers(userId: string): Promise<TokenTransfer[]> {
    return Array.from(this.tokenTransfers.values()).filter(
      transfer => transfer.fromUserId === userId
    );
  }

  /**
   * Returns all transfers involving a wallet address as sender or receiver.
   * Used to show a full transaction history for a connected wallet.
   */
  async getTokenTransfersByAddress(address: string): Promise<TokenTransfer[]> {
    return Array.from(this.tokenTransfers.values()).filter(
      transfer => transfer.fromAddress === address || transfer.toAddress === address
    );
  }

  /**
   * Updates the status of a transfer after a blockchain confirmation or failure.
   * Optionally stores the on-chain transaction hash and block number.
   * Sets confirmedAt timestamp when the status moves to "confirmed".
   */
  async updateTokenTransferStatus(
    transferId: string, 
    status: string, 
    transactionHash?: string, 
    blockNumber?: number
  ): Promise<void> {
    const transfer = this.tokenTransfers.get(transferId);
    if (transfer) {
      transfer.status = status;
      if (transactionHash) transfer.transactionHash = transactionHash;
      if (blockNumber) transfer.blockNumber = blockNumber;
      if (status === 'confirmed') transfer.confirmedAt = new Date();
      this.tokenTransfers.set(transferId, transfer);
    }
  }
}

/**
 * DatabaseStorage — Production PostgreSQL Storage Implementation
 *
 * Uses Drizzle ORM to interact with the Neon serverless PostgreSQL database.
 * All data persists across server restarts, unlike MemStorage.
 *
 * This class is instantiated as the singleton `storage` export at the bottom
 * of this file and injected into all API route handlers via server/routes.ts.
 *
 * Key differences from MemStorage:
 *   - Uses db.select/insert/update queries instead of Map operations
 *   - Supports concurrent access safely (ACID transactions)
 *   - Orders results by createdAt/timestamp for consistent pagination
 *   - upsertUser uses onConflictDoUpdate for idempotent OAuth user creation
 */
export class DatabaseStorage implements IStorage {
  // ── Users ──────────────────────────────────────────────────────────────────

  /** Fetches a user by their primary key ID */
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user || undefined;
  }

  /**
   * Insert or update a user record in a single query.
   * Used by the Google OAuth flow: if the user already exists (same ID),
   * their profile fields are updated; otherwise a new row is inserted.
   * This prevents duplicate user records across multiple logins.
   */
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  /** Looks up a user by their connected wallet address (e.g. MetaMask) */
  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
    return user || undefined;
  }

  /** Creates a new user row from an insert payload */
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  /**
   * Google OAuth Support Methods - Database Implementation
   * 
   * These methods enable seamless Google OAuth integration with proper
   * database persistence. Comments added for maintenance clarity.
   */

  // Find user by email address (for Google OAuth account linking)
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user || undefined;
  }

  // Find user by Google ID (primary Google OAuth lookup)
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    return user || undefined;
  }

  // Link Google ID to existing user account
  async updateUserGoogleId(userId: string, googleId: string): Promise<void> {
    await db.update(users)
      .set({ googleId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Update user profile with Google OAuth data
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // ── Labor Logs ────────────────────────────────────────────────────────────

  /** Inserts a new labor log row; COW tokens and multiplier are pre-calculated by the route */
  async createLaborLog(laborLog: InsertLaborLog & { userId: string; cowTokensEarned: string; multiplier: string; proofHash?: string }): Promise<LaborLog> {
    const [newLog] = await db.insert(laborLogs).values(laborLog).returning();
    return newLog;
  }

  /** Returns all labor logs for a user, newest first */
  async getUserLaborLogs(userId: string): Promise<LaborLog[]> {
    return await db.select().from(laborLogs).where(eq(laborLogs.userId, userId)).orderBy(desc(laborLogs.createdAt));
  }

  // ── Token Balances ─────────────────────────────────────────────────────────

  /** Fetches the single token balance record for a user (one row per user) */
  async getTokenBalance(userId: string): Promise<TokenBalance | undefined> {
    const [balance] = await db.select().from(tokenBalances).where(eq(tokenBalances.userId, userId)).limit(1);
    return balance || undefined;
  }

  /** Creates a new token balance row for a user; called on first login if none exists */
  async createTokenBalance(balance: InsertTokenBalance): Promise<TokenBalance> {
    const [newBalance] = await db.insert(tokenBalances).values(balance).returning();
    return newBalance;
  }

  /** Merges partial updates (e.g. updated COW1 balance) into the user's balance row */
  async updateTokenBalance(userId: string, updates: Partial<TokenBalance>): Promise<TokenBalance> {
    const [updatedBalance] = await db.update(tokenBalances)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tokenBalances.userId, userId))
      .returning();
    return updatedBalance;
  }

  // ── Governance ─────────────────────────────────────────────────────────────

  /**
   * Returns all proposals ordered by creation date (newest first).
   * Unlike MemStorage, this does NOT filter by status — the API route
   * returns all proposals and the frontend filters if needed.
   */
  async getActiveProposals(): Promise<GovernanceProposal[]> {
    return await db.select().from(governanceProposals).orderBy(desc(governanceProposals.createdAt));
  }

  /** Fetches a single proposal by primary key */
  async getProposal(id: string): Promise<GovernanceProposal | undefined> {
    const [proposal] = await db.select().from(governanceProposals).where(eq(governanceProposals.id, id)).limit(1);
    return proposal || undefined;
  }

  /** Inserts a new governance proposal */
  async createProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const [newProposal] = await db.insert(governanceProposals).values(proposal).returning();
    return newProposal;
  }

  /** Records a user's vote (true = Yes, false = No) for a proposal */
  async createVote(vote: InsertVote): Promise<Vote> {
    const [newVote] = await db.insert(votes).values(vote).returning();
    return newVote;
  }

  /**
   * Checks if a user has already voted on a specific proposal.
   * Uses a compound WHERE on userId AND proposalId for the uniqueness check.
   */
  async getUserVote(userId: string, proposalId: string): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.proposalId, proposalId)))
      .limit(1);
    return vote || undefined;
  }

  /** Updates the cached Yes/No vote tallies on a proposal row */
  async updateProposalVotes(proposalId: string, votesYes: number, votesNo: number): Promise<void> {
    await db.update(governanceProposals)
      .set({ votesYes, votesNo })
      .where(eq(governanceProposals.id, proposalId));
  }

  // ── Marketplace ────────────────────────────────────────────────────────────

  /** Returns all marketplace items, newest first (isActive filter applied in route if needed) */
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await db.select().from(marketplaceItems).orderBy(desc(marketplaceItems.createdAt));
  }

  /** Fetches a single marketplace listing by ID */
  async getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
    const [item] = await db.select().from(marketplaceItems).where(eq(marketplaceItems.id, id)).limit(1);
    return item || undefined;
  }

  /** Creates a new marketplace listing linked to the seller's user ID */
  async createMarketplaceItem(item: InsertMarketplaceItem & { sellerId: string }): Promise<MarketplaceItem> {
    const [newItem] = await db.insert(marketplaceItems).values(item).returning();
    return newItem;
  }

  // ── User Stats ─────────────────────────────────────────────────────────────

  /** Fetches the stats record for a user (one row per user) */
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return stats || undefined;
  }

  /**
   * Creates a default stats record for a user who has none yet.
   * Called automatically by GET /api/stats on first login so the dashboard
   * always has something to render rather than staying in a loading state.
   */
  async createUserStats(userId: string): Promise<UserStats> {
    const [newStats] = await db.insert(userStats).values({
      userId,
      focusScore: 0,
      tribeMembers: 0,
      emotionScore: "5.0",
      monthlyEarnings: "0",
      attentionViews: 0,
      scheduledHours: "0",
      influenceScore: 0,
    }).returning();
    return newStats;
  }

  /** Merges partial updates into the user's stats row */
  async updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats> {
    const [updatedStats] = await db.update(userStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updatedStats;
  }

  // ── Token Transfers ────────────────────────────────────────────────────────

  /** Records a new COW token transfer; status starts as "pending" by default */
  async createTokenTransfer(transfer: InsertTokenTransfer): Promise<TokenTransfer> {
    const [newTransfer] = await db.insert(tokenTransfers).values(transfer).returning();
    return newTransfer;
  }

  /** Returns all transfers sent by a user, newest first */
  async getTokenTransfers(userId: string): Promise<TokenTransfer[]> {
    return await db.select().from(tokenTransfers)
      .where(eq(tokenTransfers.fromUserId, userId))
      .orderBy(desc(tokenTransfers.timestamp));
  }

  /**
   * Returns transfers where the given address appears as sender.
   * Note: currently only matches fromAddress; extend to toAddress if a
   * full bidirectional history is needed.
   */
  async getTokenTransfersByAddress(address: string): Promise<TokenTransfer[]> {
    return await db.select().from(tokenTransfers)
      .where(eq(tokenTransfers.fromAddress, address))
      .orderBy(desc(tokenTransfers.timestamp));
  }

  /**
   * Updates a transfer's status after a blockchain event.
   * Optionally stores the on-chain transaction hash and block number.
   * Sets confirmedAt when status becomes "confirmed".
   */
  async updateTokenTransferStatus(
    transferId: string, 
    status: string, 
    transactionHash?: string, 
    blockNumber?: number
  ): Promise<void> {
    const updateData: any = { status };
    if (transactionHash) updateData.transactionHash = transactionHash;
    if (blockNumber) updateData.blockNumber = blockNumber;
    if (status === 'confirmed') updateData.confirmedAt = new Date();

    await db.update(tokenTransfers)
      .set(updateData)
      .where(eq(tokenTransfers.id, transferId));
  }
}

// Singleton storage instance — imported by server/routes.ts for all API handlers
export const storage = new DatabaseStorage();
