"use client"

import { useState } from "react"
import { Climb, ClimbType } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface AddClimbDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (climb: Climb) => void
}

export function AddClimbDialog({ open, onOpenChange, onAdd }: AddClimbDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<ClimbType>("boulder")
  const [grade, setGrade] = useState("")
  const [crag, setCrag] = useState("")
  const [city, setCity] = useState("")
  const [stateField, setStateField] = useState("")
  const [country, setCountry] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newClimb: Climb = {
      id: crypto.randomUUID(),
      name,
      type,
      grade,
      location: crag,
      city,
      state: stateField,
      country,
      attempts: [],
      completed: false
    }

    onAdd(newClimb)
    onOpenChange(false)
    
    // Reset form
    setName("")
    setType("boulder")
    setGrade("")
    setCrag("")
    setCity("")
    setStateField("")
    setCountry("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Climb</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter climb name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: ClimbType) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boulder">Boulder</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="trad">Trad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder={type === "boulder" ? "V0" : "5.10a"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crag">Crag</Label>
            <Input
              id="crag"
              value={crag}
              onChange={(e) => setCrag(e.target.value)}
              placeholder="Enter crag name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City/Town</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city or town"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={stateField}
              onChange={(e) => setStateField(e.target.value)}
              placeholder="Enter state"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Climb</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 