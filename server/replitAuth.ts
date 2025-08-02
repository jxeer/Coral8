import * as client from "openid-client";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL("https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  if (process.env.DATABASE_URL) {
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
    });
  } else {
    // Fallback to memory store for development
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

  // Manual OAuth flow instead of passport strategy
  app.get("/api/login", async (req, res) => {
    try {
      const config = await getOidcConfig();
      const authUrl = client.buildAuthorizationUrl(config, process.env.REPL_ID!, {
        redirect_uri: `https://${req.hostname}/api/callback`,
        scope: "openid email profile",
        response_type: "code",
        prompt: "login",
      });
      res.redirect(authUrl.href);
    } catch (error) {
      console.error("Auth setup error:", error);
      res.status(500).json({ message: "Authentication setup failed" });
    }
  });

  app.get("/api/callback", async (req, res) => {
    try {
      const config = await getOidcConfig();
      const { code } = req.query;
      
      console.log("Callback received with code:", !!code);
      
      if (!code) {
        console.log("No authorization code received");
        return res.redirect("/?error=no_code");
      }

      const tokens = await client.authorizationCodeGrant(config, process.env.REPL_ID!, {
        code: code as string,
        redirect_uri: `https://${req.hostname}/api/callback`,
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