/**
 * Demo App Provider Component
 * Wraps components with mock context data for demo mode
 * Allows full feature demonstration without authentication
 */

import { DemoContext, mockDemoData } from "../hooks/use-demo-context";

interface DemoAppProviderProps {
  children: React.ReactNode;
}

export function DemoAppProvider({ children }: DemoAppProviderProps) {
  return (
    <DemoContext.Provider value={mockDemoData}>
      {children}
    </DemoContext.Provider>
  );
}