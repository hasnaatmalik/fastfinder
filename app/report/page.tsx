"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import { LocationSelector } from "@/components/location-selector"
import { getCurrentUser, createItem } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  contactNumber: string
}

export default function ReportItemPage() {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"lost" | "found">("lost")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getCurrentUser()
        if (!response.success) {
          router.push("/login")
          return
        }
        setUser(response.user)
        setContactInfo(response.user.contactNumber || "")
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple validation
    if (!title || !description || !category || !location || !date) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (!user) {
      setError("You must be logged in to report an item")
      setLoading(false)
      return
    }

    try {
      // Create new item
      const response = await createItem({
        title,
        description,
        type,
        category,
        location,
        date,
        contactInfo,
        image: image || undefined,
      })

      if (!response.success) {
        setError(response.error || "Failed to create item")
        setLoading(false)
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating item:", error)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Report an Item</CardTitle>
          <CardDescription>Fill in the details to report a lost or found item</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Item Type</Label>
              <RadioGroup
                defaultValue="lost"
                className="flex space-x-4"
                value={type}
                onValueChange={(value) => setType(value as "lost" | "found")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lost" id="lost" />
                  <Label htmlFor="lost">Lost Item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="found" id="found" />
                  <Label htmlFor="found">Found Item</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the item"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the item"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="bag">Bag/Backpack</SelectItem>
                    <SelectItem value="keys">Keys</SelectItem>
                    <SelectItem value="wallet">Wallet/Purse</SelectItem>
                    <SelectItem value="id-card">ID Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <LocationSelector value={location} onChange={setLocation} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Number</Label>
              <Input
                id="contactInfo"
                placeholder="Your contact number"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This will be shown to users who want to contact you about this item.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Click to upload</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG (max 5MB)</span>
                </Button>
                {image && (
                  <div className="relative w-32 h-32 rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => setImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
