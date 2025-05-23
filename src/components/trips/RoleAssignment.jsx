
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Camera, MapPin, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrip } from '@/contexts/TripContext';

export const RoleAssignment = ({ trip }) => {
  const { user } = useAuth();
  const { assignRole } = useTrip();
  const [selectedRole, setSelectedRole] = useState('');

  const availableRoles = [
    { value: 'photographer', label: 'Photographer', icon: Camera },
    { value: 'navigator', label: 'Navigator', icon: MapPin },
    { value: 'chef', label: 'Chef', icon: Utensils },
    { value: 'organizer', label: 'Organizer', icon: Users },
  ];

  const handleRoleChange = (userId, role) => {
    assignRole(trip.id, userId, role);
  };

  const currentUserRole = trip.members.find(m => m.id === user?.id)?.role;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Trip Roles
        </CardTitle>
        <CardDescription>
          Assign responsibilities for each team member
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Role</h3>
          <Select
            value={currentUserRole || selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              if (user) {
                handleRoleChange(user.id, value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center">
                    <role.icon className="mr-2 h-4 w-4" />
                    {role.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Team Roles</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {trip.members.map(member => (
              <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-travel-primary/20 text-travel-primary">
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  {member.role ? (
                    <p className="text-xs text-muted-foreground">
                      {availableRoles.find(r => r.value === member.role)?.label || member.role}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No role assigned</p>
                  )}
                </div>
                
                {member.id !== user?.id && member.role && (
                  <div className="flex items-center justify-center h-8 w-8 bg-muted rounded-full">
                    {(() => {
                      const RoleIcon = availableRoles.find(r => r.value === member.role)?.icon;
                      return RoleIcon ? <RoleIcon className="h-4 w-4" /> : null;
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
