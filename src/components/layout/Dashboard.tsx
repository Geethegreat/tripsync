
import React from 'react';
import { TripList } from '../trips/TripList';
import { TripDetails } from '../trips/TripDetails';
import { CreateTripForm } from '../trips/CreateTripForm';
import { JoinTripForm } from '../trips/JoinTripForm';

export const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Trips</h2>
        <div className="flex space-x-2">
          <JoinTripForm />
          <CreateTripForm />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <TripList />
        </div>
        
        <div className="lg:col-span-8">
          <TripDetails />
        </div>
      </div>
    </div>
  );
};
