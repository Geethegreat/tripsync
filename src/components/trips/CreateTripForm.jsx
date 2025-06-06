
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTrip } from '@/contexts/TripContext';
import { Plus } from 'lucide-react';

export const CreateTripForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createTrip } = useTrip();

  console.log('CreateTripForm rendered');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const description = formData.get('description');

    console.log('Form submitted with:', { name, description });

    try {
      createTrip(name, description);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsSubmitting(false);
    }

      // fetch('http://localhost:6969/create-trip', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, description })
      // });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-travel-primary hover:bg-travel-secondary">
          <Plus className="mr-2 h-4 w-4" /> Create Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new trip</DialogTitle>
          <DialogDescription>
            Fill in the details to start planning your adventure
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Trip Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Summer Getaway 2025"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell your fellow travelers what this trip is about..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              className="bg-travel-primary hover:bg-travel-secondary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
