"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Phone, Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { getCurrentUser, getItem, updateItem } from "@/lib/api"

interface User {
  id: string
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
  reportedBy: {
    _id: string
    name: string
    email: string
    contactNumber: string
  }
  image?: string
  status: "open" | "closed"
  createdAt: string
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const userResponse = await getCurrentUser()
        if (!userResponse.success) {
          router.push("/login")
          return
        }
        setCurrentUser(userResponse.user)

        // Get item details
        const itemResponse = await getItem(params.id)
        if (!itemResponse.success) {
          setError(itemResponse.error || "Item not found")
          setLoading(false)
          return
        }

        setItem(itemResponse.item)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("An error occurred while fetching the item")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

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

  const handleStatusChange = async (newStatus: "open" | "closed") => {
    if (!item) return

    setUpdating(true)

    try {
      const response = await updateItem(item._id, { status: newStatus })

      if (!response.success) {
        setError(response.error || "Failed to update item status")
        setUpdating(false)
        return
      }

      // Update current item
      setItem({ ...item, status: newStatus })
    } catch (error) {
      console.error("Error updating item:", error)
      setError("An error occurred while updating the item")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!item || !currentUser) {
    return <div className="container py-10 text-center">Item not found</div>
  }

  const isOwner = item.reportedBy._id === currentUser.id

  return (
    <div className="container py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {item.image ? (
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-4">
              <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-4 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant={item.type === "lost" ? "destructive" : "default"} className="mb-2">
                {item.type === "lost" ? "Lost" : "Found"}
              </Badge>
              <Badge variant={item.status === "open" ? "outline" : "secondary"}>
                {item.status === "open" ? "Open" : "Closed"}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{item.title}</CardTitle>
            <CardDescription>Reported {format(new Date(item.createdAt), "PPP")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <Badge variant="outline">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Badge>
              </div>
              <div>
                <h3 className="font-medium mb-1">Date</h3>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {format(new Date(item.date), "PPP")}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {getLocationName(item.location)}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="mr-1 h-4 w-4" />
                  <span>{item.reportedBy.contactNumber || item.contactInfo}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  <span>{item.reportedBy.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            {isOwner && (
              <div className="w-full">
                <h3 className="font-medium mb-2">Manage Item Status</h3>
                <div className="flex gap-2">
                  <Button
                    variant={item.status === "open" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange("open")}
                    disabled={item.status === "open" || updating}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Mark as Open
                  </Button>
                  <Button
                    variant={item.status === "closed" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange("closed")}
                    disabled={item.status === "closed" || updating}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Mark as Closed
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
