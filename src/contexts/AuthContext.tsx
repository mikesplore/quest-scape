import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/types/api';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

// Role type for type safety
export type UserRole = 'student' | 'instructor' | 'admin';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isOwner: (userId: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid by fetching user data
          await refreshUser();
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const authData: AuthResponse = await apiClient.login(credentials);
      
      // Store tokens and user data
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      setUser(authData.user);
      toast.success(`Welcome back, ${authData.user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const authData: AuthResponse = await apiClient.register(userData);
      
      // Store tokens and user data
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      setUser(authData.user);
      toast.success(`Welcome to LearnHub, ${authData.user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
      throw error;
    }
  };

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  };

  // Check if current user is the owner of a resource
  const isOwner = (userId: string): boolean => {
    return user?.id === userId;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.role === role);
  };

  // Check if user has all of the specified roles (useful for multi-role requirements)
  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.every(role => user.role === role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    isOwner,
    hasAnyRole,
    hasAllRoles,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};