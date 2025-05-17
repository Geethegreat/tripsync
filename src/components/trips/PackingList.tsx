import React, { useState } from 'react';
import { Trip, useTrip } from '@/contexts/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, Plus, Umbrella } from 'lucide-react';

interface PackingListProps {
  trip: Trip;
}

export const PackingList: React.FC<PackingListProps> = ({ trip }) => {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('essentials');
  const { addPackingItem, togglePinItem } = useTrip();

  const categories = [
    { value: 'essentials', label: 'Essentials' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'toiletries', label: 'Toiletries' },
    { value: 'documents', label: 'Documents' },
    { value: 'misc', label: 'Miscellaneous' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (itemName.trim() === '') return;
    
    const user = JSON.parse(localStorage.getItem('trip_trio_user') || '{}');
    
    addPackingItem(trip.id, {
      name: itemName,
      category: itemCategory,
      addedBy: user.id,
      isPinned: false,
      isEssential: itemCategory === 'essentials',
    });
    
    setItemName('');
  };

  const groupedItems = trip.packingList?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof trip.packingList>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flag className="mr-2 h-5 w-5" />
            Packing List
          </CardTitle>
          <CardDescription>
            Add and organize items to bring on your trip
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Add an item to pack..."
              />
            </div>
            <Select value={itemCategory} onValueChange={setItemCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={!itemName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          
          {trip.packingList && trip.packingList.length > 0 ? (
            <div className="space-y-6">
              {/* Pinned items section */}
              {trip.packingList.some(item => item.isPinned) && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Umbrella className="mr-2 h-4 w-4 text-travel-primary" />
                    Pinned Items
                  </h4>
                  <div className="border rounded-md p-3 bg-travel-primary/5">
                    <ul className="space-y-2">
                      {trip.packingList
                        .filter(item => item.isPinned)
                        .map(item => (
                          <li key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Checkbox id={`pinned-${item.id}`} className="mr-2" />
                              <label htmlFor={`pinned-${item.id}`} className="text-sm font-medium">
                                {item.name}
                              </label>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePinItem(trip.id, item.id)}
                            >
                              Unpin
                            </Button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Other items by category */}
              {groupedItems && Object.entries(groupedItems).map(([category, items]) => {
                const categoryLabel = categories.find(c => c.value === category)?.label || category;
                const nonPinnedItems = items?.filter(item => !item.isPinned);
                
                if (!nonPinnedItems || nonPinnedItems.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="font-medium mb-2 capitalize">{categoryLabel}</h4>
                    <ul className="space-y-2">
                      {nonPinnedItems.map(item => (
                        <li key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox id={`item-${item.id}`} className="mr-2" />
                            <label htmlFor={`item-${item.id}`} className="text-sm font-medium">
                              {item.name}
                            </label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePinItem(trip.id, item.id)}
                          >
                            Pin
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Umbrella className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <p className="mt-2 text-muted-foreground">No items in your packing list yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
