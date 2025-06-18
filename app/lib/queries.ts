'use client';

import { collection, query, where, getDocs, doc, getDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Climb } from './types';

function convertTimestampsToDates(data: any) {
  if (!data) return data;
  
  const converted = { ...data };
  
  // Convert top-level timestamps
  if (converted.createdAt?.seconds) {
    converted.createdAt = new Date(converted.createdAt.seconds * 1000);
  }
  if (converted.completedAt?.seconds) {
    converted.completedAt = new Date(converted.completedAt.seconds * 1000);
  }
  
  // Convert timestamps in attempts
  if (Array.isArray(converted.attempts)) {
    converted.attempts = converted.attempts.map((attempt: any) => ({
      ...attempt,
      date: attempt.date?.seconds ? new Date(attempt.date.seconds * 1000) : attempt.date
    }));
  }
  
  return converted;
}

// Server-side function for initial data fetch
export async function getUserClimbsServer(userId: string): Promise<Climb[]> {
  try {
    const climbsRef = collection(db, 'climbs');
    const q = query(climbsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...convertTimestampsToDates(doc.data())
    } as Climb));
  } catch (error) {
    console.error('Error fetching climbs:', error);
    throw error;
  }
}

// Client-side function for real-time updates
export async function getUserClimbsClient(userId: string): Promise<Climb[]> {
  try {
    const climbsRef = collection(db, 'climbs');
    const q = query(climbsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...convertTimestampsToDates(doc.data())
    } as Climb));
  } catch (error) {
    console.error('Error fetching climbs:', error);
    throw error;
  }
}

export async function getClimb(climbId: string): Promise<Climb | null> {
  try {
    const docRef = doc(db, 'climbs', climbId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...convertTimestampsToDates(docSnap.data())
    } as Climb;
  } catch (error) {
    console.error('Error fetching climb:', error);
    throw error;
  }
} 