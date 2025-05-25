
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrip } from '@/contexts/TripContext';
import { Users, Calendar, Map, Utensils, Flag, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PollingSection } from './PollingSection';
import { PackingList } from './PackingList';
import { RoleAssignment } from './RoleAssignment';
import { Itinerary } from './Itinerary';

export const TripDetails = () => {
  const { currentTrip } = useTrip();

  if (!currentTrip) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
        <div className="bg-muted/50 rounded-full p-6 mb-4">
          <Map className="h-12 w-12 text-travel-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">No trip selected</h3>
        <p className="text-muted-foreground mb-4">
          Select a trip from your list or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">{currentTrip.name}</h2>
          {currentTrip.description && (
            <p className="text-muted-foreground mt-1">{currentTrip.description}</p>
          )}
        </div>
        <Badge variant={currentTrip.status === 'confirmed' ? 'default' : 'outline'} className="text-sm">
          {currentTrip.status === 'planning' ? 'Planning' : 
           currentTrip.status === 'voting' ? 'Voting' : 'Confirmed'}
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Trip Members
          </CardTitle>
          <CardDescription>
            {currentTrip.members.length} traveler{currentTrip.members.length !== 1 && 's'} on this trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {currentTrip.members.map(member => (
              <div key={member.id} className="flex flex-col items-center text-center">
                <Avatar className="h-12 w-12 mb-1">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-travel-primary/20 text-travel-primary">
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{member.name}</div>
                {member.role && (
                  <Badge variant="outline" className="mt-1">
                    {member.role}
                  </Badge>
                )}
                {member.isAdmin && (
                  <Badge className="mt-1 bg-travel-primary">Admin</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Invitation Code</span>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-3 py-1 rounded-md font-mono tracking-wider">
                {currentTrip.inviteCode}
              </code>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(currentTrip.inviteCode);
                  // You'd add a toast notification here in a real app
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="planning">
            <Calendar className="h-4 w-4 mr-2" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="packing">
            <Flag className="h-4 w-4 mr-2" />
            Packing
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="itinerary">
            <MapPin className="h-4 w-4 mr-2" />
            Itinerary
          </TabsTrigger>
          <TabsTrigger value="finalize">
            <Utensils className="h-4 w-4 mr-2" />
            Finalize
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning" className="space-y-4">
          <PollingSection trip={currentTrip} />
        </TabsContent>
        
        <TabsContent value="packing" className="space-y-4">
          <PackingList trip={currentTrip} />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <RoleAssignment trip={currentTrip} />
        </TabsContent>
        
        <TabsContent value="itinerary" className="space-y-4">
          <Itinerary trip={currentTrip} />
        </TabsContent>
        
        <TabsContent value="finalize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finalize Trip</CardTitle>
              <CardDescription>
                Generate a summary of your trip planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Ready to finalize your trip? Generate a downloadable PDF summary with all your trip details.
              </p>
              <Button className="w-full bg-travel-primary hover:bg-travel-secondary">
                Generate Trip Summary PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
