# Overview

Coral8 is a full-stack web application that serves as the off-chain interface for the Cowrie Coin blockchain ecosystem. The platform allows users to log culturally rooted labor, earn COW tokens, participate in governance, and engage in a community marketplace. Built with a focus on cultural preservation and honoring ancestral wisdom while embracing economic innovation, it features a mobile-first design with oceanic theming.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Tooling**: React 18 with TypeScript for type safety and modern component patterns. Uses Vite for fast development builds and hot module replacement.

**Styling & UI**: Tailwind CSS with custom oceanic color scheme (blues, teals, seafoam) and shadcn/ui component library. Features a complete mobile-first responsive design with dedicated mobile navigation.

**State Management**: React Context API for global app state management, React Query for server state management and caching. Form handling via React Hook Form with Zod validation for type-safe form processing.

**Routing**: Wouter for lightweight client-side routing with pages for Dashboard, Contracts, Invoices, Clients, and Tasks.

**Authentication**: Supports multiple authentication methods including Replit OAuth, wallet-based authentication (MetaMask), and traditional username/password.

## Backend Architecture

**Runtime & Framework**: Node.js with Express server using TypeScript and ES modules. RESTful API design with endpoints for labor logging, token balances, governance, and marketplace functionality.

**Data Layer**: Drizzle ORM with PostgreSQL for type-safe database operations. Repository pattern implementation with in-memory storage fallback for development environments.

**Session Management**: Cookie-based sessions with PostgreSQL session store for production, memory store fallback for development.

## Token Economics System

**Labor Index**: Multiplier-based reward system that values cultural work with specific multipliers (Care Work: 2.0x, Cultural Preservation: 2.1x, Teaching: 1.9x, etc.).

**Token Calculation**: Base rate of 11 COW tokens per hour with type-specific multipliers. Multi-tier token system with COW1, COW2, and COW3 tokens having different characteristics.

**Decay Mechanism**: Time-based token decay system to encourage active participation, with warning and critical states based on user activity.

## Database Schema

**Core Tables**: Users with wallet addresses and authentication methods, labor logs with type-specific work entries, token balances with three-tier COW system, and user stats for comprehensive metrics.

**Governance System**: Proposals table with voting capabilities and time-based status management, votes table for tracking user participation.

**Marketplace**: Community-driven item listings with COW token pricing system.

**Session Storage**: PostgreSQL-based session management required for Replit Auth integration.

## External Dependencies

**Authentication Services**: Replit OAuth for primary authentication, MetaMask/Web3 wallet integration for blockchain connectivity.

**Database**: PostgreSQL via Neon serverless for production data storage.

**UI Components**: Radix UI primitives via shadcn/ui for accessible component library.

**Development Tools**: Drizzle Kit for database migrations, ESBuild for production builds.

**Styling**: Tailwind CSS with custom oceanic color variables, Framer Motion for wave animations.