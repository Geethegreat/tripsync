
import React, { useState } from 'react';
import { Trip } from '@/contexts/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, MapPin, Bike, Car, Plane, Train } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface PollingSectionProps {
  trip: Trip;
}

export const PollingSection: React.FC<PollingSectionProps> = ({ trip }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [destination, setDestination] = useState('');
  const [transport, setTransport] = useState<string | null>(null);

  const transports = [
    { icon: Car, name: 'Car' },
    { icon: Plane, name: 'Plane' },
    { icon: Train, name: 'Train' },
    { icon: Bike, name: 'Bike' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Trip Dates
          </CardTitle>
          <CardDescription>
            Propose or vote on potential travel dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Propose a date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                className="w-full bg-travel-primary hover:bg-travel-secondary"
                disabled={!date}
              >
                Propose Date
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Proposed Dates</h4>
              {trip.dateOptions && trip.dateOptions.length > 0 ? (
                <ul className="space-y-2">
                  {trip.dateOptions.map(option => (
                    <li key={option.id} className="flex items-center justify-between">
                      <span>{option.value}</span>
                      <Button size="sm" variant="outline">
                        Vote ({option.votes.length})
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No dates proposed yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Destinations
          </CardTitle>
          <CardDescription>
            Suggest and vote on destinations for this trip
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Propose a destination</Label>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
              />
              <Button
                className="w-full bg-travel-primary hover:bg-travel-secondary"
                disabled={!destination.trim()}
              >
                Propose Destination
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Proposed Destinations</h4>
              {trip.destinationOptions && trip.destinationOptions.length > 0 ? (
                <ul className="space-y-2">
                  {trip.destinationOptions.map(option => (
                    <li key={option.id} className="flex items-center justify-between">
                      <span>{option.value}</span>
                      <Button size="sm" variant="outline">
                        Vote ({option.votes.length})
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No destinations proposed yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Transportation
          </CardTitle>
          <CardDescription>
            Choose how you want to travel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {transports.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 ${
                  transport === item.name
                    ? "bg-travel-primary/10 border-travel-primary"
                    : ""
                }`}
                onClick={() => setTransport(item.name)}
              >
                <item.icon className="h-8 w-8" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>
          
          <Button
            className="w-full mt-4 bg-travel-primary hover:bg-travel-secondary"
            disabled={!transport}
          >
            Propose Transportation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
