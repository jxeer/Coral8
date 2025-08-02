// Replit Authentication Module
// Implements OAuth 2.0 flow with PKCE for secure user authentication
// Integrates with Replit's OpenID Connect provider for Google sign-in and other providers

import * as client from "openid-client";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Ensure required environment variables are present
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

/**
 * Memoized function to get OpenID Connect configuration from Replit
 * Caches the configuration for 1 hour to avoid repeated API calls
 * @returns Promise resolving to OIDC configuration object
 */
const getOidcConfig = memoize(
  async () => {
    console.log("Discovering OIDC config for client:", process.env.REPL_ID);
    const config = await client.discovery(
      new URL("https://replit.com/oidc"),
      process.env.REPL_ID!
    );
    console.log("OIDC config discovered successfully");
    return config;
  },
  { maxAge: 3600 * 1000 } // Cache for 1 hour
);

/**
 * Creates and configures Express session middleware
 * Uses PostgreSQL for session storage in production, memory store for development
 * @returns Configured session middleware
 */
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week session lifetime
  
  if (process.env.DATABASE_URL) {
    // Production: Use PostgreSQL session store for persistence across server restarts
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false, // Assumes sessions table already exists
      ttl: sessionTtl,
      tableName: "sessions",
    });
    return session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something stored
      cookie: {
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: sessionTtl,
      },
    });
  } else {
    // Development: Use memory store (sessions lost on server restart)
    return session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
    });
  }
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Simple serialization for development
  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // OAuth login endpoint - initiates the authentication flow with PKCE for security
  app.get("/api/login", async (req, res) => {
    try {
      const config = await getOidcConfig();
      
      // Generate PKCE (Proof Key for Code Exchange) parameters for secure OAuth flow
      const codeVerifier = client.randomPKCECodeVerifier();
      const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
      
      // Store code verifier in session for later use in token exchange
      (req.session as any).codeVerifier = codeVerifier;
      
      // Build authorization URL with PKCE parameters
      const redirectUri = `https://${req.hostname}/oauth2callback`;
      console.log("Using redirect URI:", redirectUri);
      console.log("Using client ID:", process.env.REPL_ID);
      
      const authUrl = client.buildAuthorizationUrl(config, {
        client_id: process.env.REPL_ID!,
        redirect_uri: redirectUri,
        scope: "openid email profile",
        response_type: "code",
        prompt: "login",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });
      
      res.redirect(authUrl.href);
    } catch (error) {
      console.error("Auth setup error:", error);
      res.status(500).json({ message: "Authentication setup failed" });
    }
  });

  // OAuth callback endpoint - handles the redirect from Replit OAuth server
  app.get("/oauth2callback", async (req, res) => {
    try {
      const config = await getOidcConfig();
      const { code, error, error_description } = req.query;
      
      console.log("Full callback query params:", req.query);
      console.log("Callback received with code:", !!code);
      console.log("Error in callback:", error, error_description);
      
      // Handle OAuth errors (user denied access, configuration issues, etc.)
      if (error) {
        console.error("OAuth error:", error, error_description);
        return res.redirect(`/?error=${error}&description=${error_description}`);
      }
      
      // Ensure we received an authorization code
      if (!code) {
        console.log("No authorization code received");
        return res.redirect("/?error=no_code");
      }

      // Retrieve PKCE code verifier from session
      const codeVerifier = (req.session as any)?.codeVerifier;
      if (!codeVerifier) {
        console.error("No code verifier found in session");
        return res.redirect("/?error=missing_code_verifier");
      }

      // Exchange authorization code for access tokens using PKCE
      const tokens = await client.authorizationCodeGrant(config, {
        code: code as string,
        redirect_uri: `https://${req.hostname}/oauth2callback`,
        code_verifier: codeVerifier,
      });

      const claims = tokens.claims();
      console.log("Claims received:", claims?.sub, claims?.email);
      
      if (!claims) {
        console.error("No claims received from token");
        return res.redirect("/?error=no_claims");
      }
      
      // Upsert user in database first
      await upsertUser(claims);
      
      // Create simplified user object for session
      const user = {
        claims: {
          sub: claims.sub,
          email: claims.email,
          first_name: claims.first_name,
          last_name: claims.last_name,
          profile_image_url: claims.profile_image_url,
          exp: claims.exp
        },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: claims.exp
      };
      
      // Store user in session manually
      (req.session as any).passport = { user };
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.redirect("/?error=session_failed");
        }
        console.log("Session saved successfully");
        res.redirect("/");
      });
    } catch (error) {
      console.error("Callback error:", error);
      res.redirect("/?error=auth_failed");
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.passport?.user || req.user;

  console.log("Auth check - Session exists:", !!(req.session as any)?.passport);
  console.log("Auth check - User exists:", !!user);

  if (!user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // Token expired, try refresh
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};