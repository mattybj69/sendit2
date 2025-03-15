'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { AddClimbForm } from './AddClimbForm';
import { Climb } from '@/lib/types';

interface AddClimbButtonProps {
  onClimbAdded?: (climb: Climb) => void;
}

export function AddClimbButton({ onClimbAdded }: AddClimbButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Add New Climb
      </Button>

      <AddClimbForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onClimbAdded={(climb) => {
          setIsOpen(false);
          onClimbAdded?.(climb);
        }}
      />
    </>
  );
} 