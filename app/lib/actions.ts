'use server';

import { db } from './firebase';
import { doc, updateDoc, deleteDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { Attempt, Link } from './types';

export async function addAttempt(climbId: string, attempt: Omit<Attempt, 'id'>) {
  const attemptId = Math.random().toString(36).substr(2, 9);
  const newAttempt = {
    id: attemptId,
    ...attempt,
    date: serverTimestamp()
  };

  const climbRef = doc(db, 'climbs', climbId);
  await updateDoc(climbRef, {
    attempts: arrayUnion(newAttempt)
  });

  return {
    ...newAttempt,
    date: new Date()
  };
}

export async function updateAttempt(climbId: string, attempts: Attempt[]) {
  const climbRef = doc(db, 'climbs', climbId);
  await updateDoc(climbRef, { attempts });
}

export async function addLink(climbId: string, linkData: Omit<Link, 'id'>) {
  const linkId = Math.random().toString(36).substr(2, 9);
  const newLink = {
    id: linkId,
    ...linkData
  };

  const climbRef = doc(db, 'climbs', climbId);
  await updateDoc(climbRef, {
    links: arrayUnion(newLink)
  });

  return newLink;
}

export async function markClimbComplete(
  climbId: string, 
  attempt: Omit<Attempt, 'id'>,
  completedAt: Date
) {
  const attemptId = Math.random().toString(36).substr(2, 9);
  const newAttempt = {
    id: attemptId,
    ...attempt,
    date: serverTimestamp()
  };

  const climbRef = doc(db, 'climbs', climbId);
  await updateDoc(climbRef, {
    attempts: arrayUnion(newAttempt),
    completed: true,
    completedAt: serverTimestamp()
  });

  return {
    ...newAttempt,
    date: new Date()
  };
}

export async function markClimbIncomplete(climbId: string, filteredAttempts: Attempt[]) {
  const climbRef = doc(db, 'climbs', climbId);
  await updateDoc(climbRef, {
    completed: false,
    completedAt: null,
    attempts: filteredAttempts
  });
}

export async function deleteClimb(climbId: string) {
  await deleteDoc(doc(db, 'climbs', climbId));
} 