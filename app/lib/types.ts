import { Timestamp } from 'firebase/firestore';

export type ClimbType = "all" | "boulder" | "sport" | "trad"

export interface Attempt {
  id: string;
  date: Date;
  notes: string;
}

export interface Link {
  id: string;
  name: string;
  url: string;
}

export interface Climb {
  id: string;
  name: string;
  type: ClimbType;
  grade: string;
  location: string;
  attempts: Attempt[];
  completed: boolean;
  completedAt?: Date;
  links?: Link[];
  city?: string;
  state?: string;
  country?: string;
}

export interface User {
  name: string;
  email: string;
  createdAt: Date | Timestamp;
} 