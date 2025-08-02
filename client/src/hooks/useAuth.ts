/**
 * Authentication Hook
 * Provides authentication state and user data throughout the application
 * Uses React Query to fetch and cache user information from the server
 */

import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for managing authentication state
 * @returns Object containing user data, loading state, and authentication status
 */
export function useAuth() {
  // Query the server to get current user information
  // retry: false prevents infinite retries for 401 Unauthorized responses
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user, // User object if authenticated, undefined if not
    isLoading, // True while the authentication check is in progress
    isAuthenticated: !!user, // Boolean indicating if user is logged in
  };
}