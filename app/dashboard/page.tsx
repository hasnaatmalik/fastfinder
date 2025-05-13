"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, MapPin, Clock, Package } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, getItems } from "@/lib/api"
import { ItemCard } from "@/components/item-card"

interface User {
  id: string
  name: string
  email: string
  contactNumber: string
  isVerified: boolean
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    locations: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const userResponse = await getCurrentUser()
        if (!userResponse.success) {
          router.push("/login")
          return
        }
        setUser(userResponse.user)

        // Get items
        const itemsResponse = await getItems()
        if (itemsResponse.success) {
          setItems(itemsResponse.items)

          // Calculate stats
          const lostItems = itemsResponse.items.filter((item: Item) => item.type === "lost").length
          const foundItems = itemsResponse.items.filter((item: Item) => item.type === "found").length

          // Count unique locations
          const uniqueLocations = new Set(itemsResponse.items.map((item: Item) => item.location)).size

          // Count items from the last 24 hours
          const oneDayAgo = new Date()
          oneDayAgo.setDate(oneDayAgo.getDate() - 1)
          const recentItems = itemsResponse.items.filter((item: Item) => new Date(item.createdAt) > oneDayAgo).length

          setStats({
            lostItems,
            foundItems,
            locations: uniqueLocations,
            recentActivity: recentItems,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  // Filter items for each tab
  const lostItems = items.filter((item) => item.type === "lost")
  const foundItems = items.filter((item) => item.type === "found")
  const myItems = items.filter((item) => item.reportedBy._id === user?.id)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}! Manage your lost and found items.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/search">
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search Items
            </Button>
          </Link>
          <Link href="/report">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Item
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lost Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lostItems}</div>
            <p className="text-xs text-muted-foreground">Items reported as lost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Found Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.foundItems}</div>
            <p className="text-xs text-muted-foreground">Items reported as found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locations}</div>
            <p className="text-xs text-muted-foreground">Unique locations with items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">New items in past 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lost" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
          <TabsTrigger value="my-items">My Items</TabsTrigger>
        </TabsList>
        <TabsContent value="lost" className="space-y-4">
          {lostItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lostItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No lost items found</h3>
              <p className="text-muted-foreground mt-1">Be the first to report a lost item</p>
              <Link href="/report">
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report Lost Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        <TabsContent value="found" className="space-y-4">
          {foundItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {foundItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No found items reported</h3>
              <p className="text-muted-foreground mt-1">Be the first to report a found item</p>
              <Link href="/report">
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report Found Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my-items" className="space-y-4">
          {myItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No items reported yet</h3>
              <p className="text-muted-foreground mt-1">When you report lost or found items, they will appear here</p>
              <Link href="/report">
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report an Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
