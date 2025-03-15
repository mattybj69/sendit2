'use client';

import { useState } from 'react';
import { doc, updateDoc, arrayUnion, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Climb, Link } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ClimbDetailCard } from './ClimbDetailCard';
import { AddLinkForm } from './AddLinkForm';
import { AttemptForm } from './AttemptForm';
import { cn } from '@/lib/utils';
import { ExternalLink, Trophy } from 'lucide-react';

interface ClimbCardProps {
  climb: Climb;
  onDelete: (climbId: string) => void;
}

const typeColors = {
  Boulder: 'bg-destructive/10 text-destructive border-destructive/20',
  Sport: 'bg-blue-100 text-blue-700 border-blue-200',
  Trad: 'bg-emerald-100 text-emerald-700 border-emerald-200'
} as const;

export function ClimbCard({ climb, onDelete }: ClimbCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isSendItFormOpen, setIsSendItFormOpen] = useState(false);
  const [localClimb, setLocalClimb] = useState(climb);

  const handleAddAttempt = async (data: { date: Date; notes: string }) => {
    try {
      const attemptId = Math.random().toString(36).substr(2, 9);
      const newAttempt = {
        id: attemptId,
        index: localClimb.attempts.length + 1,
        ...data
      };

      // Update Firestore
      const climbRef = doc(db, 'climbs', climb.id);
      await updateDoc(climbRef, {
        attempts: arrayUnion(newAttempt)
      });

      // Update local state
      setLocalClimb(prev => ({
        ...prev,
        attempts: [...prev.attempts, newAttempt]
      }));
    } catch (error) {
      console.error('Error adding attempt:', error);
      throw error;
    }
  };

  const handleAddLink = async (data: { name: string; url: string }) => {
    try {
      const linkId = Math.random().toString(36).substr(2, 9);
      const newLink: Link = {
        id: linkId,
        ...data
      };

      // Update Firestore
      const climbRef = doc(db, 'climbs', climb.id);
      await updateDoc(climbRef, {
        links: arrayUnion(newLink)
      });

      // Update local state
      setLocalClimb(prev => ({
        ...prev,
        links: [...(prev.links || []), newLink]
      }));
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  };

  const handleSendIt = async (data: { date: Date; notes: string }) => {
    try {
      const now = data.date;
      const attemptId = Math.random().toString(36).substr(2, 9);
      const newAttempt = {
        id: attemptId,
        index: localClimb.attempts.length + 1,
        date: now,
        notes: `Sent it! 🎉 ${data.notes}`
      };

      // Update Firestore
      const climbRef = doc(db, 'climbs', climb.id);
      await updateDoc(climbRef, {
        attempts: arrayUnion(newAttempt),
        completed: true,
        completedAt: now
      });

      // Update local state
      setLocalClimb(prev => ({
        ...prev,
        attempts: [...prev.attempts, newAttempt],
        completed: true,
        completedAt: now
      }));
    } catch (error) {
      console.error('Error marking climb as complete:', error);
    }
  };

  const handleUnsend = async () => {
    try {
      // Filter out the send completion attempt
      const filteredAttempts = localClimb.attempts.filter(attempt => !attempt.notes.startsWith('Sent it! 🎉'));

      // Update Firestore
      const climbRef = doc(db, 'climbs', climb.id);
      await updateDoc(climbRef, {
        completed: false,
        completedAt: deleteField(),
        attempts: filteredAttempts
      });

      // Update local state
      setLocalClimb(prev => ({
        ...prev,
        completed: false,
        completedAt: undefined,
        attempts: filteredAttempts
      }));
    } catch (error) {
      console.error('Error marking climb as incomplete:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'climbs', climb.id));
      // Close the detail view
      setIsDetailOpen(false);
      // Notify parent to update the list
      onDelete(climb.id);
    } catch (error) {
      console.error('Error deleting climb:', error);
    }
  };

  const handleEditAttempt = async (attemptId: string, newNotes: string) => {
    try {
      // Find the attempt to edit
      const attemptToEdit = localClimb.attempts.find(a => a.id === attemptId);
      if (!attemptToEdit) return;

      // Create updated attempt with new notes
      const updatedAttempt = {
        ...attemptToEdit,
        notes: newNotes
      };

      // Create new attempts array with the edited attempt
      const updatedAttempts = localClimb.attempts.map(attempt =>
        attempt.id === attemptId ? updatedAttempt : attempt
      );

      // Update Firestore
      const climbRef = doc(db, 'climbs', climb.id);
      await updateDoc(climbRef, {
        attempts: updatedAttempts
      });

      // Update local state
      setLocalClimb(prev => ({
        ...prev,
        attempts: updatedAttempts
      }));
    } catch (error) {
      console.error('Error updating attempt:', error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail view if clicking a link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    setIsDetailOpen(true);
  };

  return (
    <>
      <div 
        className={cn(
          "border rounded-lg p-4 hover:bg-accent hover:shadow-sm transition-all cursor-pointer",
          localClimb.completed && "bg-emerald-50 dark:bg-emerald-950/10"
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{localClimb.name}</h3>
              {localClimb.completed && (
                <Trophy className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{localClimb.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn(
                typeColors[localClimb.type],
                'font-normal'
              )}
            >
              {localClimb.type}
            </Badge>
            <Badge variant="secondary">
              {localClimb.grade}
            </Badge>
          </div>
        </div>

        {localClimb.links?.length > 0 && (
          <div className="flex items-center gap-2">
            {localClimb.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      <ClimbDetailCard
        climb={localClimb}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddAttempt={handleAddAttempt}
        onAddLink={() => setIsAddLinkOpen(true)}
        onSendIt={() => setIsSendItFormOpen(true)}
        onUnsend={handleUnsend}
        onDelete={handleDelete}
        onEditAttempt={handleEditAttempt}
      />

      <AddLinkForm
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onSubmit={handleAddLink}
      />

      <AttemptForm
        isOpen={isSendItFormOpen}
        onClose={() => setIsSendItFormOpen(false)}
        onSubmit={(data) => {
          handleSendIt(data);
          setIsSendItFormOpen(false);
        }}
      />
    </>
  );
} 