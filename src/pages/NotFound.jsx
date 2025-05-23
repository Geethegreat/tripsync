
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <div className="bg-muted/30 rounded-full p-8 mb-6">
        <MapPin className="h-16 w-16 text-travel-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        It seems you've wandered off the trail!
      </p>
      
      <Button asChild className="bg-travel-primary hover:bg-travel-secondary">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
