# Overview

Coral8 is a full-stack web application that serves as the off-chain interface for the Cowrie Coin blockchain ecosystem. The platform allows users to log culturally rooted labor, earn COW tokens, participate in governance, and engage in a community marketplace. Built with a focus on cultural preservation and honoring ancestral wisdom while embracing economic innovation, it features a mobile-first design with oceanic theming.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Development Status

**Date**: August 2, 2025  
**Development Session**: 8+ hours completed
**Status**: User taking rest break, continuing tomorrow

## Latest Progress

✓ **Mobile Dashboard Enhancement**: Completed full interactive mobile dashboard with functional buttons across all sections (Labor, Balance, Governance, Marketplace)
✓ **Toast Notification System**: Replaced browser alerts with elegant in-app toast notifications for better mobile UX
✓ **Labor Logging Features**: Added labor type selection with multipliers, loading states, and detailed feedback
✓ **Token System Display**: Enhanced three-tier COW token balance view with transfer functionality
✓ **Governance Voting**: Implemented Yes/No voting buttons with visual feedback and token rewards
✓ **Marketplace Interface**: Added browsing and selling capabilities with item displays
✓ **Mobile Navigation**: Enhanced bottom navigation with proper tab switching and demo explanations
→ **Comprehensive Code Documentation**: Adding detailed comments throughout entire codebase for developer readability and maintenance

## Technical Implementation

- Enhanced `demo-mobile-dashboard.tsx` with state management for labor type selection and loading states
- Implemented elegant toast notification system using DOM manipulation for mobile-optimized feedback
- Added comprehensive button interactions across all dashboard sections
- Maintained oceanic Yemaya-inspired design theme throughout all enhancements
- **Code Documentation Progress**: Added comprehensive comments to:
  - `client/src/App.tsx`: Main application architecture and routing logic
  - `shared/schema.ts`: Complete database schema with cultural economics philosophy
  - `server/routes.ts`: API endpoints with labor index and token system implementation
  - `server/index.ts`: Express server setup and middleware configuration
  - `client/src/pages/demo-dashboard.tsx`: Demo feature showcase and complete user journey
  - `client/src/lib/queryClient.ts`: React Query configuration and mobile-optimized caching
  - `client/src/lib/labor-index.ts`: Cultural value system and sacred economics framework
  - `client/src/components/demo-mobile-dashboard.tsx`: Interactive mobile UI components
  - `client/src/hooks/useAuth.ts`: Authentication state management
  - `client/src/components/ui/*`: Complete UI component library with accessibility features
  - `client/src/components/labor-logging.tsx`: Cultural work logging interface
  - `client/src/components/sidebar.tsx`: Main application navigation
  - Multiple storage, authentication, and utility files

## Demo Features Status

- **OAuth Authentication**: Migrated from Replit Auth to Google OAuth for improved reliability and user familiarity
- **Demo Mode**: Fully functional preview mode allowing complete feature exploration without authentication
- **Mobile Optimization**: All features mobile-first with touch gestures and PWA capabilities
- **User Experience**: Professional mobile app experience with loading states, visual feedback, and smooth transitions

## Google OAuth Migration (August 2, 2025)

**✓ Successfully migrated authentication system from Replit Auth to Google OAuth**

### Technical Implementation:
- Created `server/google-auth.ts` with comprehensive Google OAuth integration
- Updated user schema to include `googleId` field for Google account linking
- Enhanced storage interface with Google OAuth support methods
- Modified authentication routes to use Google OAuth flow
- Updated landing page to use Google sign-in instead of Replit Auth

### Benefits of Migration:
- More reliable authentication with familiar Google sign-in experience
- Better mobile device compatibility and user experience
- Reduced OAuth configuration complexity for deployment
- Enhanced user trust through Google's established authentication system

### Current Status:
- ✅ GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET provided
- ❌ Redirect URI mismatch error in Google Cloud Console
- ✅ OAuth flow technically working, just needs exact URI match

### Troubleshooting Issue:
Error 400: redirect_uri_mismatch indicates the callback URL in Google Cloud Console doesn't exactly match the configured URL.

**Exact redirect URI needed in Google Cloud Console:**
```
https://fb43126d-e0fa-4432-997c-ea52b6574f1f-00-10zpw6t9x7t5h.worf.replit.dev/auth/google/callback
```

## Code Documentation Standards

**Established**: August 2, 2025

### File-Level Comments
All major components and utilities should include:
- Purpose and functionality overview
- Key features and capabilities
- Design patterns or architectural notes
- Dependencies and integration points
- Troubleshooting references where applicable

### Function-Level Comments
- Complex business logic explanations
- Parameter descriptions for non-obvious inputs
- Return value descriptions
- Side effects or state changes
- Error handling approaches

### Code Quality Standards
- Comprehensive comments for OAuth and authentication flows
- Mobile-specific implementations documented
- Token economics calculations explained
- Database schema changes documented
- API endpoint purposes and security requirements noted

## OAuth Troubleshooting Resources

**Created**: Comprehensive troubleshooting plan in `OAUTH_TROUBLESHOOTING_PLAN.md`
- Step-by-step debugging process
- Configuration verification checklist
- Alternative authentication options
- Expected timeline and success metrics

## Next Session Priorities

1. **Complete Code Documentation** (COMPLETED - 100%)
   ✓ Comprehensive comments added to all major files and core systems
   ✓ Cultural economics philosophy documented throughout schema and logic
   ✓ Mobile optimization techniques detailed in component files
   ✓ Business logic explanations for labor index and token system complete
   ✓ Authentication and API patterns fully documented
   ✓ Complete UI component library documentation with accessibility notes
   ✓ All custom components documented with usage patterns and design principles

2. **OAuth Resolution** (1-2 hours)
   - Follow troubleshooting plan in OAUTH_TROUBLESHOOTING_PLAN.md
   - Fix redirect URI configuration
   - Test complete authentication flow

3. **Feature Enhancement** (as needed)
   - Complete any remaining demo features
   - Add real-time data connections
   - Implement advanced mobile gestures

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