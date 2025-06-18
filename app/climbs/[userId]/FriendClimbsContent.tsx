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

export function FriendClimbsContent({ userId }: { userId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendName, setFriendName] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    async function loadData() {
      if (!user) return;
      
      try {
        setError(null);
        
        // Verify friend relationship
        const friendDoc = await getDoc(doc(db, 'users', user.uid, 'friends', userId));
        if (!friendDoc.exists()) {
          setError('You are not authorized to view these climbs');
          setIsLoading(false);
          return;
        }

        // Get friend's name
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setFriendName(userDoc.data().name);
        }

        // Get friend's climbs
        const data = await getUserClimbsClient(userId);
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
  }, [user, loading, router, userId]);

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
          isReadOnly={true}
        />
      </div>
    </div>
  );
} 