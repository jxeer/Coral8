/**
 * Authentication Service
 * Handles traditional password-based auth and Web3 wallet authentication
 * Supports multiple authentication methods including MetaMask wallet connections
 * Integrates with Coral8's user management and session handling systems
 * Provides secure JWT token generation and signature verification
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { users, sessions, passwordResetTokens, emailVerificationTokens } from '@shared/schema';
import type { User, RegisterRequest, LoginRequest, WalletLoginRequest } from '@shared/schema';

// Security configuration constants
const JWT_SECRET = process.env.JWT_SECRET || 'coral8-dev-jwt-secret-please-change-in-production';
const SALT_ROUNDS = 12; // bcrypt salt rounds for password hashing

/**
 * Authentication Service Class
 * Provides comprehensive authentication methods for Coral8 application
 * Supports traditional passwords, Web3 wallets, and session management
 */
export class AuthService {
  
  /**
   * Register a new user with traditional password authentication
   * @param data - Registration data including username, email, password, and optional profile info
   * @returns Promise resolving to user object and JWT token
   */
  async register(data: RegisterRequest): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
    // Check if username or email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);
    
    if (existingUser.length > 0) {
      throw new Error('Username already exists');
    }

    const existingEmail = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    
    if (existingEmail.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const [newUser] = await db.insert(users).values({
      username: data.username,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      authMethod: 'password',
    }).returning();

    // Create session
    const token = await this.createSession(newUser.id);

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    return { user: userWithoutPassword, token };
  }

  async login(data: LoginRequest): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
    // Find user by username or email
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    const token = await this.createSession(user.id);

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  // MetaMask wallet authentication
  async loginWithWallet(data: WalletLoginRequest): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
    // Verify the signature
    const isValidSignature = await this.verifyWalletSignature(
      data.walletAddress,
      data.message,
      data.signature
    );

    if (!isValidSignature) {
      throw new Error('Invalid wallet signature');
    }

    // Find existing user with this wallet address
    let [user] = await db.select()
      .from(users)
      .where(eq(users.walletAddress, data.walletAddress))
      .limit(1);

    if (!user) {
      // Create new user with wallet
      [user] = await db.insert(users).values({
        walletAddress: data.walletAddress,
        username: `wallet_${data.walletAddress.slice(0, 8)}`,
        isWalletVerified: true,
        authMethod: 'wallet',
      }).returning();
    } else {
      // Update last login and mark wallet as verified
      await db.update(users)
        .set({ 
          lastLogin: new Date(),
          isWalletVerified: true 
        })
        .where(eq(users.id, user.id));
    }

    // Create session
    const token = await this.createSession(user.id);

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  // Connect wallet to existing account
  async connectWallet(userId: string, data: WalletLoginRequest): Promise<User> {
    // Verify the signature
    const isValidSignature = await this.verifyWalletSignature(
      data.walletAddress,
      data.message,
      data.signature
    );

    if (!isValidSignature) {
      throw new Error('Invalid wallet signature');
    }

    // Check if wallet is already connected to another account
    const existingWallet = await db.select()
      .from(users)
      .where(eq(users.walletAddress, data.walletAddress))
      .limit(1);

    if (existingWallet.length > 0 && existingWallet[0].id !== userId) {
      throw new Error('Wallet already connected to another account');
    }

    // Update user with wallet address
    const [updatedUser] = await db.update(users)
      .set({ 
        walletAddress: data.walletAddress,
        isWalletVerified: true,
        authMethod: 'both'
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  // Session management
  async createSession(userId: string): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(sessions).values({
      userId,
      token,
      expiresAt,
    });

    return jwt.sign({ userId, sessionToken: token }, JWT_SECRET, {
      expiresIn: '7d'
    });
  }

  async validateSession(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, sessionToken: string };
      
      // Check if session exists and is not expired
      const [session] = await db.select()
        .from(sessions)
        .where(and(
          eq(sessions.token, decoded.sessionToken),
          eq(sessions.userId, decoded.userId)
        ))
        .limit(1);

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      // Get user
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      return user || null;
    } catch (error) {
      return null;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, sessionToken: string };
      
      // Delete session
      await db.delete(sessions)
        .where(eq(sessions.token, decoded.sessionToken));
    } catch (error) {
      // Token invalid, nothing to do
    }
  }

  // Utility methods
  private async verifyWalletSignature(
    walletAddress: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Generate nonce for wallet authentication
  generateNonce(): string {
    return randomBytes(16).toString('hex');
  }

  // Create authentication message for wallet signing
  createAuthMessage(walletAddress: string, nonce: string): string {
    return `Sign this message to authenticate with Coral8:

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`;
  }
}

export const authService = new AuthService();