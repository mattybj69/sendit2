'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Attempt } from '@/lib/types';

interface EditAttemptFormProps {
  attempt: Attempt;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attemptId: string, notes: string) => void;
}

export function EditAttemptForm({ attempt, isOpen, onClose, onSubmit }: EditAttemptFormProps) {
  const [notes, setNotes] = useState(attempt.notes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(attempt.id, notes.trim());
      onClose();
    } catch (error) {
      console.error('Error updating attempt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Attempt #{attempt.index}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {attempt.date instanceof Date 
                ? attempt.date.toLocaleDateString()
                : new Date(attempt.date.seconds * 1000).toLocaleDateString()}
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
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
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 