import { Timestamp } from 'firebase/firestore';

export interface Attempt {
  id: string;
  index: number;
  date: Date | Timestamp;
  notes: string;
}

export interface Link {
  id: string;
  name: string;
  url: string;
}

export interface Climb {
  id: string;
  userId: string;
  name: string;
  grade: string;
  type: 'Boulder' | 'Sport' | 'Trad';
  location: string;
  attempts: Attempt[];
  links: Link[];
  createdAt: Date | Timestamp;
  completed: boolean;
  completedAt?: Date | Timestamp;
}

export interface User {
  name: string;
  email: string;
  createdAt: Date | Timestamp;
} 