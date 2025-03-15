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
import { ExternalLink, Trophy, Trash2 } from 'lucide-react';
import { EditAttemptForm } from './EditAttemptForm';

interface ClimbDetailCardProps {
  climb: Climb;
  isOpen: boolean;
  onClose: () => void;
  onAddAttempt: (data: { date: Date; notes: string }) => void;
  onAddLink: () => void;
  onSendIt: () => void;
  onUnsend: () => void;
  onDelete: () => void;
  onEditAttempt: (attemptId: string, notes: string) => void;
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
  onEditAttempt
}: ClimbDetailCardProps) {
  const [isAttemptFormOpen, setIsAttemptFormOpen] = useState(false);
  const [showAllAttempts, setShowAllAttempts] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<Attempt | null>(null);

  // Sort attempts by index in descending order (latest first)
  const sortedAttempts = [...climb.attempts].sort((a, b) => b.index - a.index);

  const displayedAttempts = showAllAttempts
    ? sortedAttempts
    : sortedAttempts.slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            {climb.name}
            {climb.completed && (
              <Trophy className="h-5 w-5 text-emerald-500" />
            )}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground">{climb.location}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{climb.type}</Badge>
                <Badge>{climb.grade}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
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
                  SentIt!
                </Button>
              )}
              <Button onClick={() => setIsAttemptFormOpen(true)}>
                Add Attempt
              </Button>
              <Button variant="outline" onClick={onAddLink}>
                Add Link
              </Button>
            </div>
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

          {/* Attempts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Attempts ({climb.attempts.length})
            </h3>
            <div className="space-y-4">
              {displayedAttempts.map((attempt: Attempt) => (
                <div
                  key={attempt.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setEditingAttempt(attempt)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {attempt.date instanceof Date 
                        ? attempt.date.toLocaleDateString()
                        : new Date(attempt.date.seconds * 1000).toLocaleDateString()}
                    </p>
                    <Badge variant="outline">Attempt #{attempt.index}</Badge>
                  </div>
                  <p>{attempt.notes}</p>
                </div>
              ))}
              {climb.attempts.length > 5 && !showAllAttempts && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAllAttempts(true)}
                >
                  See All Attempts
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <AttemptForm
        isOpen={isAttemptFormOpen}
        onClose={() => setIsAttemptFormOpen(false)}
        onSubmit={(data: { date: Date; notes: string }) => {
          onAddAttempt(data);
          setIsAttemptFormOpen(false);
        }}
      />

      {editingAttempt && (
        <EditAttemptForm
          attempt={editingAttempt}
          isOpen={true}
          onClose={() => setEditingAttempt(null)}
          onSubmit={onEditAttempt}
        />
      )}
    </Dialog>
  );
} 