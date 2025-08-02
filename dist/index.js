// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  laborLogs;
  tokenBalances;
  governanceProposals;
  votes;
  marketplaceItems;
  userStats;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.laborLogs = /* @__PURE__ */ new Map();
    this.tokenBalances = /* @__PURE__ */ new Map();
    this.governanceProposals = /* @__PURE__ */ new Map();
    this.votes = /* @__PURE__ */ new Map();
    this.marketplaceItems = /* @__PURE__ */ new Map();
    this.userStats = /* @__PURE__ */ new Map();
    this.initializeSampleData();
  }
  initializeSampleData() {
    const defaultUser = {
      id: "default-user",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      username: "ocean_guardian",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
    const defaultBalance = {
      id: "default-balance",
      userId: defaultUser.id,
      cow1Balance: "125.7",
      cow2Balance: "89.3",
      cow3Balance: "42.1",
      lastActive: /* @__PURE__ */ new Date(),
      decayWarningTime: new Date(Date.now() + 18 * 60 * 60 * 1e3),
      // 18 hours
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tokenBalances.set(defaultUser.id, defaultBalance);
    const defaultStats = {
      id: "default-stats",
      userId: defaultUser.id,
      focusScore: 8,
      tribeMembers: 156,
      emotionScore: "8.2",
      monthlyEarnings: "1247",
      attentionViews: 2400,
      scheduledHours: "24.5",
      influenceScore: 892,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.userStats.set(defaultUser.id, defaultStats);
    const proposal1 = {
      id: "proposal-1",
      title: "Increase Labor Index Multiplier for Care Work",
      description: "Proposal to increase the multiplier for care work from 1.5x to 2.0x COW tokens per hour to better reflect the value of this essential labor.",
      status: "active",
      votesYes: 180,
      votesNo: 54,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3),
      // 2 days
      createdAt: /* @__PURE__ */ new Date()
    };
    const proposal2 = {
      id: "proposal-2",
      title: "Community Treasury Allocation",
      description: "Allocate 10% of community treasury to fund educational programs and cultural preservation initiatives within our ecosystem.",
      status: "voting",
      votesYes: 97,
      votesNo: 59,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3),
      // 5 days
      createdAt: /* @__PURE__ */ new Date()
    };
    this.governanceProposals.set(proposal1.id, proposal1);
    this.governanceProposals.set(proposal2.id, proposal2);
    const item1 = {
      id: "item-1",
      sellerId: defaultUser.id,
      title: "Handcrafted Ceramic Bowl",
      description: "Beautiful oceanic-inspired ceramic bowl crafted with traditional techniques.",
      price: "45",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    const item2 = {
      id: "item-2",
      sellerId: defaultUser.id,
      title: "Traditional Woven Textile",
      description: "Authentic hand-woven textile featuring ancestral patterns and oceanic motifs.",
      price: "120",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.marketplaceItems.set(item1.id, item1);
    this.marketplaceItems.set(item2.id, item2);
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByWallet(walletAddress) {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async createLaborLog(laborLog) {
    const id = randomUUID();
    const log2 = {
      ...laborLog,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.laborLogs.set(id, log2);
    return log2;
  }
  async getUserLaborLogs(userId) {
    return Array.from(this.laborLogs.values()).filter((log2) => log2.userId === userId);
  }
  async getTokenBalance(userId) {
    return this.tokenBalances.get(userId);
  }
  async createTokenBalance(balance) {
    const id = randomUUID();
    const tokenBalance = {
      ...balance,
      id,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tokenBalances.set(balance.userId, tokenBalance);
    return tokenBalance;
  }
  async updateTokenBalance(userId, updates) {
    const existing = this.tokenBalances.get(userId);
    if (!existing) {
      throw new Error("Token balance not found");
    }
    const updated = { ...existing, ...updates, updatedAt: /* @__PURE__ */ new Date() };
    this.tokenBalances.set(userId, updated);
    return updated;
  }
  async getActiveProposals() {
    return Array.from(this.governanceProposals.values()).filter(
      (proposal) => proposal.status === "active" || proposal.status === "voting"
    );
  }
  async getProposal(id) {
    return this.governanceProposals.get(id);
  }
  async createProposal(proposal) {
    const id = randomUUID();
    const governanceProposal = {
      ...proposal,
      id,
      votesYes: 0,
      votesNo: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.governanceProposals.set(id, governanceProposal);
    return governanceProposal;
  }
  async createVote(vote) {
    const id = randomUUID();
    const newVote = {
      ...vote,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.votes.set(id, newVote);
    return newVote;
  }
  async getUserVote(userId, proposalId) {
    return Array.from(this.votes.values()).find(
      (vote) => vote.userId === userId && vote.proposalId === proposalId
    );
  }
  async updateProposalVotes(proposalId, votesYes, votesNo) {
    const proposal = this.governanceProposals.get(proposalId);
    if (proposal) {
      proposal.votesYes = votesYes;
      proposal.votesNo = votesNo;
      this.governanceProposals.set(proposalId, proposal);
    }
  }
  async getMarketplaceItems() {
    return Array.from(this.marketplaceItems.values()).filter((item) => item.isActive);
  }
  async getMarketplaceItem(id) {
    return this.marketplaceItems.get(id);
  }
  async createMarketplaceItem(item) {
    const id = randomUUID();
    const marketplaceItem = {
      ...item,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.marketplaceItems.set(id, marketplaceItem);
    return marketplaceItem;
  }
  async getUserStats(userId) {
    return this.userStats.get(userId);
  }
  async updateUserStats(userId, stats) {
    const existing = this.userStats.get(userId);
    if (!existing) {
      const id = randomUUID();
      const newStats = {
        id,
        userId,
        focusScore: 0,
        tribeMembers: 0,
        emotionScore: "5.0",
        monthlyEarnings: "0",
        attentionViews: 0,
        scheduledHours: "0",
        influenceScore: 0,
        updatedAt: /* @__PURE__ */ new Date(),
        ...stats
      };
      this.userStats.set(userId, newStats);
      return newStats;
    }
    const updated = { ...existing, ...stats, updatedAt: /* @__PURE__ */ new Date() };
    this.userStats.set(userId, updated);
    return updated;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow()
});
var laborLogs = pgTable("labor_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  laborType: text("labor_type").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }).notNull(),
  cowTokensEarned: decimal("cow_tokens_earned", { precision: 10, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).notNull(),
  proofHash: text("proof_hash"),
  attestationUrl: text("attestation_url"),
  createdAt: timestamp("created_at").defaultNow()
});
var tokenBalances = pgTable("token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cow1Balance: decimal("cow1_balance", { precision: 10, scale: 2 }).default("0"),
  cow2Balance: decimal("cow2_balance", { precision: 10, scale: 2 }).default("0"),
  cow3Balance: decimal("cow3_balance", { precision: 10, scale: 2 }).default("0"),
  lastActive: timestamp("last_active").defaultNow(),
  decayWarningTime: timestamp("decay_warning_time"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var governanceProposals = pgTable("governance_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  // active, voting, passed, rejected
  votesYes: integer("votes_yes").default(0),
  votesNo: integer("votes_no").default(0),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  proposalId: varchar("proposal_id").notNull().references(() => governanceProposals.id),
  vote: boolean("vote").notNull(),
  // true for yes, false for no
  createdAt: timestamp("created_at").defaultNow()
});
var marketplaceItems = pgTable("marketplace_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  focusScore: integer("focus_score").default(0),
  tribeMembers: integer("tribe_members").default(0),
  emotionScore: decimal("emotion_score", { precision: 3, scale: 1 }).default("5.0"),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0"),
  attentionViews: integer("attention_views").default(0),
  scheduledHours: decimal("scheduled_hours", { precision: 5, scale: 2 }).default("0"),
  influenceScore: integer("influence_score").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertLaborLogSchema = createInsertSchema(laborLogs).omit({
  id: true,
  userId: true,
  cowTokensEarned: true,
  multiplier: true,
  proofHash: true,
  createdAt: true
});
var insertTokenBalanceSchema = createInsertSchema(tokenBalances).omit({
  id: true,
  updatedAt: true
});
var insertGovernanceProposalSchema = createInsertSchema(governanceProposals).omit({
  id: true,
  votesYes: true,
  votesNo: true,
  createdAt: true
});
var insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true
});
var insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).omit({
  id: true,
  sellerId: true,
  createdAt: true
});

// client/src/lib/labor-index.ts
var LABOR_INDEX = {
  "Art Creation": 1.8,
  "Care Work": 2,
  // Higher multiplier to reflect value
  "Teaching": 1.9,
  "Community Building": 1.7,
  "Cultural Preservation": 2.1,
  // Highest multiplier for cultural work
  "Environmental Work": 1.6,
  "Healing & Wellness": 1.8,
  "Traditional Crafts": 1.9,
  "Storytelling": 1.7,
  "Food Preparation": 1.5
};
function getLaborMultiplier(laborType) {
  return LABOR_INDEX[laborType] || 1;
}
function calculateCOWTokens(hoursWorked, multiplier) {
  const baseRate = 11;
  return Math.round(hoursWorked * baseRate * multiplier * 100) / 100;
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("default-user");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  app2.get("/api/balances", async (req, res) => {
    try {
      const balance = await storage.getTokenBalance("default-user");
      if (!balance) {
        return res.status(404).json({ message: "Balance not found" });
      }
      res.json(balance);
    } catch (error) {
      res.status(500).json({ message: "Error fetching balances" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats("default-user");
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });
  app2.post("/api/labor-logs", async (req, res) => {
    try {
      const validatedData = insertLaborLogSchema.parse(req.body);
      const multiplier = getLaborMultiplier(validatedData.laborType);
      const hoursWorked = parseFloat(validatedData.hoursWorked);
      const cowTokensEarned = calculateCOWTokens(hoursWorked, multiplier);
      const proofHash = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const laborLog = await storage.createLaborLog({
        ...validatedData,
        userId: "default-user",
        cowTokensEarned: cowTokensEarned.toString(),
        multiplier: multiplier.toString(),
        proofHash
      });
      const currentBalance = await storage.getTokenBalance("default-user");
      if (currentBalance) {
        const newCow1Balance = parseFloat(currentBalance.cow1Balance) + cowTokensEarned;
        await storage.updateTokenBalance("default-user", {
          cow1Balance: newCow1Balance.toString(),
          lastActive: /* @__PURE__ */ new Date()
        });
      }
      const currentStats = await storage.getUserStats("default-user");
      if (currentStats) {
        const newMonthlyEarnings = parseFloat(currentStats.monthlyEarnings) + cowTokensEarned;
        const newFocusScore = Math.min(currentStats.focusScore + 1, 10);
        await storage.updateUserStats("default-user", {
          monthlyEarnings: newMonthlyEarnings.toString(),
          focusScore: newFocusScore
        });
      }
      res.json(laborLog);
    } catch (error) {
      console.error("Error creating labor log:", error);
      res.status(400).json({ message: "Invalid labor log data" });
    }
  });
  app2.get("/api/labor-logs", async (req, res) => {
    try {
      const logs = await storage.getUserLaborLogs("default-user");
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching labor logs" });
    }
  });
  app2.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getActiveProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals" });
    }
  });
  app2.post("/api/proposals/:id/vote", async (req, res) => {
    try {
      const proposalId = req.params.id;
      const { vote } = req.body;
      if (typeof vote !== "boolean") {
        return res.status(400).json({ message: "Vote must be boolean" });
      }
      const existingVote = await storage.getUserVote("default-user", proposalId);
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted on this proposal" });
      }
      await storage.createVote({
        userId: "default-user",
        proposalId,
        vote
      });
      const proposal = await storage.getProposal(proposalId);
      if (proposal) {
        const newVotesYes = vote ? proposal.votesYes + 1 : proposal.votesYes;
        const newVotesNo = vote ? proposal.votesNo : proposal.votesNo + 1;
        await storage.updateProposalVotes(proposalId, newVotesYes, newVotesNo);
      }
      res.json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error voting:", error);
      res.status(500).json({ message: "Error recording vote" });
    }
  });
  app2.get("/api/marketplace", async (req, res) => {
    try {
      const items = await storage.getMarketplaceItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching marketplace items" });
    }
  });
  app2.post("/api/decay", async (req, res) => {
    try {
      const balance = await storage.getTokenBalance("default-user");
      if (!balance) {
        return res.status(404).json({ message: "Balance not found" });
      }
      const now = /* @__PURE__ */ new Date();
      const lastActive = new Date(balance.lastActive);
      const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1e3 * 60 * 60);
      if (hoursSinceActive > 24) {
        const decayRate = 0.01;
        const hoursOfDecay = hoursSinceActive - 24;
        const decayFactor = Math.pow(1 - decayRate, hoursOfDecay);
        const newCow1Balance = (parseFloat(balance.cow1Balance) * decayFactor).toString();
        const newCow2Balance = (parseFloat(balance.cow2Balance) * decayFactor).toString();
        const newCow3Balance = (parseFloat(balance.cow3Balance) * decayFactor).toString();
        await storage.updateTokenBalance("default-user", {
          cow1Balance: newCow1Balance,
          cow2Balance: newCow2Balance,
          cow3Balance: newCow3Balance
        });
        res.json({
          message: "Decay applied",
          decayFactor,
          hoursOfDecay
        });
      } else {
        res.json({ message: "No decay applied - user recently active" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error applying decay" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
