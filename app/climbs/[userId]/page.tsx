'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '../../components/ui/spinner';
import { getUserClimbsClient } from '@/lib/queries';
import { Climb } from '@/lib/types';
import { ClimbsClient } from '../../components/ClimbsClient';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { use } from 'react';

export default function FriendClimbsPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendName, setFriendName] = useState<string>('');

  const handleAddClimb = async (newClimb: Climb) => {
    try {
      // Refresh the climbs list after adding
      const data = await getUserClimbsClient(resolvedParams.userId);
      setClimbs(data);
    } catch (err) {
      console.error('Error refreshing climbs:', err);
      setError('Failed to refresh climbs');
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setError(null);
        
        // Get friend's name
        const userDoc = await getDoc(doc(db, 'users', resolvedParams.userId));
        if (userDoc.exists()) {
          setFriendName(userDoc.data().name);
        }

        // Get friend's climbs
        const data = await getUserClimbsClient(resolvedParams.userId);
        setClimbs(data);
      } catch (err) {
        console.error('Error loading friend climbs:', err);
        setError('Failed to load climbs');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, resolvedParams.userId]);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{friendName}'s Climbs</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <ClimbsClient 
          initialClimbs={climbs}
          isReadOnly={resolvedParams.userId !== user.uid}
          onAddClimb={handleAddClimb}
        />
      </div>
    </div>
  );
} 