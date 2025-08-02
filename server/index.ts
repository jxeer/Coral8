/**
 * Main Server Entry Point for Coral8 Application
 * 
 * This file initializes the Express server for the Coral8 off-chain interface.
 * Coral8 serves as the web application for the Cowrie Coin blockchain ecosystem,
 * providing labor tracking, token economics, governance, and marketplace features.
 * 
 * Server Architecture:
 * - Express.js backend with TypeScript
 * - Vite development server integration
 * - PostgreSQL database with Drizzle ORM
 * - Replit OAuth authentication
 * - RESTful API endpoints
 * 
 * Key Features Supported:
 * - Cultural labor logging with multiplier calculations
 * - Three-tier COW token system (COW1, COW2, COW3)
 * - Community governance voting
 * - Marketplace for goods and services
 * - Mobile-first responsive design
 * 
 * Development: Runs on port 5000 with hot reload via Vite
 * Production: Configurable port with optimized builds
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Initialize Express application with essential middleware
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data

/**
 * Request Logging Middleware
 * Logs API requests with timing, status codes, and response data
 * Only logs routes starting with /api to avoid noise from static assets
 * Truncates long log lines to maintain readability
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept res.json to capture response data for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log request details when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate overly long log lines
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Server Initialization
 * Sets up routes, error handling, and development/production serving
 */
(async () => {
  // Register all API routes and authentication
  const server = await registerRoutes(app);

  /**
   * Global Error Handler
   * Catches unhandled errors and returns appropriate HTTP responses
   * Prevents server crashes and provides consistent error format
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error('Express error:', err);
  });

  /**
   * Development vs Production Setup
   * Development: Use Vite dev server with hot reload
   * Production: Serve static files directly
   * Important: Vite setup must be after API routes to avoid conflicts
   */
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
