'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClimbsHeader } from '../components/ClimbsHeader';
import { Spinner } from '../components/ui/spinner';
import { getUserClimbsClient } from '@/lib/queries';
import { Climb } from '@/lib/types';
import { ClimbsClient } from '../components/ClimbsClient';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddClimbDialog } from '../components/AddClimbDialog';
import { Button } from '../components/ui/button';

export default function ClimbsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchClimbs = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      setError(null);
      const data = await getUserClimbsClient(user.uid);
      console.log('Fetched climbs from Firestore:', data);
      setClimbs(data);
      setTimeout(() => {
        console.log('Climbs state after setClimbs:', data);
      }, 100);
    } catch (err) {
      setError('Failed to load climbs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchClimbs();
    }
  }, [user, fetchClimbs]);

  const handleAddClimb = async (newClimb: Climb) => {
    if (!user) return;
    const { id, ...climbData } = newClimb;
    await addDoc(collection(db, 'climbs'), { ...climbData, userId: user.uid });
    await fetchClimbs();
  };

  const handleDeleteClimb = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'climbs', id));
    await fetchClimbs();
  };

  const handleEditClimb = async (updatedClimb: Climb) => {
    if (!user) return;
    const { id, ...climbData } = updatedClimb;
    await updateDoc(doc(db, 'climbs', id), climbData);
    await fetchClimbs();
  };

  if (loading || isLoading) {
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
        <ClimbsHeader />
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New Climb
          </Button>
        </div>
        <AddClimbDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddClimb}
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <ClimbsClient 
          initialClimbs={climbs}
          onAddClimb={handleAddClimb}
          onDeleteClimb={handleDeleteClimb}
          onEditClimb={handleEditClimb}
        />
      </div>
    </div>
  );
} 