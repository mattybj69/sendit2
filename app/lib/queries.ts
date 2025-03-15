'use server';

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

export async function getUserClimbs(userId: string): Promise<Climb[]> {
  const climbsRef = collection(db, 'climbs');
  const q = query(climbsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data()
  } as Climb));
}

export async function getClimb(climbId: string): Promise<Climb | null> {
  const docRef = doc(db, 'climbs', climbId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...convertTimestampsToDates(docSnap.data())
  } as Climb;
} 