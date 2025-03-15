'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Climb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface AddClimbFormProps {
  isOpen: boolean;
  onClose: () => void;
  onClimbAdded: (climb: Climb) => void;
}

export function AddClimbForm({ isOpen, onClose, onClimbAdded }: AddClimbFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [type, setType] = useState<'Boulder' | 'Sport' | 'Trad'>('Boulder');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const newClimb = {
        userId: user.uid,
        name: name.trim(),
        grade: grade.trim(),
        type,
        location: location.trim(),
        attempts: [],
        links: [],
        completed: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'climbs'), newClimb);
      
      onClimbAdded({
        id: docRef.id,
        ...newClimb,
        createdAt: new Date(), // Use current date for client-side display
      } as Climb);

      setName('');
      setGrade('');
      setType('Boulder');
      setLocation('');
      onClose();
    } catch (error) {
      console.error('Error adding climb:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Climb</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter climb name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., V5, 5.10a"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as 'Boulder' | 'Sport' | 'Trad')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boulder">Boulder</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Trad">Trad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Adding...
              </>
            ) : (
              'Add Climb'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 