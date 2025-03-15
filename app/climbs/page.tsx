'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClimbsHeader } from '../components/ClimbsHeader';
import { Spinner } from '../components/ui/spinner';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { getUserClimbs } from '@/lib/queries';
import { Climb } from '@/lib/types';
import { ClimbsClient } from '../components/ClimbsClient';
import { auth } from "@/lib/firebase";

export default function ClimbsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchClimbs() {
      if (!user) return;
      try {
        const data = await getUserClimbs(user.uid);
        setClimbs(data);
      } catch (error) {
        console.error('Error fetching climbs:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchClimbs();
    }
  }, [user]);

  const handleClimbAdded = useCallback((newClimb: Climb) => {
    setClimbs(prev => [newClimb, ...prev]);
  }, []);

  const handleClimbDeleted = useCallback((climbId: string) => {
    setClimbs(prev => prev.filter(climb => climb.id !== climbId));
  }, []);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-6">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto py-6">
        <ClimbsHeader onClimbAdded={handleClimbAdded} />
        <ClimbsClient 
          initialClimbs={climbs} 
          onClimbAdded={handleClimbAdded}
          onClimbDeleted={handleClimbDeleted}
        />
      </div>
    </div>
  );
} 