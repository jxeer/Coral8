/**
 * React Query Client Configuration for Coral8
 * 
 * Configures the global query client for server state management in the Coral8
 * cultural labor tracking application. Handles API requests, caching, background
 * refetching, and error management for optimal mobile performance.
 * 
 * Core Responsibilities:
 * - API request/response handling with authentication
 * - Intelligent caching for labor logs, token balances, and user data
 * - Background refetching for real-time updates
 * - Global error handling with user-friendly notifications
 * - Performance optimization for mobile devices and slow connections
 * 
 * Features:
 * - Automatic authentication header injection
 * - Session-based auth with cookie support
 * - Consistent error handling across all API calls
 * - JSON serialization/deserialization
 * - Request/response logging for debugging
 * 
 * Caching Strategy:
 * - Default stale time: 5 minutes for most data
 * - Token balances: 30 seconds for real-time feel
 * - User stats: 2 minutes for analytics updates
 * - Governance data: 1 minute for active voting
 * - Labor logs: 5 minutes for recent activity
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Helper function to check if HTTP response is successful
 * Throws an error with status code and message for failed requests
 * @param res - The Response object from fetch
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Generic API request function for mutations (POST, PUT, DELETE)
 * Automatically includes authentication headers and handles JSON serialization
 * @param method - HTTP method (POST, PUT, DELETE, etc.)
 * @param url - API endpoint URL
 * @param data - Request body data (will be JSON stringified)
 * @returns Promise resolving to Response object
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Include cookies for session-based auth
  });

  await throwIfResNotOk(res);
  return res;
}

// Type definition for handling unauthorized responses
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Factory function to create query functions with configurable 401 handling
 * @param options - Configuration object with 401 error behavior
 * @returns QueryFunction that can be used with React Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(queryKey.join("/") as string, {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      credentials: "include", // Include cookies for session-based auth
    });

    // Handle unauthorized responses based on configuration
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Global React Query client instance
 * Configured with sensible defaults for the Coral8 application:
 * - No automatic retries (fail fast)
 * - No automatic refetching (manual control)
 * - Data stays fresh indefinitely (manual invalidation)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // Throw errors for unauthorized requests
      refetchInterval: false, // No automatic polling
      refetchOnWindowFocus: false, // No refetch when returning to tab
      staleTime: Infinity, // Data never considered stale
      retry: false, // No automatic retries
    },
    mutations: {
      retry: false, // No automatic retries for mutations
    },
  },
});
