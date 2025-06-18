"use client"

import { useState, useEffect } from "react"
import { Climb, ClimbType } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { GradeRangeFilter } from "./GradeRangeFilter"
import { Combobox } from "./ui/combobox"
import { Button } from "./ui/button"
import { X } from "lucide-react"

interface ClimbsFilterProps {
  climbs: Climb[]
  filters: {
    type: ClimbType
    gradeRange: [number, number]
    location: string
  }
  onFiltersChange: (filters: {
    type: ClimbType
    gradeRange: [number, number]
    location: string
  }) => void
}

export function ClimbsFilter({ climbs, filters, onFiltersChange }: ClimbsFilterProps) {
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    const uniqueLocations = Array.from(new Set(climbs.map(climb => climb.location.trim().toLowerCase())))
      .filter(loc => loc)
      .map(loc => ({
        label: loc.charAt(0).toUpperCase() + loc.slice(1),
        value: loc
      }));
    setLocations(prev => {
      if (
        prev.length === uniqueLocations.length &&
        prev.every((loc, i) => loc.value === uniqueLocations[i].value)
      ) {
        return prev;
      }
      return uniqueLocations;
    });
  }, [climbs]);

  const handleTypeChange = (value: ClimbType) => {
    let newGradeRange: [number, number] = [0, 17];
    if (value === 'boulder') {
      newGradeRange = [0, 17];
    } else if (value === 'sport') {
      newGradeRange = [1, 35];
    }
    onFiltersChange({
      ...filters,
      type: value,
      gradeRange: newGradeRange
    })
  }

  const handleGradeRangeChange = (range: [number, number]) => {
    onFiltersChange({
      ...filters,
      gradeRange: range
    })
  }

  const handleLocationChange = (value: string) => {
    onFiltersChange({
      ...filters,
      location: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      gradeRange: [0, 17],
      location: ""
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-[200px]">
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="boulder">Boulder</SelectItem>
              <SelectItem value="sport">Sport</SelectItem>
              <SelectItem value="trad">Trad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Select value={filters.location} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
      {(filters.type === 'boulder' || filters.type === 'sport') && (
        <GradeRangeFilter
          type={filters.type}
          onRangeChange={handleGradeRangeChange}
        />
      )}
    </div>
  )
} 