"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LocationSelector({
  value,
  onChange,
  className,
}: LocationSelectorProps) {
  const locations = [
    {value: "all", label: "All Locations"},
    {value: "Library", label: "Library"},
    {value: "Cafeteria", label: "Cafeteria"},
    {value: "Classroom", label: "Classroom"},
    {value: "Dormitory", label: "Dormitory"},
    {value: "Sports Complex", label: "Sports Complex"},
    {value: "Parking Lot", label: "Parking Lot"},
    {value: "Administration Building", label: "Administration Building"},
    {value: "Other", label: "Other"},
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.value} value={location.value}>
            {location.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
