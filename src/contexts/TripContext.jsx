
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

// This is a mock implementation for demo purposes
// In a real app, this would connect to a backend API
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load trips from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedTrips = localStorage.getItem('trip_trio_trips');
      if (storedTrips) {
        const parsedTrips = JSON.parse(storedTrips);
        setTrips(parsedTrips);
        
        // If there's a current trip stored, set it
        const currentTripId = localStorage.getItem('trip_trio_current_trip');
        if (currentTripId) {
          const matchingTrip = parsedTrips.find(trip => trip.id === currentTripId);
          if (matchingTrip) {
            setCurrentTrip(matchingTrip);
          }
        }
      } else {
        // If no trips, initialize with demo data
        initializeDemoData();
      }
    }
  }, [user]);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('trip_trio_trips', JSON.stringify(trips));
    }
    
    // Save current trip id if there is one
    if (currentTrip) {
      localStorage.setItem('trip_trio_current_trip', currentTrip.id);
    } else {
      localStorage.removeItem('trip_trio_current_trip');
    }
  }, [trips, currentTrip]);

  const initializeDemoData = () => {
    if (!user) return;
    
    const mockTrips = [
      {
        id: '1',
        name: 'Summer Beach Vacation',
        description: 'A relaxing beach getaway with friends',
        status: 'planning',
        inviteCode: 'BEACH23',
        members: [
          { id: user.id, name: user.name, avatar: user.avatar, isAdmin: true }
        ],
        dateOptions: [
          { id: 'date1', value: '2025-07-15', votes: [] },
          { id: 'date2', value: '2025-08-01', votes: [] }
        ],
        destinationOptions: [
          { id: 'dest1', value: 'Miami Beach', votes: [] },
          { id: 'dest2', value: 'Cancun', votes: [] }
        ],
        selectedDate: null,
        selectedDestination: null,
        selectedTransport: null,
        packingList: [
          { 
            id: 'item1', 
            name: 'Sunscreen',
            category: 'essentials',
            addedBy: user.id,
            isPinned: true,
            isEssential: true,
            checked: false
          },
          { 
            id: 'item2', 
            name: 'Swimsuit',
            category: 'clothing',
            addedBy: user.id,
            isPinned: false,
            isEssential: false,
            checked: false  
          }
        ]
      },
      {
        id: '2',
        name: 'Mountain Retreat',
        description: 'Hiking and relaxing in the mountains',
        status: 'voting',
        inviteCode: 'MOUNT45',
        members: [
          { id: user.id, name: user.name, avatar: user.avatar, isAdmin: true },
          { 
            id: 'user2', 
            name: 'Alex Johnson', 
            role: 'navigator',
            isAdmin: false
          }
        ],
        dateOptions: [
          { id: 'date3', value: '2025-09-10', votes: [] },
          { id: 'date4', value: '2025-10-01', votes: [] }
        ],
        destinationOptions: [
          { id: 'dest3', value: 'Colorado Rockies', votes: [] },
          { id: 'dest4', value: 'Swiss Alps', votes: [] }
        ],
        selectedDate: null,
        selectedDestination: null,
        selectedTransport: null,
        packingList: [
          { 
            id: 'item3', 
            name: 'Hiking Boots',
            category: 'clothing',
            addedBy: user.id,
            isPinned: false,
            isEssential: true,
            checked: false
          }
        ]
      }
    ];
    
    setTrips(mockTrips);
    setCurrentTrip(mockTrips[0]);
  };

  const selectTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
    }
  };

  const createTrip = (name, description) => {
    if (!user) return;
    
    const newTrip = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      status: 'planning',
      inviteCode: generateInviteCode(),
      members: [
        { id: user.id, name: user.name, avatar: user.avatar, isAdmin: true }
      ],
      dateOptions: [],
      destinationOptions: [],
      selectedDate: null,
      selectedDestination: null,
      selectedTransport: null,
      packingList: []
    };
    
    setTrips([newTrip, ...trips]);
    setCurrentTrip(newTrip);
    
    toast({
      title: "Trip created",
      description: `Your trip "${name}" has been created.`,
    });
    
    return newTrip;
  };

  const joinTrip = (inviteCode) => {
    if (!user) return false;
    
    const tripIndex = trips.findIndex(t => t.inviteCode === inviteCode.toUpperCase());
    
    if (tripIndex === -1) {
      toast({
        title: "Invalid invite code",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if user is already a member
    if (trips[tripIndex].members.some(m => m.id === user.id)) {
      toast({
        title: "Already a member",
        description: "You are already a member of this trip.",
        variant: "destructive",
      });
      return false;
    }
    
    // Add user to trip's members
    const updatedTrips = [...trips];
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      members: [...updatedTrips[tripIndex].members, { 
        id: user.id, 
        name: user.name, 
        avatar: user.avatar,
        isAdmin: false 
      }]
    };
    
    setTrips(updatedTrips);
    setCurrentTrip(updatedTrips[tripIndex]);
    
    toast({
      title: "Trip joined",
      description: `You've joined "${updatedTrips[tripIndex].name}".`,
    });
    
    return true;
  };

  const assignRole = (tripId, userId, role) => {
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) return;
    
    const memberIndex = trips[tripIndex].members.findIndex(m => m.id === userId);
    if (memberIndex === -1) return;
    
    const updatedTrips = [...trips];
    const updatedMembers = [...updatedTrips[tripIndex].members];
    
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      role
    };
    
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      members: updatedMembers
    };
    
    setTrips(updatedTrips);
    
    // Update currentTrip if this trip is the current one
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrips[tripIndex]);
    }
    
    toast({
      title: "Role assigned",
      description: "The role has been assigned successfully.",
    });
    
    return true;
  };

  const addPackingItem = (tripId, newItem) => {
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) return false;
    
    const itemWithId = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      checked: false
    };
    
    const updatedTrips = [...trips];
    
    if (!updatedTrips[tripIndex].packingList) {
      updatedTrips[tripIndex].packingList = [];
    }
    
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      packingList: [...updatedTrips[tripIndex].packingList, itemWithId]
    };
    
    setTrips(updatedTrips);
    
    // Update currentTrip if this trip is the current one
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrips[tripIndex]);
    }
    
    return true;
  };

  const togglePinItem = (tripId, itemId) => {
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) return false;
    
    const updatedTrips = [...trips];
    const packingList = [...updatedTrips[tripIndex].packingList];
    
    const itemIndex = packingList.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;
    
    packingList[itemIndex] = {
      ...packingList[itemIndex],
      isPinned: !packingList[itemIndex].isPinned
    };
    
    updatedTrips[tripIndex] = {
      ...updatedTrips[tripIndex],
      packingList
    };
    
    setTrips(updatedTrips);
    
    // Update currentTrip if this trip is the current one
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrips[tripIndex]);
    }
    
    return true;
  };

  // Helper function to generate random invite code
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      selectTrip,
      createTrip,
      joinTrip,
      assignRole,
      addPackingItem,
      togglePinItem
    }}>
      {children}
    </TripContext.Provider>
  );
};

export { TripContext };
