# Google OAuth Troubleshooting Plan

## Current Status
- ✅ Google OAuth credentials configured
- ✅ Redirect URI properly set in Google Cloud Console
- ✅ OAuth flow initiated successfully 
- ❌ Browser security blocking Google OAuth popup/redirect

## Issue Analysis
The "accounts.google.com refused to connect" error indicates:
1. Browser security policies blocking the OAuth flow
2. Possible iframe/popup restrictions
3. CORS or content security policy issues

## Immediate Solutions

### Option 1: Direct Link Test
Try opening the OAuth URL directly in a new tab:
```
https://fb43126d-e0fa-4432-997c-ea52b6574f1f-00-10zpw6t9x7t5h.worf.replit.dev/auth/google
```

### Option 2: Update Button to Open in New Tab
Modify the sign-in button to open OAuth in a new window to avoid iframe restrictions.

### Option 3: Verify Google Cloud Console Settings
Double-check in Google Cloud Console:
- OAuth 2.0 Client ID is configured
- Authorized redirect URIs includes exact URL
- OAuth consent screen is properly configured
- Application domain verification if required

## Expected Timeline
- Immediate fix: 15-30 minutes
- Complete testing: Additional 15 minutes
- Fallback options: Demo mode remains fully functional

## Success Metrics
1. User can click "Sign in with Google" button
2. Redirects to Google OAuth consent screen
3. User grants permissions
4. Successfully redirects back to Coral8 dashboard
5. User session established and authenticated

## Alternative Authentication
If Google OAuth continues to have issues, we can:
1. Keep demo mode as primary experience
2. Add traditional email/password authentication
3. Implement MetaMask wallet connection as secondary auth
4. Use Replit Auth as backup option

## Next Steps
1. Test direct OAuth URL access
2. Modify button behavior if needed
3. Verify all Google Cloud Console settings
4. Document successful authentication flow