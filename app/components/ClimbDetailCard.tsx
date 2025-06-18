'use client';

import { useState } from 'react';
import { Climb, Attempt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AttemptForm } from './AttemptForm';
import { ExternalLink, Trophy, Trash2, Copy, Plus } from 'lucide-react';
import { EditAttemptForm } from './EditAttemptForm';
import { useAuth } from '@/lib/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EditClimbDialog } from './EditClimbDialog';

interface ClimbDetailCardProps {
  climb: Climb;
  isOpen: boolean;
  onClose: () => void;
  onAddAttempt?: (data: { date: Date; notes: string }) => void;
  onAddLink?: () => void;
  onSendIt?: () => void;
  onUnsend?: () => void;
  onDelete?: () => void;
  onEditAttempt?: (attemptId: string, newNotes: string) => void;
  readOnly?: boolean;
  onCopyToMyList?: () => void;
  onEditClimb?: (climb: Climb) => void;
}

export function ClimbDetailCard({
  climb,
  isOpen,
  onClose,
  onAddAttempt,
  onAddLink,
  onSendIt,
  onUnsend,
  onDelete,
  onEditAttempt,
  readOnly = false,
  onCopyToMyList,
  onEditClimb
}: ClimbDetailCardProps) {
  const { user } = useAuth();
  const [isAttemptFormOpen, setIsAttemptFormOpen] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<Attempt | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditAttempt = (attempt: Attempt) => {
    setEditingAttempt(attempt);
  };

  const handleEditSubmit = async (newNotes: string) => {
    if (onEditAttempt && editingAttempt) {
      await onEditAttempt(editingAttempt.id, newNotes);
      setEditingAttempt(null);
    }
  };

  const handleCopyToMyList = async () => {
    if (!user) return;
    
    try {
      const newClimb = {
        userId: user.uid,
        name: climb.name,
        grade: climb.grade,
        type: climb.type,
        location: climb.location,
        attempts: [],
        links: [],
        completed: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'climbs'), newClimb);
      onClose(); // Close the dialog after successful copy
    } catch (error) {
      console.error('Error copying climb:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{climb.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground font-semibold">{climb.location}</p>
              {climb.city && (
                <p className="text-muted-foreground text-sm">City/Town: {climb.city}</p>
              )}
              {climb.state && (
                <p className="text-muted-foreground text-sm">State: {climb.state}</p>
              )}
              {climb.country && (
                <p className="text-muted-foreground text-sm">Country: {climb.country}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{climb.type}</Badge>
                <Badge>{climb.grade}</Badge>
              </div>
            </div>
            {/* Only show action buttons if not readOnly */}
            {!readOnly && (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditOpen(true)} variant="outline">
                  Edit
                </Button>
                {climb.completed ? (
                  <Button 
                    variant="outline" 
                    onClick={onUnsend}
                    className="text-destructive hover:text-destructive"
                  >
                    UnSend
                  </Button>
                ) : (
                  <Button onClick={onSendIt}>
                    SendIt!
                  </Button>
                )}
                <Button onClick={() => setIsAttemptFormOpen(true)}>
                  Add Attempt
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            {readOnly && onCopyToMyList && (
              <Button
                variant="outline"
                onClick={onCopyToMyList}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Add Climb to My List
              </Button>
            )}
          </div>

          {/* Links Section */}
          {climb.links?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <div className="flex flex-wrap gap-3">
                {climb.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Add Link Button */}
          {!readOnly && (
            <div className="mt-6">
              <Button variant="outline" onClick={onAddLink} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          )}

          {/* Attempts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Attempts</h3>
            <div className="space-y-4">
              {climb.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-start justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(attempt.date).toLocaleDateString()}
                    </p>
                    <p>{attempt.notes}</p>
                  </div>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAttempt(attempt)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!readOnly && (
          <>
            <AttemptForm
              isOpen={isAttemptFormOpen}
              onClose={() => setIsAttemptFormOpen(false)}
              onSubmit={onAddAttempt}
            />

            {!readOnly && editingAttempt && (
              <EditAttemptForm
                attempt={editingAttempt}
                isOpen={!!editingAttempt}
                onClose={() => setEditingAttempt(null)}
                onSubmit={handleEditSubmit}
              />
            )}
          </>
        )}

        {/* Edit Climb Dialog */}
        {!readOnly && (
          <EditClimbDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            climb={climb}
            onEdit={onEditClimb || (() => {})}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 