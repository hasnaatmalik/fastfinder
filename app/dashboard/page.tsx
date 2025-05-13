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
import {
  AlertCircle,
  Loader2,
  PlusCircle,
  Search,
  Package,
  User,
} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
import {Skeleton} from "@/components/ui/skeleton";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface UserType {
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
  reportedBy: {
    _id: string;
    name: string;
  };
  image?: string;
  status: "open" | "closed";
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const {toast} = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current user
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userData.success) {
          console.error("Failed to fetch user data:", userData.error);
          router.push("/login");
          return;
        }

        setUser(userData.data);

        // Fetch items
        const itemsResponse = await fetch("/api/items", {
          credentials: "include",
        });

        const itemsData = await itemsResponse.json();

        if (!itemsData.success) {
          console.error("Failed to fetch items:", itemsData.error);
          setError("Failed to load items. Please try again later.");
        } else {
          setItems(itemsData.data || []);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("An error occurred while loading the dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, toast]);

  // Filter items based on active tab
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "lost") return item.type === "lost";
    if (activeTab === "found") return item.type === "found";
    if (activeTab === "mine" && user) return item.reportedBy._id === user._id;
    return true;
  });

  // Sort items by date (newest first)
  const sortedItems = [...filteredItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-12 w-full max-w-md mb-8" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => window.location.reload()}>
          <Loader2 className="mr-2 h-4 w-4" />
          Retry Loading
        </Button>
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
          <p className="text-foreground/70 mt-1">
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
                <CardTitle className="flex items-center">
                  {activeTab === "all" && <Search className="mr-2 h-5 w-5" />}
                  {activeTab === "lost" && <Package className="mr-2 h-5 w-5" />}
                  {activeTab === "found" && (
                    <Package className="mr-2 h-5 w-5" />
                  )}
                  {activeTab === "mine" && <User className="mr-2 h-5 w-5" />}
                  No items found
                </CardTitle>
                <CardDescription>
                  {activeTab === "mine"
                    ? "You haven't reported any items yet."
                    : "There are no items in this category yet."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
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
