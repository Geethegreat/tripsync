
import React from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { TripList } from '../trips/TripList';
import { MapPin, Route, LayoutDashboard, List } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';

export const SidebarLayout = ({ children }) => {
  const { currentTrip } = useTrip();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Your Trips</h2>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <List className="mr-2" size={16} />
                Trip List
              </SidebarGroupLabel>
              <div className="px-2">
                <TripList layout="sidebar" />
              </div>
            </SidebarGroup>
            
            {currentTrip && (
              <SidebarGroup>
                <SidebarGroupLabel>
                  <MapPin className="mr-2" size={16} />
                  Current Trip
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Trip Details">
                      <Route size={18} />
                      <span>Trip Details</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
