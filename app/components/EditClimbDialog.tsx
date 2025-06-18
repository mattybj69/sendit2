import { useState } from "react"
import { Climb, ClimbType } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface EditClimbDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  climb: Climb
  onEdit: (climb: Climb) => void
}

export function EditClimbDialog({ open, onOpenChange, climb, onEdit }: EditClimbDialogProps) {
  const [name, setName] = useState(climb.name)
  const [type, setType] = useState<ClimbType>(climb.type)
  const [grade, setGrade] = useState(climb.grade)
  const [crag, setCrag] = useState(climb.location)
  const [city, setCity] = useState(climb.city || "")
  const [stateField, setStateField] = useState(climb.state || "")
  const [country, setCountry] = useState(climb.country || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedClimb: Climb = {
      ...climb,
      name,
      type,
      grade,
      location: crag,
      city,
      state: stateField,
      country
    }
    onEdit(updatedClimb)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Climb</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crag">Crag</Label>
            <Input
              id="crag"
              value={crag}
              onChange={(e) => setCrag(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City/Town</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={stateField}
              onChange={(e) => setStateField(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 