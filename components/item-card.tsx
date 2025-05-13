"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Phone, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Reporter {
  _id: string
  name: string
  email: string
  contactNumber: string
}

interface Item {
  _id: string
  title: string
  description: string
  type: "lost" | "found"
  category: string
  location: string
  date: string
  contactInfo: string
  reportedBy: Reporter
  image?: string
  status: "open" | "closed"
  createdAt: string
}

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const [showContact, setShowContact] = useState(false)

  // Get location name from location value
  const getLocationName = (locationValue: string) => {
    const locationMap: Record<string, string> = {
      "sfc-ground": "SFC Ground Floor",
      "sfc-first-floor": "SFC First Floor (FYP Lab)",
      "sfc-second-floor": "SFC Second Floor (Labs)",
      "sfc-classrooms": "SFC Classrooms",
      "cs-rooms": "CS Classrooms",
      "cs-admin": "CS Admin Offices",
      "cs-faculty": "CS Faculty Offices",
      "cs-gp-lab": "CS GP Lab",
      "cs-call-lab": "CS CALL Lab",
      "cs-mac-lab": "CS Mac Lab",
      "cs-data-center": "CS Data Center",
      "fsm-cafe": "FSM Cafe",
      "fsm-audi": "FSM Auditorium",
      "fsm-classrooms": "FSM Classrooms",
      "fsm-faculty": "FSM Faculty Offices",
      "fsm-admin": "FSM Admin Offices",
      "girls-hostel": "Girls Hostel (near SFC)",
      "boys-hostel": "Boys Hostel (at Dhabba)",
      "tuc-shop": "TUC Shop (at Dhabba)",
      "hair-saloon": "Boys Hair Saloon (at Dhabba)",
      other: "Other Location",
    }

    return locationMap[locationValue] || locationValue
  }

  return (
    <Card className="overflow-hidden border-secondary/10 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 bg-secondary/5">
        <div className="flex justify-between items-start">
          <Badge variant={item.type === "lost" ? "destructive" : "default"} className="mb-2">
            {item.type === "lost" ? "Lost" : "Found"}
          </Badge>
          <Badge variant={item.status === "open" ? "outline" : "secondary"}>
            {item.status === "open" ? "Open" : "Closed"}
          </Badge>
        </div>
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-4">
        {item.image && (
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg?height=200&width=400"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-foreground/70">
            <MapPin className="mr-1 h-4 w-4 text-primary" />
            {getLocationName(item.location)}
          </div>
          <div className="flex items-center text-foreground/70">
            <Calendar className="mr-1 h-4 w-4 text-primary" />
            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-primary/10 text-primary border-primary/20">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2 border-t border-secondary/10">
        {showContact ? (
          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center">
              <Phone className="mr-1 h-4 w-4 text-primary" />
              <span>{item.reportedBy.contactNumber || item.contactInfo}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-1 h-4 w-4 text-primary" />
              <span>{item.reportedBy.email}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setShowContact(false)}>
              Hide Contact
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <Button variant="default" size="sm" className="w-full" onClick={() => setShowContact(true)}>
              Contact Reporter
            </Button>
            <Link href={`/item/${item._id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
