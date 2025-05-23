"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Make sure this path is correct
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<any>; // Add return type if known, e.g., Promise<{ user: User; session: Session } | { error: any }>
  signup: (email: string, pass: string) => Promise<any>; // Add return type
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const getSession = async () => {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error fetching session:", error.message);
        }
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await fetch('/api/auth/login', { // Ensure this API route exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.error || 'Login failed');
    }
    // Supabase client will automatically update auth state via onAuthStateChange
    return responseData;
  };

  const signup = async (email: string, pass: string) => {
    const response = await fetch('/api/auth/signup', { // Ensure this API route exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.error || 'Signup failed');
    }
    // Supabase client will automatically update auth state via onAuthStateChange
    // or you might get a user object back indicating confirmation is needed
    return responseData;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    // setUser(null); // onAuthStateChange will handle this
    // setSession(null); // onAuthStateChange will handle this
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {!isLoading && children} {/* Optionally, only render children when auth state is resolved */}
      {isLoading && ( /* Optional: Show a global loader */
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      )}
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