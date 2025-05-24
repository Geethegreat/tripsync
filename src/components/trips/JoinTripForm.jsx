
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTrip } from '@/contexts/TripContext';
import { UserPlus } from 'lucide-react';

export const JoinTripForm = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { joinTrip } = useTrip();

  console.log('JoinTripForm rendered');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Join trip form submitted with code:', code);

    try {
      const success = joinTrip(code);
      if (success) {
        setCode('');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error joining trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" /> Join Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join an existing trip</DialogTitle>
          <DialogDescription>
            Enter the invitation code you received to join a trip
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invitation Code</Label>
            <Input
              id="inviteCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              className="text-center uppercase tracking-widest"
              maxLength={8}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-travel-primary hover:bg-travel-secondary"
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? "Joining..." : "Join Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
