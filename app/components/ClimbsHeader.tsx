'use client';

import { AddClimbButton } from './AddClimbButton';
import { Climb } from '@/lib/types';

interface ClimbsHeaderProps {
  onClimbAdded: (climb: Climb) => void;
}

export function ClimbsHeader({ onClimbAdded }: ClimbsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">My Climbs</h1>
      <AddClimbButton onClimbAdded={onClimbAdded} />
    </div>
  );
} 