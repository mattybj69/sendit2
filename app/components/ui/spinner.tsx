'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex justify-center">
      <Loader2 className={cn('h-8 w-8 animate-spin', className)} />
    </div>
  );
} 