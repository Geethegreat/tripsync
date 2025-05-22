
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication for demo purposes
// In a real app, this would use an actual auth service or API
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('trip_trio_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Mock login for demo
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation for demo
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid credentials');
      }
      
      // Create mock user
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('trip_trio_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      // Mock signup for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create mock user
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };
      
      localStorage.setItem('trip_trio_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Account created!",
        description: "Welcome to Trip Trio.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('trip_trio_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
