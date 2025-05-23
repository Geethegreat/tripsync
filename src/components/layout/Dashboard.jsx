
import React from 'react';
import { TripDetails } from '../trips/TripDetails';
import { CreateTripForm } from '../trips/CreateTripForm';
import { JoinTripForm } from '../trips/JoinTripForm';
import { SidebarLayout } from './SidebarLayout';

export const Dashboard = () => {
  return (
    <SidebarLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Trip Dashboard</h2>
          <div className="flex space-x-2">
            <JoinTripForm />
            <CreateTripForm />
          </div>
        </div>
        
        <div className="w-full">
          <TripDetails />
        </div>
      </div>
    </SidebarLayout>
  );
};
