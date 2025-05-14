"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ItemCard} from "@/components/item-card";
import Link from "next/link";
import {PlusCircle, Loader2} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
}

interface Item {
  _id: string;
  title: string;
  description: string;
  type: "lost" | "found";
  category: string;
  location: string;
  createdAt: string;
  contactInfo: string;
  reportedBy: string;
  image?: string;
  status: "open" | "closed";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    // Fetch items
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchItems();
  }, [router]);

  // Filter items based on active tab
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "lost") return item.type === "lost";
    if (activeTab === "found") return item.type === "found";
    if (activeTab === "mine") return item.reportedBy === user?._id;
    return true;
  });

  // Sort items by date (newest first)
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse lost and found items or report a new item
          </p>
        </div>
        <Link href="/report">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report Item
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="lost">Lost</TabsTrigger>
          <TabsTrigger value="found">Found</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {sortedItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No items found</CardTitle>
                <CardDescription>
                  {activeTab === "mine"
                    ? "You haven't reported any items yet."
                    : "There are no items in this category yet."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "mine"
                    ? "Report a lost or found item to see it here."
                    : "Check back later or change your filter."}
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/report">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Report Item
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
