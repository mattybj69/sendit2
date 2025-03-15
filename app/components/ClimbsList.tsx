'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { getUserClimbs } from '@/lib/queries';
import { Climb } from '@/lib/types';
import { ClimbCard } from './ClimbCard';
import { AddClimbButton } from './AddClimbButton';

export function ClimbsList() {
  const { user } = useAuth();
  const [climbs, setClimbs] = useState<Climb[]>([]);

  useEffect(() => {
    async function fetchClimbs() {
      if (!user) return;
      const climbsData = await getUserClimbs(user.uid);
      setClimbs(climbsData);
    }

    fetchClimbs();
  }, [user]);

  const handleDeleteClimb = (climbId: string) => {
    setClimbs(prev => prev.filter(climb => climb.id !== climbId));
  };

  const handleClimbAdded = useCallback((newClimb: Climb) => {
    setClimbs(prev => [newClimb, ...prev]);
  }, []);

  if (climbs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          You haven't added any climbs yet.
        </p>
        <AddClimbButton onClimbAdded={handleClimbAdded} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {climbs.map((climb) => (
        <ClimbCard 
          key={climb.id} 
          climb={climb}
          onDelete={handleDeleteClimb}
        />
      ))}
    </div>
  );
} 