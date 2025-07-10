// Simplified auth hook without actual authentication
interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Mock implementation for demo purposes
export const useAuth = (): AuthContextType => {
  return {
    user: { id: 'demo-user', email: 'demo@example.com' }, // Mock user
    session: { user: { id: 'demo-user', email: 'demo@example.com' } }, // Mock session
    loading: false,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => {},
  };
};

// Empty provider for compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};