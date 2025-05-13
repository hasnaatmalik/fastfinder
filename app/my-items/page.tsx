"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ItemCard } from "@/components/item-card"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { getCurrentUser, getItems } from "@/lib/api"

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

export default function MyItemsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
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
        setUser(userResponse.user)

        // Get user's items
        const itemsResponse = await getItems({ reportedBy: userResponse.user.id })
        if (itemsResponse.success) {
          setItems(itemsResponse.items)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter items based on active tab
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "lost") return item.type === "lost"
    if (activeTab === "found") return item.type === "found"
    if (activeTab === "open") return item.status === "open"
    if (activeTab === "closed") return item.status === "closed"
    return true
  })

  // Sort items by date (newest first)
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (loading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reported Items</h1>
          <p className="text-foreground/70 mt-1">Manage your lost and found reports</p>
        </div>
        <Link href="/report">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report New Item
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
          <TabsTrigger value="found">Found</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {sortedItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-foreground/70 mb-6">
                You haven&apos;t reported any {activeTab !== "all" ? activeTab : ""} items yet.
              </p>
              <Link href="/report">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report Item
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
