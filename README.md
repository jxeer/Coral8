# Overview

Coral8 is a full-stack web application that serves as the off-chain interface for the Cowrie Coin blockchain ecosystem. The platform allows users to log culturally rooted labor, earn COW tokens, participate in governance, and engage in community marketplace activities. Built with a modern React frontend and Express backend, the application emphasizes cultural preservation, community building, and alternative economic models through blockchain-based token rewards.

## Recent Updates (January 2025)

✓ **Styling & UI Enhancements**: Fixed Tailwind configuration to properly support custom oceanic colors, resolved text contrast issues in token balance sections
✓ **COW Token Balance Icons**: Added meaningful icons (Coins, TrendingUp, Zap) with descriptions for COW1, COW2, COW3 tokens  
✓ **Coral8 Logo Restoration**: Implemented oceanic wave pattern logo in sidebar with smooth animation
✓ **Complete Navigation**: All pages (Dashboard, Tasks, Contracts, Clients, Invoices) fully functional with authentic cultural preservation content
✓ **Mobile-First Design**: Responsive layout working across all screen sizes with proper contrast and readability
✓ **Replit Authentication**: Implemented Replit Auth with Google sign-in, replacing custom authentication system
→ **OAuth Flow Debugging**: Working to resolve authorization code handling in callback flow

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Styling**: Tailwind CSS with custom oceanic color scheme (blues, teals, seafoam) and shadcn/ui component library
- **State Management**: React Context API for global app state, React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout with dedicated mobile navigation and adaptive UI components
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

## Backend Architecture
- **Runtime**: Node.js with Express server using TypeScript and ES modules
- **API Design**: RESTful endpoints for labor logging, token balances, governance, and marketplace
- **Data Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Pattern**: Repository pattern with in-memory storage fallback for development
- **Development Setup**: Vite for fast development builds and hot module replacement

## Database Schema
- **Users**: Wallet addresses, usernames, and creation timestamps
- **Labor Logs**: Type-specific work entries with hours, multipliers, and COW token calculations
- **Token Balances**: Three-tier COW token system (COW1, COW2, COW3) with decay mechanisms
- **Governance**: Proposals with voting capabilities and time-based status management
- **Marketplace**: Community-driven item listings with COW token pricing
- **User Stats**: Comprehensive metrics for focus, tribe, emotion, and influence tracking

## Token Economics System
- **Labor Index**: Multiplier-based reward system valuing cultural work (Care Work: 2.0x, Cultural Preservation: 2.1x)
- **Base Rate**: 11 COW tokens per hour with type-specific multipliers
- **Decay Mechanism**: Time-based token decay to encourage active participation
- **Multi-Tier Tokens**: COW1, COW2, COW3 with different characteristics and use cases

## Authentication & Security
- **Replit Auth**: OAuth-based authentication with Google and other providers
- **Session Management**: Cookie-based sessions with PostgreSQL session store
- **Type Safety**: End-to-end TypeScript with shared schema validation using Zod
- **MetaMask Integration**: Secondary wallet connection for authenticated users

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connect-PG-Simple**: PostgreSQL session store for Express sessions

## UI & Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Animation library for enhanced user interactions
- **Lucide React**: Consistent icon system throughout the application

## Development & Build Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: High-performance bundling for production builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Development environment plugins and error handling

## Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form handling with minimal re-renders
- **Date-fns**: Date manipulation and formatting utilities

## Blockchain Integration
- **Neon Serverless**: Database adapter optimized for serverless environments
- **Future Integration Points**: Designed for Web3 wallet connections and on-chain interactions