'use client';

import { useState, useEffect } from 'react';
import { Climb, ClimbType } from '@/lib/types';
import { ClimbCard } from './ClimbCard';
import { ClimbsFilter } from './ClimbsFilter';
import { getUserClimbsClient } from '@/lib/queries';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

interface ClimbsClientProps {
  initialClimbs: Climb[];
  isReadOnly?: boolean;
  onAddClimb?: (climb: Climb) => Promise<void>;
  onDeleteClimb?: (id: string) => Promise<void>;
  onEditClimb?: (climb: Climb) => Promise<void>;
}

export function ClimbsClient({ initialClimbs, isReadOnly = false, onAddClimb, onDeleteClimb, onEditClimb }: ClimbsClientProps) {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: "all" as ClimbType,
    gradeRange: [0, 17] as [number, number],
    location: ""
  });
  const [showCompleted, setShowCompleted] = useState(false);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Only call parent-provided add/delete
  const handleAddClimb = async (newClimb: Climb) => {
    if (onAddClimb) await onAddClimb(newClimb);
    setFilters({
      type: "all",
      gradeRange: [0, 17],
      location: ""
    });
  };

  const handleDeleteClimb = async (id: string) => {
    if (onDeleteClimb) await onDeleteClimb(id);
  };

  const handleCopyClimb = async (id: string) => {
    const climbToCopy = initialClimbs.find(climb => climb.id === id);
    if (climbToCopy && user) {
      try {
        // Create new climb object without the id field
        const { id: _, ...climbWithoutId } = climbToCopy;
        
        const newClimb = {
          ...climbWithoutId,
          userId: user.uid,
          attempts: [],
          links: [],
          completed: false,
          createdAt: serverTimestamp()
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'climbs'), newClimb);

        // Create the final climb object with the Firestore ID
        const finalClimb = {
          ...newClimb,
          id: docRef.id,
          createdAt: new Date() // Convert serverTimestamp to Date for client
        };

        // Call parent's onAddClimb if provided
        if (onAddClimb) {
          await onAddClimb(finalClimb as Climb);
        }
      } catch (error) {
        console.error('Error copying climb:', error);
      }
    }
  };

  // Helper to parse grade based on type
  function parseGrade(type: string, grade: string): number | null {
    if (type === 'boulder') {
      // Expecting V grades like V0, V6, etc.
      const match = grade.match(/^V(\d+)$/i);
      if (match) return parseInt(match[1], 10);
    } else if (type === 'sport') {
      // Expecting sport grades like 24, 7a, etc. (just extract number)
      const match = grade.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return null;
  }

  // Filter climbs based on current filters
  const filteredClimbs = initialClimbs.filter((climb) => {
    // Type filter (case-insensitive)
    if (filters.type !== "all" && climb.type.toLowerCase() !== filters.type.toLowerCase()) {
      return false;
    }

    // Grade range filter (only for boulder or sport)
    if (filters.type !== "all") {
      const gradeNum = parseGrade(filters.type, climb.grade);
      if (gradeNum === null || gradeNum < filters.gradeRange[0] || gradeNum > filters.gradeRange[1]) {
        return false;
      }
    }

    // Location filter
    if (filters.location && climb.location.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Split filtered climbs into incomplete and completed
  const incompleteClimbs = filteredClimbs.filter(climb => !climb.completed);
  const completedClimbs = filteredClimbs.filter(climb => climb.completed);

  if (!initialClimbs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ClimbsFilter
        climbs={initialClimbs}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="space-y-3">
        {incompleteClimbs.map((climb) => (
          <ClimbCard
            key={climb.id}
            climb={climb}
            readOnly={isReadOnly}
            onDelete={handleDeleteClimb}
            onCopy={isReadOnly ? handleCopyClimb : undefined}
            onEditClimb={onEditClimb}
          />
        ))}
      </div>

      {/* Expandable Completed Climbs Section */}
      {completedClimbs.length > 0 && (
        <div className="mt-8">
          <button
            className="w-full flex items-center justify-between px-4 py-2 bg-muted rounded hover:bg-accent transition"
            onClick={() => setShowCompleted((prev) => !prev)}
          >
            <span className="font-semibold">{showCompleted ? 'Hide' : 'Show'} Completed Climbs ({completedClimbs.length})</span>
            <span className="ml-2">{showCompleted ? '▲' : '▼'}</span>
          </button>
          {showCompleted && (
            <div className="space-y-3 mt-4">
              {completedClimbs.map((climb) => (
                <ClimbCard
                  key={climb.id}
                  climb={climb}
                  readOnly={isReadOnly}
                  onDelete={handleDeleteClimb}
                  onCopy={isReadOnly ? handleCopyClimb : undefined}
                  onEditClimb={onEditClimb}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 