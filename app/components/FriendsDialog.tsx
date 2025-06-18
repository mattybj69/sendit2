'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Spinner } from './ui/spinner';
import { useRouter } from 'next/navigation';
import { UserMinus } from 'lucide-react';

interface Friend {
  id: string;
  email: string;
  name: string;
}

interface FriendData extends DocumentData {
  createdAt: any;
}

interface UserData extends DocumentData {
  email: string;
  name: string;
}

export function FriendsDialog() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadFriends();
    }
  }, [isOpen, user]);

  const loadFriends = async () => {
    if (!user) {
      console.log('No user found, skipping friends load');
      return;
    }

    try {
      console.log('Loading friends for user:', user.uid);
      const friendsRef = collection(db, `users/${user.uid}/friends`);
      console.log('Friends collection path:', `users/${user.uid}/friends`);
      
      const querySnapshot = await getDocs(friendsRef);
      console.log('Found friends documents:', querySnapshot.size);
      
      const friendsData: Friend[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const friendId = docSnapshot.id;
        console.log('Processing friend:', friendId);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', friendId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            console.log('Found user data for friend:', userData);
            friendsData.push({
              id: friendId,
              email: userData.email,
              name: userData.name,
            });
          } else {
            console.log('No user document found for friend:', friendId);
          }
        } catch (err) {
          console.error('Error fetching user data for friend:', friendId, err);
        }
      }
      
      console.log('Final friends list:', friendsData);
      setFriends(friendsData);
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Failed to load friends. Please try again.');
    }
  };

  const handleAddFriend = async () => {
    if (!user || !searchEmail) return;
    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching for user with email:', searchEmail);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', searchEmail.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No user found with email:', searchEmail);
        setError('User not found');
        return;
      }

      const friendDoc = querySnapshot.docs[0];
      const friendId = friendDoc.id;
      const friendData = friendDoc.data() as UserData;
      console.log('Found user:', friendId, friendData);

      if (friendId === user.uid) {
        setError('You cannot add yourself as a friend');
        return;
      }

      // Check if friendship already exists
      const friendDocRef = doc(db, `users/${user.uid}/friends/${friendId}`);
      const existingFriend = await getDoc(friendDocRef);

      if (existingFriend.exists()) {
        setError('You are already friends with this user');
        return;
      }

      console.log('Adding friend relationship');
      // Add friend to current user's friends subcollection
      await setDoc(friendDocRef, {
        createdAt: serverTimestamp(),
      });

      // Add current user to friend's friends subcollection
      const reverseFriendDocRef = doc(db, `users/${friendId}/friends/${user.uid}`);
      await setDoc(reverseFriendDocRef, {
        createdAt: serverTimestamp(),
      });

      // Add friend to the list immediately
      setFriends(prev => [...prev, {
        id: friendId,
        email: friendData.email,
        name: friendData.name,
      }]);

      setSearchEmail('');
    } catch (err) {
      console.error('Error adding friend:', err);
      setError('Failed to add friend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      console.log('Removing friend:', friendId);
      // Remove friend from current user's friends subcollection
      const friendDocRef = doc(db, `users/${user.uid}/friends/${friendId}`);
      await deleteDoc(friendDocRef);

      // Remove current user from friend's friends subcollection
      const reverseFriendDocRef = doc(db, `users/${friendId}/friends/${user.uid}`);
      await deleteDoc(reverseFriendDocRef);

      // Remove friend from the list immediately
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Failed to remove friend. Please try again.');
    }
  };

  const handleViewFriendClimbs = (friendId: string) => {
    router.push(`/climbs/${friendId}`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Friends</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="friends-dialog-description">
        <DialogHeader>
          <DialogTitle>Friends</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p id="friends-dialog-description" className="sr-only">
            Manage your friends list and view their climbs
          </p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
            />
            <Button 
              onClick={handleAddFriend}
              disabled={isLoading || !searchEmail}
            >
              {isLoading ? <Spinner className="h-4 w-4" /> : 'Add'}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => handleViewFriendClimbs(friend.id)}
              >
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">{friend.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleRemoveFriend(friend.id, e)}
                  className="h-8 w-8"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {friends.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No friends yet. Add some friends to see their climbs!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 