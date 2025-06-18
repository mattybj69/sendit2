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

const validateGrade = (type: 'Boulder' | 'Sport' | 'Trad', grade: string): boolean => {
  if (type === 'Boulder') {
    // V grade format (V0-V17)
    return /^V([0-9]|1[0-7])$/.test(grade);
  } else if (type === 'Sport') {
    // Australian sport grade format (1-35)
    const num = parseInt(grade);
    return !isNaN(num) && num >= 1 && num <= 35;
  }
  // For Trad, we'll accept any grade for now
  return true;
};

export function AddClimbForm({ isOpen, onClose, onClimbAdded }: AddClimbFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [type, setType] = useState<'Boulder' | 'Sport' | 'Trad'>('Boulder');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const handleTypeChange = (newType: 'Boulder' | 'Sport' | 'Trad') => {
    setType(newType);
    setGrade(''); // Clear grade when type changes
    setGradeError(null);
  };

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    if (!validateGrade(type, newGrade)) {
      setGradeError(
        type === 'Boulder' 
          ? 'Please enter a valid V grade (e.g., V0, V1, V2, etc.)'
          : 'Please enter a valid sport grade (1-35)'
      );
    } else {
      setGradeError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateGrade(type, grade)) {
      setGradeError('Please enter a valid grade');
      return;
    }

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
              placeholder="Climb name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value: 'Boulder' | 'Sport' | 'Trad') => handleTypeChange(value)}
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
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              placeholder={type === 'Boulder' ? 'V0' : '1'}
              required
            />
            {gradeError && (
              <p className="text-sm text-destructive">{gradeError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Crag or gym name"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !!gradeError}
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