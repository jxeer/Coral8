import { 
  type User, type InsertUser,
  type LaborLog, type InsertLaborLog,
  type TokenBalance, type InsertTokenBalance,
  type GovernanceProposal, type InsertGovernanceProposal,
  type Vote, type InsertVote,
  type MarketplaceItem, type InsertMarketplaceItem,
  type UserStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private laborLogs: Map<string, LaborLog>;
  private tokenBalances: Map<string, TokenBalance>;
  private governanceProposals: Map<string, GovernanceProposal>;
  private votes: Map<string, Vote>;
  private marketplaceItems: Map<string, MarketplaceItem>;
  private userStats: Map<string, UserStats>;

  constructor() {
    this.users = new Map();
    this.laborLogs = new Map();
    this.tokenBalances = new Map();
    this.governanceProposals = new Map();
    this.votes = new Map();
    this.marketplaceItems = new Map();
    this.userStats = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a default user
    const defaultUser: User = {
      id: "default-user",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      username: "ocean_guardian",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default token balance
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

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
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
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

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

  async getUserLaborLogs(userId: string): Promise<LaborLog[]> {
    return Array.from(this.laborLogs.values()).filter(log => log.userId === userId);
  }

  async getTokenBalance(userId: string): Promise<TokenBalance | undefined> {
    return this.tokenBalances.get(userId);
  }

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

  async updateTokenBalance(userId: string, updates: Partial<TokenBalance>): Promise<TokenBalance> {
    const existing = this.tokenBalances.get(userId);
    if (!existing) {
      throw new Error("Token balance not found");
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.tokenBalances.set(userId, updated);
    return updated;
  }

  async getActiveProposals(): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values()).filter(
      proposal => proposal.status === "active" || proposal.status === "voting"
    );
  }

  async getProposal(id: string): Promise<GovernanceProposal | undefined> {
    return this.governanceProposals.get(id);
  }

  async createProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const id = randomUUID();
    const governanceProposal: GovernanceProposal = { 
      ...proposal, 
      id,
      votesYes: 0,
      votesNo: 0,
      createdAt: new Date()
    };
    this.governanceProposals.set(id, governanceProposal);
    return governanceProposal;
  }

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

  async getUserVote(userId: string, proposalId: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.proposalId === proposalId
    );
  }

  async updateProposalVotes(proposalId: string, votesYes: number, votesNo: number): Promise<void> {
    const proposal = this.governanceProposals.get(proposalId);
    if (proposal) {
      proposal.votesYes = votesYes;
      proposal.votesNo = votesNo;
      this.governanceProposals.set(proposalId, proposal);
    }
  }

  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values()).filter(item => item.isActive);
  }

  async getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
    return this.marketplaceItems.get(id);
  }

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
}

export const storage = new MemStorage();
