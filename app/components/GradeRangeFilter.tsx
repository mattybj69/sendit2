"use client"

import { useState, useEffect } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

type ClimbType = 'all' | 'boulder' | 'sport' | 'trad';

interface GradeRangeFilterProps {
  type: ClimbType;
  onRangeChange: (range: [number, number]) => void;
}

export function GradeRangeFilter({ type, onRangeChange }: GradeRangeFilterProps) {
  const [range, setRange] = useState<[number, number]>([0, 17]);

  useEffect(() => {
    // Reset range when type changes
    if (type === 'boulder') {
      setRange([0, 17]);
    } else if (type === 'sport') {
      setRange([1, 35]);
    }
  }, [type]);

  const handleRangeChange = (value: number[]) => {
    const newRange = value as [number, number];
    setRange(newRange);
    onRangeChange(newRange);
  };

  const formatGrade = (value: number) => {
    if (type === 'boulder') {
      return `V${value}`;
    } else if (type === 'sport') {
      return value.toString();
    }
    return '';
  };

  if (type === 'all' || type === 'trad') {
    return null;
  }

  return (
    <div className="space-y-2 min-w-[300px] md:min-w-[500px] lg:min-w-[700px] w-full">
      <Label>Grade Range</Label>
      <div className="flex items-center gap-4 w-full">
        <span className="text-sm text-muted-foreground">
          {formatGrade(range[0])}
        </span>
        <Slider
          value={range}
          onValueChange={handleRangeChange}
          min={type === 'boulder' ? 0 : 1}
          max={type === 'boulder' ? 17 : 35}
          step={1}
          className="flex-1 h-10 px-2 w-full"
        />
        <span className="text-sm text-muted-foreground">
          {formatGrade(range[1])}
        </span>
      </div>
    </div>
  );
} 