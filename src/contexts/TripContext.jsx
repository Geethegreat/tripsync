
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

// Mock trip data for demo purposes
// In a real app, this would use an actual backend service or API
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load trips from localStorage on mount
    const storedTrips = localStorage.getItem('tripsync_trips');
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    } else {
      // Set some demo trips if none exist
      const demoTrips = generateDemoTrips();
      setTrips(demoTrips);
      localStorage.setItem('tripsync_trips', JSON.stringify(demoTrips));
    }

    // Load current trip if exists
    const storedCurrentTrip = localStorage.getItem('tripsync_current_trip');
    if (storedCurrentTrip) {
      const tripId = JSON.parse(storedCurrentTrip);
      const tripsArray = storedTrips ? JSON.parse(storedTrips) : generateDemoTrips();
      const trip = tripsArray.find(t => t.id === tripId);
      if (trip) setCurrentTrip(trip);
    }
  }, []);

  // Generate random invite code (for demo)
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create a new trip
  const createTrip = (name, description) => {
    const user = JSON.parse(localStorage.getItem('tripsync_user') || '{}');
    
    const newTrip = {
      id: `trip-${Date.now()}`,
      name,
      description,
      status: 'planning',
      createdAt: new Date().toISOString(),
      inviteCode: generateInviteCode(),
      dateOptions: [],
      destinationOptions: [],
      transportOptions: [],
      members: [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          isAdmin: true,
          role: null
        }
      ],
      packingList: []
    };

    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    setCurrentTrip(newTrip);
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
    localStorage.setItem('tripsync_current_trip', JSON.stringify(newTrip.id));
    
    toast({
      title: "Trip created!",
      description: `Your trip "${name}" has been created.`,
    });

    return newTrip;
  };

  // Join a trip with invite code
  const joinTrip = (code) => {
    const foundTrip = trips.find(trip => 
      trip.inviteCode.toLowerCase() === code.toLowerCase()
    );

    if (!foundTrip) {
      toast({
        title: "Invalid code",
        description: "Could not find a trip with that invitation code.",
        variant: "destructive",
      });
      return false;
    }

    const user = JSON.parse(localStorage.getItem('tripsync_user') || '{}');
    
    // Check if user is already a member
    if (foundTrip.members.some(member => member.id === user.id)) {
      selectTrip(foundTrip.id);
      toast({
        title: "Trip selected",
        description: `You're already a member of "${foundTrip.name}".`,
      });
      return true;
    }

    // Add user to trip members
    const updatedTrip = {
      ...foundTrip,
      members: [
        ...foundTrip.members,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          isAdmin: false,
          role: null
        }
      ]
    };

    const updatedTrips = trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    );

    setTrips(updatedTrips);
    setCurrentTrip(updatedTrip);
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
    localStorage.setItem('tripsync_current_trip', JSON.stringify(updatedTrip.id));
    
    toast({
      title: "Trip joined!",
      description: `You've successfully joined "${updatedTrip.name}".`,
    });

    return true;
  };

  // Select a trip to view/edit
  const selectTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      localStorage.setItem('tripsync_current_trip', JSON.stringify(tripId));
    }
  };

  // Delete a trip
  const deleteTrip = (tripId) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    
    // If the deleted trip was the current trip, clear current trip
    if (currentTrip?.id === tripId) {
      setCurrentTrip(null);
      localStorage.removeItem('tripsync_current_trip');
    }
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
    
    toast({
      title: "Trip deleted",
      description: "The trip has been successfully deleted",
    });
  };

  // Add packing item
  const addPackingItem = (tripId, item) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isChecked: false,
    };

    const updatedTrip = {
      ...trip,
      packingList: [
        ...trip.packingList || [],
        newItem
      ]
    };

    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrip);
    }
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
  };

  // Toggle pin status of a packing item
  const togglePinItem = (tripId, itemId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.packingList) return;

    const updatedPackingList = trip.packingList.map(item => 
      item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
    );

    const updatedTrip = { ...trip, packingList: updatedPackingList };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    
    setTrips(updatedTrips);
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrip);
    }
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
  };

  // Assign role to a trip member
  const assignRole = (tripId, userId, role) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedMembers = trip.members.map(member => 
      member.id === userId ? { ...member, role } : member
    );

    const updatedTrip = { ...trip, members: updatedMembers };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    
    setTrips(updatedTrips);
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(updatedTrip);
    }
    
    localStorage.setItem('tripsync_trips', JSON.stringify(updatedTrips));
  };

  // Generate demo trips
  const generateDemoTrips = () => {
    const user = JSON.parse(localStorage.getItem('tripsync_user') || '{}');
    if (!user.id) return [];

    return [
      {
        id: 'trip-1',
        name: 'Summer Beach Vacation',
        description: 'Two-week getaway to the coast',
        status: 'planning',
        createdAt: '2025-03-15T12:00:00Z',
        inviteCode: 'BEACH23',
        dateOptions: [
          { id: 'date-1', value: 'July 15-30, 2025', votes: [{userId: user.id}] },
          { id: 'date-2', value: 'August 1-15, 2025', votes: [] }
        ],
        destinationOptions: [
          { id: 'dest-1', value: 'Malibu, CA', votes: [{userId: user.id}] },
          { id: 'dest-2', value: 'San Diego, CA', votes: [] }
        ],
        transportOptions: [
          { id: 'trans-1', value: 'Car', votes: [{userId: user.id}] }
        ],
        members: [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isAdmin: true,
            role: 'organizer'
          },
          {
            id: 'user-2',
            name: 'Alex Johnson',
            avatar: null,
            isAdmin: false,
            role: 'photographer'
          }
        ],
        packingList: [
          { 
            id: 'pack-1', 
            name: 'Sunscreen', 
            category: 'essentials', 
            addedBy: user.id, 
            isPinned: true, 
            isChecked: false,
            isEssential: true,
            createdAt: '2025-03-16T10:00:00Z'
          },
          { 
            id: 'pack-2', 
            name: 'Beach towel', 
            category: 'essentials', 
            addedBy: user.id, 
            isPinned: false, 
            isChecked: false,
            isEssential: true,
            createdAt: '2025-03-16T10:05:00Z'
          },
          { 
            id: 'pack-3', 
            name: 'Swimsuit', 
            category: 'clothing', 
            addedBy: user.id, 
            isPinned: true, 
            isChecked: true,
            isEssential: false,
            createdAt: '2025-03-16T10:10:00Z'
          }
        ],
        selectedDestination: null,
        selectedDate: null
      },
      {
        id: 'trip-2',
        name: 'Mountain Hiking Trip',
        description: 'Weekend hiking adventure',
        status: 'confirmed',
        createdAt: '2025-02-20T15:30:00Z',
        inviteCode: 'MOUNT45',
        dateOptions: [],
        destinationOptions: [],
        transportOptions: [],
        members: [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            isAdmin: false,
            role: 'navigator'
          },
          {
            id: 'user-3',
            name: 'Sam Wilson',
            avatar: null,
            isAdmin: true,
            role: 'organizer'
          }
        ],
        packingList: [
          { 
            id: 'pack-4', 
            name: 'Hiking boots', 
            category: 'essentials', 
            addedBy: 'user-3', 
            isPinned: true, 
            isChecked: false,
            isEssential: true,
            createdAt: '2025-02-21T09:00:00Z'
          }
        ],
        selectedDestination: { name: 'Yosemite National Park' },
        selectedDate: '2025-06-10T00:00:00Z'
      }
    ];
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      createTrip,
      joinTrip,
      selectTrip,
      deleteTrip,
      addPackingItem,
      togglePinItem,
      assignRole
    }}>
      {children}
    </TripContext.Provider>
  );
};
