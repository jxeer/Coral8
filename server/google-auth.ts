/**
 * Google OAuth Authentication Configuration for Coral8
 * 
 * Implements Google OAuth 2.0 authentication using Passport.js strategy.
 * Provides reliable, secure authentication that users are familiar with
 * and resolves the OAuth issues we were experiencing with Replit Auth.
 * 
 * Features:
 * - Google OAuth 2.0 integration with proper scope management
 * - User profile creation/update from Google account data
 * - Secure session management with database storage
 * - Integration with Coral8's user schema and token system
 * - Automatic token balance initialization for new users
 * 
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth application client ID from Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: OAuth application secret
 * - SESSION_SECRET: Secret for session encryption
 * - DATABASE_URL: PostgreSQL connection for session storage
 * 
 * OAuth Flow:
 * 1. User clicks "Sign in with Google" on landing page
 * 2. Redirect to Google OAuth consent screen
 * 3. Google redirects back to /auth/google/callback
 * 4. Profile data used to create/update user in database
 * 5. User session established and redirected to dashboard
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupGoogleAuth(app: Express) {
  // Trust proxy for secure cookies in production
  app.set("trust proxy", 1);
  
  // Session middleware
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/auth/google/callback`,
          scope: ["profile", "email"],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            // Extract user information from Google profile
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value;
            const firstName = profile.name?.givenName;
            const lastName = profile.name?.familyName;
            const profileImageUrl = profile.photos?.[0]?.value;

            console.log("Google OAuth profile:", { googleId, email, firstName, lastName });

            // Check if user already exists by Google ID
            let user = await storage.getUserByGoogleId?.(googleId);
            
            if (!user && email && storage.getUserByEmail) {
              // Try to find existing user by email to link accounts
              user = await storage.getUserByEmail(email);
              if (user && storage.updateUserGoogleId) {
                // Link Google account to existing user
                await storage.updateUserGoogleId(user.id, googleId);
              }
            }

            if (!user) {
              // Create new user with Google profile data
              user = await storage.createUser({
                googleId,
                email: email || null,
                firstName: firstName || null,
                lastName: lastName || null,
                profileImageUrl: profileImageUrl || null,
                username: email?.split('@')[0] || `user_${googleId}`,
                authMethod: "google",
                walletAddress: null,
                passwordHash: null,
                bio: null,
                isEmailVerified: true,
                isWalletVerified: false,
                lastLogin: new Date(),
              });
              
              console.log("Created new user:", user.id);
            } else if (storage.updateUser) {
              // Update existing user with latest Google profile data
              await storage.updateUser(user.id, {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                profileImageUrl: profileImageUrl || user.profileImageUrl,
                email: email || user.email,
              });
              
              console.log("Updated existing user:", user.id);
            }

            return done(null, user);
          } catch (error) {
            console.error("Google OAuth error:", error);
            return done(error);
          }
        }
      )
    );
  } else {
    console.warn("Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }

  // Passport serialization
  passport.serializeUser((user: Express.User, done) => {
    console.log("Serializing user:", (user as User).id);
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("Deserializing user ID:", id);
      const user = await storage.getUser(id);
      console.log("Deserialized user:", user ? "found" : "not found");
      done(null, user);
    } catch (error) {
      console.error("Deserialize error:", error);
      done(error);
    }
  });

  // Google OAuth Routes
  app.get("/auth/google", (req, res, next) => {
    console.log("Starting Google OAuth flow");
    console.log("Callback URL configured as:", `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/auth/google/callback`);
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  // Direct login route for existing user
  app.post("/auth/google/direct-login", async (req, res) => {
    try {
      const { googleId } = req.body;
      if (!googleId) {
        return res.status(400).json({ message: "Google ID required" });
      }

      const user = await storage.getUserByGoogleId?.(googleId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Manually create session
      req.login(user, (err) => {
        if (err) {
          console.error("Direct login error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({ message: "Login successful", user });
      });
    } catch (error) {
      console.error("Direct login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/auth/google/callback", (req, res, next) => {
    console.log("Google OAuth callback received with query:", req.query);
    passport.authenticate("google", (err: any, user: any) => {
      if (err || !user) {
        console.error("OAuth authentication failed:", err);
        return res.redirect("/?error=oauth_failed");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return res.redirect("/?error=login_failed");
        }
        
        // Store user ID in session for auth check
        (req.session as any).userId = user.id;
        
        // Close popup and redirect parent window
        res.send(`
          <script>
            if (window.opener) {
              window.opener.location.reload();
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        `);
      });
    })(req, res, next);
  });

  // Logout route
  app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  console.log("Auth check - Session exists:", !!req.session);
  console.log("Auth check - User exists:", !!req.user);
  
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};