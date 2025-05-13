"use client";

import {useState, useEffect} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/components/ui/use-toast";
import {ItemCard} from "@/components/item-card";
import {LocationSelector} from "@/components/location-selector";
import {PlusCircle, Search, MapPin, Clock, AlertCircle} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  imageUrl: string;
  createdAt: string;
  user: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const {toast} = useToast();

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    // Fetch recent items
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items?limit=6", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setItems(data.items);
          }
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load items. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchItems();
  }, [toast]);

  // Filter items by location
  const filteredItems =
    selectedLocation === "all"
      ? items
      : items.filter((item) => item.location === selectedLocation);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {user ? `Welcome back, ${user.name}!` : "Welcome to FastFinder"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Items
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/report">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Item
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>
              Your recent activity on FastFinder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${items.length} items found recently`
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Location</CardTitle>
            <CardDescription>Filter items by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <LocationSelector
                value={selectedLocation}
                onChange={setSelectedLocation}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/my-items">View My Items</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/report">Report New Item</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Items</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No items found</h3>
            <p className="text-muted-foreground">
              {selectedLocation === "all"
                ? "There are no items to display at the moment."
                : `No items found in ${selectedLocation}. Try selecting a different location.`}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/search">Search All Items</Link>
            </Button>
          </div>
        </Card>
      )}

      {filteredItems.length > 0 && (
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/search">View All Items</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
