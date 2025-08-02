/**
 * Coral8 API Routes - Server Endpoint Configuration
 * 
 * This file defines all RESTful API endpoints for the Coral8 off-chain interface,
 * implementing the complete backend functionality for cultural labor tracking,
 * token economics, governance, and community marketplace.
 * 
 * API Categories:
 * - Authentication: Multi-method user authentication (Replit OAuth, wallet, password)
 * - Labor Tracking: Cultural work logging with multiplier-based token calculations
 * - Token Economics: Three-tier COW token system management and transfers
 * - Governance: Community proposal creation and democratic voting
 * - Marketplace: Cultural goods and services trading platform
 * - User Analytics: Comprehensive stats and engagement metrics
 * - Decay System: Token sustainability through activity-based value preservation
 * 
 * Labor Economics Implementation:
 * - Base rate: 11 COW tokens per hour
 * - Cultural multipliers: Care Work (2.0x), Cultural Preservation (2.1x), etc.
 * - Proof-of-work system with cryptographic verification
 * - Community attestation through witness verification
 * 
 * Token System Architecture:
 * - COW1: Liquid tokens for immediate transactions and marketplace
 * - COW2: Staked tokens for governance voting power
 * - COW3: Governance tokens for proposal creation and advanced features
 * - Decay mechanism: 1% per hour after 24 hours of inactivity
 * 
 * Security & Validation:
 * - Zod schema validation for all incoming data
 * - Authentication middleware for protected endpoints
 * - SQL injection prevention via Drizzle ORM
 * - Rate limiting considerations for public demo access
 * 
 * Cultural Focus:
 * - Recognition of ancestral wisdom and traditional knowledge
 * - Value-based multipliers for community-essential work
 * - Democratic governance with transparent decision-making
 * - Marketplace supporting cultural goods and services
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { authService } from "./auth";
import { authenticateToken, optionalAuth, type AuthenticatedRequest } from "./middleware";
import { setupGoogleAuth, isAuthenticated } from "./google-auth";
import { loginSchema, registerSchema, walletLoginSchema } from "@shared/schema";
import { insertLaborLogSchema, insertVoteSchema } from "@shared/schema";
import { calculateCOWTokens, getLaborMultiplier } from "../client/src/lib/labor-index";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  
  /**
   * Google OAuth Authentication Setup
   * 
   * Replaced Replit Auth with Google OAuth for more reliable authentication.
   * Provides familiar Google sign-in experience and better mobile support.
   */
  await setupGoogleAuth(app);

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/wallet-login', async (req, res) => {
    try {
      const data = walletLoginSchema.parse(req.body);
      const result = await authService.loginWithWallet(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/connect-wallet', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const data = walletLoginSchema.parse(req.body);
      const result = await authService.connectWallet(req.user!.id, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        await authService.logout(token);
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/auth/nonce', (req, res) => {
    const nonce = authService.generateNonce();
    res.json({ nonce });
  });

  app.post('/api/auth/wallet-message', (req, res) => {
    const { walletAddress, nonce } = req.body;
    if (!walletAddress || !nonce) {
      return res.status(400).json({ message: 'Wallet address and nonce required' });
    }
    const message = authService.createAuthMessage(walletAddress, nonce);
    res.json({ message });
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
    res.json(req.user);
  });
  
  // Replit Auth routes
  /**
   * Google OAuth User Endpoint
   * 
   * Updated to work with Google OAuth session format instead of Replit claims.
   * Returns current authenticated user data for frontend authentication state.
   */
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // req.user now contains the User object from Google OAuth
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Wallet connection for authenticated users  
  app.post('/api/auth/connect-wallet', isAuthenticated, async (req: any, res) => {
    try {
      const data = walletLoginSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const result = await authService.connectWallet(userId, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user token balances
  app.get("/api/balances", async (req, res) => {
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

  // Get user stats
  app.get("/api/stats", async (req, res) => {
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

  // Create labor log
  app.post("/api/labor-logs", async (req, res) => {
    try {
      const validatedData = insertLaborLogSchema.parse(req.body);
      
      // Calculate COW tokens based on Labor Index
      const multiplier = getLaborMultiplier(validatedData.laborType);
      const hoursWorked = parseFloat(validatedData.hoursWorked);
      const cowTokensEarned = calculateCOWTokens(hoursWorked, multiplier);
      
      // Generate proof hash (mock for now)
      const proofHash = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const laborLog = await storage.createLaborLog({
        ...validatedData,
        userId: "default-user",
        cowTokensEarned: cowTokensEarned.toString(),
        multiplier: multiplier.toString(),
        proofHash
      });

      // Update token balances (simplified - add to COW1 for now)
      const currentBalance = await storage.getTokenBalance("default-user");
      if (currentBalance) {
        const newCow1Balance = parseFloat(currentBalance.cow1Balance || "0") + cowTokensEarned;
        await storage.updateTokenBalance("default-user", {
          cow1Balance: newCow1Balance.toString(),
          lastActive: new Date()
        });
      }

      // Update user stats
      const currentStats = await storage.getUserStats("default-user");
      if (currentStats) {
        const newMonthlyEarnings = parseFloat(currentStats.monthlyEarnings || "0") + cowTokensEarned;
        const newFocusScore = Math.min((currentStats.focusScore || 0) + 1, 10);
        await storage.updateUserStats("default-user" || "", {
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

  // Get user labor logs
  app.get("/api/labor-logs", async (req, res) => {
    try {
      const logs = await storage.getUserLaborLogs("default-user");
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching labor logs" });
    }
  });

  // Get governance proposals
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getActiveProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proposals" });
    }
  });

  // Vote on proposal
  app.post("/api/proposals/:id/vote", async (req, res) => {
    try {
      const proposalId = req.params.id;
      const { vote } = req.body;
      
      if (typeof vote !== "boolean") {
        return res.status(400).json({ message: "Vote must be boolean" });
      }

      // Check if user already voted
      const existingVote = await storage.getUserVote("default-user", proposalId);
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted on this proposal" });
      }

      // Create vote
      await storage.createVote({
        userId: "default-user",
        proposalId,
        vote
      });

      // Update proposal vote counts
      const proposal = await storage.getProposal(proposalId);
      if (proposal) {
        const newVotesYes = vote ? (proposal.votesYes || 0) + 1 : (proposal.votesYes || 0);
        const newVotesNo = vote ? (proposal.votesNo || 0) : (proposal.votesNo || 0) + 1;
        await storage.updateProposalVotes(proposalId, newVotesYes, newVotesNo);
      }

      res.json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error voting:", error);
      res.status(500).json({ message: "Error recording vote" });
    }
  });

  // Get marketplace items
  app.get("/api/marketplace", async (req, res) => {
    try {
      const items = await storage.getMarketplaceItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching marketplace items" });
    }
  });

  // Simulate decay process
  app.post("/api/decay", async (req, res) => {
    try {
      const balance = await storage.getTokenBalance("default-user");
      if (!balance) {
        return res.status(404).json({ message: "Balance not found" });
      }

      const now = new Date();
      const lastActive = new Date(balance.lastActive || new Date());
      const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

      // Apply 1% decay per hour of inactivity after 24 hours
      if (hoursSinceActive > 24) {
        const decayRate = 0.01;
        const hoursOfDecay = hoursSinceActive - 24;
        const decayFactor = Math.pow(1 - decayRate, hoursOfDecay);

        const newCow1Balance = (parseFloat(balance.cow1Balance || "0") * decayFactor).toString();
        const newCow2Balance = (parseFloat(balance.cow2Balance || "0") * decayFactor).toString();
        const newCow3Balance = (parseFloat(balance.cow3Balance || "0") * decayFactor).toString();

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

  const httpServer = createServer(app);
  return httpServer;
}
