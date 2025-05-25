
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, MapPin, Plus } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface ItineraryProps {
  trip: Trip;
}

export const Itinerary = ({ trip }: ItineraryProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2" />
            Trip Map & Itinerary
          </CardTitle>
          <CardDescription>
            Plan your route and add points of interest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Map placeholder */}
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Interactive map will be displayed here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add destinations and plan your route
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Itinerary</CardTitle>
          <CardDescription>
            Planned activities and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trip.selectedDate ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Start planning your itinerary for {new Date(trip.selectedDate).toLocaleDateString()}
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Activity
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Select trip dates in the Planning tab to start creating your itinerary
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
