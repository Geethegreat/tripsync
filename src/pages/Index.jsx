
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TripProvider } from '@/contexts/TripContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/layout/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-travel-primary/20"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {user ? (
        <TripProvider>
          <main className="flex-1 overflow-auto">
            <Dashboard />
          </main>
        </TripProvider>
      ) : (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 bg-gray-50">
          <div className="w-full max-w-5xl grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2 text-center md:text-left">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-travel-gradient">
                  TripSync
                </h1>
                <p className="text-lg text-gray-600">
                  Plan your trips together. Vote on destinations, assign roles, and collaborate with your friends.
                </p>
              </div>
              
              <div className="space-y-4 hidden md:block">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center text-travel-primary shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Create or Join a Trip</h3>
                    <p className="text-muted-foreground text-sm">
                      Start a new adventure or join your friends with an invitation code.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center text-travel-primary shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Vote on Plans</h3>
                    <p className="text-muted-foreground text-sm">
                      Democratically decide on dates, destinations, and activities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center text-travel-primary shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Travel Together</h3>
                    <p className="text-muted-foreground text-sm">
                      Assign roles, create packing lists, and enjoy your trip!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <AuthForm />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
