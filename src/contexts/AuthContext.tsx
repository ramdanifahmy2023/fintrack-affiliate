import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type UserRole = 'superadmin' | 'leader' | 'admin' | 'staff' | 'viewer';
export type JobPosition = 'Superadmin' | 'Leader' | 'Admin' | 'Host Live' | 'Kreator' | 'Viewer';

export interface AuthUser extends User {
  profile?: Tables<'profiles'>;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Tables<'profiles'>>) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setUser(authUser);
      } else {
        setUser({ ...authUser, profile });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(authUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    return { error: result.error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Tables<'profiles'>>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh user profile
    await fetchUserProfile(user);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user?.profile?.role) return false;
    
    const userRole = user.profile.role as UserRole;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Superadmin has access to everything
    if (userRole === 'superadmin') return true;
    
    return allowedRoles.includes(userRole);
  };

  const isAuthenticated = !!session && !!user;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};