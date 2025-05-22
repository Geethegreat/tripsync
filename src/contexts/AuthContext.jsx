
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
    // Migrate data from old localStorage keys if they exist
    migrateLocalStorageKeys();
    
    // Check for stored user on mount using new key
    const storedUser = localStorage.getItem('tripsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Helper function to migrate localStorage data from old keys to new keys
  const migrateLocalStorageKeys = () => {
    // Migrate user data
    const oldUserData = localStorage.getItem('trip_trio_user');
    if (oldUserData) {
      localStorage.setItem('tripsync_user', oldUserData);
      localStorage.removeItem('trip_trio_user');
    }
    
    // Migrate trips data
    const oldTripsData = localStorage.getItem('trip_trio_trips');
    if (oldTripsData) {
      localStorage.setItem('tripsync_trips', oldTripsData);
      localStorage.removeItem('trip_trio_trips');
    }
    
    // Migrate current trip data
    const oldCurrentTripData = localStorage.getItem('trip_trio_current_trip');
    if (oldCurrentTripData) {
      localStorage.setItem('tripsync_current_trip', oldCurrentTripData);
      localStorage.removeItem('trip_trio_current_trip');
    }
  };

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
      
      localStorage.setItem('tripsync_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Welcome to TripSync!",
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
      
      localStorage.setItem('tripsync_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Account created!",
        description: "Welcome to TripSync!",
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
    localStorage.removeItem('tripsync_user');
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
