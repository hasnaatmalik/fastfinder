import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {MapPin, Calendar, ArrowRight} from "lucide-react";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  imageUrl?: string;
  createdAt: string;
  user?: string;
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({item}: ItemCardProps) {
  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Truncate description
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "found":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "lost":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "claimed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {item.imageUrl ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      )}

      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3" /> {item.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground">
          {truncateDescription(item.description)}
        </p>

        <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/item/${item._id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
