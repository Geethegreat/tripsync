
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TripMember {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  value: string;
  votes: string[]; // User IDs who voted
}

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  addedBy: string;
  isPinned: boolean;
  isEssential?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: { lat: number; lng: number };
  addedBy: string;
  votes: string[]; // User IDs who voted
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdBy: string;
  members: TripMember[];
  dateOptions?: PollOption[];
  destinationOptions?: PollOption[];
  transportationOptions?: PollOption[];
  selectedDate?: string;
  selectedDestination?: Destination;
  selectedTransportation?: string;
  packingList?: PackingItem[];
  restaurants?: Restaurant[];
  status: 'planning' | 'voting' | 'confirmed';
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  createTrip: (name: string, description?: string) => void;
  joinTrip: (inviteCode: string) => boolean;
  selectTrip: (tripId: string) => void;
  updateTrip: (trip: Trip) => void;
  addPoll: (tripId: string, poll: Poll) => void;
  voteOnOption: (tripId: string, pollId: string, optionId: string, userId: string) => void;
  assignRole: (tripId: string, userId: string, role: string) => void;
  addPackingItem: (tripId: string, item: Omit<PackingItem, 'id'>) => void;
  togglePinItem: (tripId: string, itemId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const storedTrips = localStorage.getItem('trip_trio_trips');
    return storedTrips ? JSON.parse(storedTrips) : [];
  });
  
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const { toast } = useToast();

  // Save trips to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('trip_trio_trips', JSON.stringify(trips));
  }, [trips]);

  const createTrip = (name: string, description?: string) => {
    const user = JSON.parse(localStorage.getItem('trip_trio_user') || '{}');
    
    if (!user.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to create a trip",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a random invitation code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      inviteCode,
      createdBy: user.id,
      members: [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          isAdmin: true
        }
      ],
      status: 'planning',
      packingList: [],
    };
    
    setTrips(prevTrips => [...prevTrips, newTrip]);
    setCurrentTrip(newTrip);
    
    toast({
      title: "Trip created!",
      description: `Your trip "${name}" has been created. Invite others using code: ${inviteCode}`,
    });
  };

  const joinTrip = (inviteCode: string) => {
    const user = JSON.parse(localStorage.getItem('trip_trio_user') || '{}');
    
    if (!user.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to join a trip",
        variant: "destructive",
      });
      return false;
    }
    
    const tripIndex = trips.findIndex(trip => 
      trip.inviteCode.toLowerCase() === inviteCode.toLowerCase()
    );
    
    if (tripIndex === -1) {
      toast({
        title: "Invalid code",
        description: "No trip was found with this invitation code",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if user is already a member
    if (trips[tripIndex].members.some(member => member.id === user.id)) {
      toast({
        title: "Already joined",
        description: "You are already a member of this trip",
      });
      setCurrentTrip(trips[tripIndex]);
      return true;
    }
    
    // Add user to trip members
    const updatedTrips = [...trips];
    updatedTrips[tripIndex].members.push({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      isAdmin: false
    });
    
    setTrips(updatedTrips);
    setCurrentTrip(updatedTrips[tripIndex]);
    
    toast({
      title: "Trip joined!",
      description: `You are now a member of "${updatedTrips[tripIndex].name}"`,
    });
    
    return true;
  };

  const selectTrip = (tripId: string) => {
    const trip = trips.find(trip => trip.id === tripId);
    setCurrentTrip(trip || null);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip)
    );
    setCurrentTrip(updatedTrip);
  };

  const addPoll = (tripId: string, poll: Poll) => {
    // Implementation would depend on your poll structure
    toast({
      title: "Poll created",
      description: `Your poll "${poll.title}" has been added to the trip`,
    });
  };

  const voteOnOption = (tripId: string, pollId: string, optionId: string, userId: string) => {
    // Implementation for voting
    toast({
      title: "Vote recorded",
      description: "Your vote has been counted",
    });
  };

  const assignRole = (tripId: string, userId: string, role: string) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== tripId) return trip;
        
        // Update member role
        const updatedMembers = trip.members.map(member => {
          if (member.id === userId) {
            return { ...member, role };
          }
          return member;
        });
        
        return { ...trip, members: updatedMembers };
      });
    });
    
    toast({
      title: "Role assigned",
      description: `Role successfully updated to: ${role}`,
    });
  };

  const addPackingItem = (tripId: string, item: Omit<PackingItem, 'id'>) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== tripId) return trip;
        
        const newItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        };
        
        const updatedPackingList = trip.packingList ? 
          [...trip.packingList, newItem] : [newItem];
        
        return { ...trip, packingList: updatedPackingList };
      });
    });
    
    // Update current trip if it's the active one
    if (currentTrip?.id === tripId) {
      setCurrentTrip(prevTrip => {
        if (!prevTrip) return null;
        
        const newItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        };
        
        const updatedPackingList = prevTrip.packingList ? 
          [...prevTrip.packingList, newItem] : [newItem];
        
        return { ...prevTrip, packingList: updatedPackingList };
      });
    }
    
    toast({
      title: "Item added",
      description: `"${item.name}" added to the packing list`,
    });
  };

  const togglePinItem = (tripId: string, itemId: string) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== tripId || !trip.packingList) return trip;
        
        const updatedPackingList = trip.packingList.map(item => {
          if (item.id === itemId) {
            return { ...item, isPinned: !item.isPinned };
          }
          return item;
        });
        
        return { ...trip, packingList: updatedPackingList };
      });
    });
    
    // Update current trip if it's the active one
    if (currentTrip?.id === tripId) {
      setCurrentTrip(prevTrip => {
        if (!prevTrip || !prevTrip.packingList) return prevTrip;
        
        const updatedPackingList = prevTrip.packingList.map(item => {
          if (item.id === itemId) {
            return { ...item, isPinned: !item.isPinned };
          }
          return item;
        });
        
        return { ...prevTrip, packingList: updatedPackingList };
      });
    }
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      createTrip,
      joinTrip,
      selectTrip,
      updateTrip,
      addPoll,
      voteOnOption,
      assignRole,
      addPackingItem,
      togglePinItem
    }}>
      {children}
    </TripContext.Provider>
  );
};
