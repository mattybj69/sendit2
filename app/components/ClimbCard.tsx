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
import { ExternalLink, Trophy, Check, Copy, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"

type ClimbType = "all" | "boulder" | "sport" | "trad"

interface ClimbCardProps {
  climb: Climb;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
  onCopy?: (id: string) => void;
  onEditClimb?: (climb: Climb) => void;
}

const typeColors = {
  Boulder: 'bg-destructive/10 text-destructive border-destructive/20',
  Sport: 'bg-blue-100 text-blue-700 border-blue-200',
  Trad: 'bg-emerald-100 text-emerald-700 border-emerald-200'
} as const;

function capitalizeType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function ClimbCard({ climb, onDelete, readOnly = false, onCopy, onEditClimb }: ClimbCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isSendItFormOpen, setIsSendItFormOpen] = useState(false);
  const [localClimb, setLocalClimb] = useState(climb);
  const [isCopied, setIsCopied] = useState(false);

  const handleAddAttempt = async (data: { date: Date; notes: string }) => {
    try {
      const attemptId = Math.random().toString(36).substr(2, 9);
      const newAttempt = {
        id: attemptId,
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(climb.id);
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

  const handleCopy = () => {
    if (onCopy) {
      onCopy(climb.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          localClimb.completed && "bg-green-50 border-green-500"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{localClimb.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="bg-black text-white">
                  {localClimb.grade}
                </Badge>
                <span>•</span>
                <span>{localClimb.location}</span>
              </div>
            </div>
            <Badge 
              variant="outline"
              className={typeColors[capitalizeType(localClimb.type) as keyof typeof typeColors]}
            >
              {capitalizeType(localClimb.type)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <ClimbDetailCard
        climb={localClimb}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddAttempt={readOnly ? undefined : handleAddAttempt}
        onAddLink={readOnly ? undefined : () => setIsAddLinkOpen(true)}
        onSendIt={readOnly ? undefined : () => setIsSendItFormOpen(true)}
        onUnsend={readOnly ? undefined : handleUnsend}
        onDelete={readOnly ? undefined : handleDelete}
        onEditAttempt={readOnly ? undefined : handleEditAttempt}
        readOnly={readOnly}
        onCopyToMyList={readOnly && onCopy ? () => handleCopy() : undefined}
        onEditClimb={onEditClimb}
      />

      {!readOnly && (
        <>
          <AddLinkForm
            isOpen={isAddLinkOpen}
            onClose={() => setIsAddLinkOpen(false)}
            onSubmit={handleAddLink}
          />

          <AttemptForm
            isOpen={isSendItFormOpen}
            onClose={() => setIsSendItFormOpen(false)}
            onSubmit={handleSendIt}
          />
        </>
      )}
    </>
  );
} 