'use client';

import { Climb } from '@/lib/types';
import { ClimbCard } from './ClimbCard';
import { AddClimbButton } from './AddClimbButton';

interface ClimbsClientProps {
  initialClimbs: Climb[];
  onClimbAdded: (climb: Climb) => void;
  onClimbDeleted: (climbId: string) => void;
}

export function ClimbsClient({ initialClimbs, onClimbAdded, onClimbDeleted }: ClimbsClientProps) {
  if (initialClimbs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          You haven't added any climbs yet.
        </p>
        <AddClimbButton onClimbAdded={onClimbAdded} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {initialClimbs.map((climb) => (
        <ClimbCard 
          key={climb.id} 
          climb={climb}
          onDelete={onClimbDeleted}
        />
      ))}
    </div>
  );
} 