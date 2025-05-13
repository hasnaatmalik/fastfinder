"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  // Campus locations based on the provided information
  const locations = [
    {
      group: "SFC Building",
      items: [
        { value: "sfc-ground", label: "SFC Ground Floor" },
        { value: "sfc-first-floor", label: "SFC First Floor (FYP Lab)" },
        { value: "sfc-second-floor", label: "SFC Second Floor (Labs)" },
        { value: "sfc-classrooms", label: "SFC Classrooms" },
      ],
    },
    {
      group: "CS Building",
      items: [
        { value: "cs-rooms", label: "CS Classrooms" },
        { value: "cs-admin", label: "CS Admin Offices" },
        { value: "cs-faculty", label: "CS Faculty Offices" },
        { value: "cs-gp-lab", label: "CS GP Lab" },
        { value: "cs-call-lab", label: "CS CALL Lab" },
        { value: "cs-mac-lab", label: "CS Mac Lab" },
        { value: "cs-data-center", label: "CS Data Center" },
      ],
    },
    {
      group: "FSM Building",
      items: [
        { value: "fsm-cafe", label: "FSM Cafe" },
        { value: "fsm-audi", label: "FSM Auditorium" },
        { value: "fsm-classrooms", label: "FSM Classrooms" },
        { value: "fsm-faculty", label: "FSM Faculty Offices" },
        { value: "fsm-admin", label: "FSM Admin Offices" },
      ],
    },
    {
      group: "Other Locations",
      items: [
        { value: "girls-hostel", label: "Girls Hostel (near SFC)" },
        { value: "boys-hostel", label: "Boys Hostel (at Dhabba)" },
        { value: "tuc-shop", label: "TUC Shop (at Dhabba)" },
        { value: "hair-saloon", label: "Boys Hair Saloon (at Dhabba)" },
        { value: "other", label: "Other Location" },
      ],
    },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((group) => (
          <div key={group.group}>
            <div className="px-2 py-1.5 text-sm font-semibold">{group.group}</div>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  )
}
