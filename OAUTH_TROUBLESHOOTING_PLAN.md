# OAuth Troubleshooting Plan for Coral8

## Current Status
- Replit Auth configured with proper OIDC discovery
- Getting "invalid_request" error during OAuth flow
- Redirect URI mismatch is the likely cause
- Demo mode works perfectly as fallback

## Identified Issues

### 1. Redirect URI Configuration
**Problem**: OAuth client settings need exact redirect URI match
**Current Error**: "invalid_request" suggests redirect URI mismatch

**Solution Steps**:
1. Check current domain in Replit console
2. Verify redirect URI in OAuth client settings
3. Ensure exact match including protocol (https://)
4. Update OAuth client configuration if needed

### 2. Environment Variables Verification
**Check These Variables**:
- `REPLIT_DOMAINS` - should match current domain
- `REPL_ID` - should match OAuth client ID  
- `SESSION_SECRET` - verify it's set
- `DATABASE_URL` - confirm database connection

### 3. OAuth Provider Configuration
**Verify in Replit Auth Dashboard**:
- Client ID matches REPL_ID
- Redirect URI exactly matches: `https://[your-domain]/api/callback`
- Scopes include: openid, email, profile, offline_access
- Client type set to "Web Application"

## Implementation Plan for Tomorrow

### Phase 1: Debug Current Setup (30 minutes)
1. **Check Environment Variables**
   ```bash
   echo $REPL_ID
   echo $REPLIT_DOMAINS
   ```

2. **Verify OAuth Client Settings**
   - Log into Replit Auth dashboard
   - Check redirect URI configuration
   - Verify client ID matches

3. **Test OAuth Flow**
   - Navigate to `/api/login`
   - Capture exact error messages
   - Check browser network tab for detailed errors

### Phase 2: Fix Configuration (45 minutes)
1. **Update OAuth Client Settings**
   - Correct redirect URI if needed
   - Verify all required scopes
   - Check client secret (if applicable)

2. **Update Environment Variables**
   - Ensure REPLIT_DOMAINS matches current domain
   - Verify REPL_ID matches OAuth client ID

3. **Test Database Connection**
   - Verify PostgreSQL session storage works
   - Check sessions table exists
   - Test user creation flow

### Phase 3: Alternative Authentication (if needed)
If Replit Auth continues to have issues:

1. **Add Google OAuth Direct**
   - Set up Google OAuth 2.0 client
   - Implement google-auth-library
   - Update auth flow to use Google directly

2. **Add MetaMask Integration**
   - Enhance existing MetaMask connection
   - Implement wallet-based authentication
   - Create Web3 user session management

## Testing Checklist

### OAuth Flow Testing
- [ ] `/api/login` redirects properly
- [ ] OAuth provider accepts redirect
- [ ] `/api/callback` processes response
- [ ] User session created successfully
- [ ] User data stored in database
- [ ] Subsequent requests authenticated

### Session Management
- [ ] Sessions persist across page refreshes
- [ ] Session data stored in PostgreSQL
- [ ] Logout clears session properly
- [ ] Session expiry handled correctly

### Error Handling
- [ ] Auth errors display user-friendly messages
- [ ] Failed auth redirects to appropriate page
- [ ] Network errors handled gracefully
- [ ] Session expiry triggers re-auth

## Backup Plan: Enhanced Demo Mode

If OAuth issues persist, enhance demo mode with:

1. **Simulated Authentication**
   - Create demo user profiles
   - Implement demo session management
   - Add user switching capability

2. **Feature Completeness**
   - Full labor logging with persistence
   - Complete governance voting system
   - Marketplace with transaction simulation
   - Token transfer demonstrations

## Code Areas Requiring OAuth Integration

### Server Files
- `server/replitAuth.ts` - Main OAuth implementation
- `server/routes.ts` - Protected route middleware
- `server/storage.ts` - User data management

### Client Files
- `client/src/hooks/useAuth.ts` - Auth state management
- `client/src/lib/authUtils.ts` - Auth utility functions
- `client/src/pages/landing.tsx` - Login/logout UI

## Expected Timeline
- **OAuth Fix**: 1-2 hours if configuration issue
- **Alternative Auth**: 3-4 hours if Replit Auth can't be resolved
- **Enhanced Demo**: 2-3 hours as backup implementation

## Success Metrics
1. Users can log in through Replit Auth successfully
2. User sessions persist across browser refreshes
3. Protected routes work correctly
4. User data saves to database
5. Logout functionality works properly

---

**Note**: All progress and fixes should be documented in `replit.md` for future reference.