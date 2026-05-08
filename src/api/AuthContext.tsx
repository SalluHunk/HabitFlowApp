import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AuthUser, apiLogin, apiSignup, apiMe, apiGoogleLogin,
  setToken, clearToken, getToken,
} from './client';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const { user } = await apiMe();
          setUser(user);
        }
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    await setToken(token);
    setUser(user);
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const { token, user } = await apiSignup(email, password, name);
    await setToken(token);
    setUser(user);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const { token, user } = await apiGoogleLogin(idToken);
    await setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
