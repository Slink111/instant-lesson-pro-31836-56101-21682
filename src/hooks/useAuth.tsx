import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend disabled - no authentication
    setLoading(false);
  }, []);

  const checkAdminStatus = async (userId: string) => {
    // Backend disabled
    setIsAdmin(false);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    // Backend disabled
    return { error: { message: 'Authentication is currently disabled' } };
  };

  const signUp = async (email: string, password: string) => {
    // Backend disabled
    return { error: { message: 'Authentication is currently disabled' } };
  };

  const signOut = async () => {
    // Backend disabled
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
