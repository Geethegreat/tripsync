
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/contexts/TripContext';
import { Users, Map, Calendar, MapPin, Trash2 } from 'lucide-react';

export const TripList = ({ layout = "grid" }) => {
  const { trips, selectTrip, currentTrip, deleteTrip } = useTrip();

  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

  if (!trips.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted/50 rounded-full p-6 mb-4">
          <Map className="h-12 w-12 text-travel-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">No trips yet</h3>
        <p className="text-muted-foreground mb-4">
          Create a new trip or join one using an invite code
        </p>
      </div>
    );
  }

  if (layout === "sidebar") {
    return (
      <div className="space-y-2">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`rounded-md p-2 cursor-pointer transition-all hover:bg-muted ${
              currentTrip?.id === trip.id ? 'bg-travel-muted border-l-4 border-travel-primary' : ''
            }`}
            onClick={() => selectTrip(trip.id)}
          >
            <div className="flex justify-between items-start">
              <div className="truncate font-medium flex-1 pr-2">
                {trip.name || 'Untitled Trip'}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Badge variant={trip.status === 'confirmed' ? 'default' : 'outline'} className="text-xs">
                  {trip.status === 'planning' ? 'Planning' : 
                  trip.status === 'voting' ? 'Voting' : 'Confirmed'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => handleDeleteTrip(e, trip.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <Users className="h-3 w-3 mr-1" /> 
              {trip.members.length}
              {trip.selectedDestination && (
                <span className="ml-2 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {trip.selectedDestination.name.substring(0, 15)}
                  {trip.selectedDestination.name.length > 15 ? '...' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${
            currentTrip?.id === trip.id ? 'ring-2 ring-travel-primary' : ''
          }`}
          onClick={() => selectTrip(trip.id)}
        >
          <div className="h-2 bg-travel-gradient" />
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="flex-1 pr-2 text-lg leading-tight">
                {trip.name || 'Untitled Trip'}
              </CardTitle>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={trip.status === 'confirmed' ? 'default' : 'outline'}>
                  {trip.status === 'planning' ? 'Planning' : 
                   trip.status === 'voting' ? 'Voting' : 'Confirmed'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 z-10"
                  onClick={(e) => handleDeleteTrip(e, trip.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription className="line-clamp-2">
              {trip.description || 'No description provided'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{trip.members.length} members</span>
              </div>
              
              {trip.selectedDestination && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="line-clamp-1">{trip.selectedDestination.name}</span>
                </div>
              )}
              
              {trip.selectedDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(trip.selectedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full hover:bg-travel-primary hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                selectTrip(trip.id);
              }}
            >
              {currentTrip?.id === trip.id ? 'Currently Selected' : 'View Details'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
