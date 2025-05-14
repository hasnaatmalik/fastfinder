"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Logo} from "@/components/logo";
import {useToast} from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {User, LogOut, Settings, Search, Menu, X} from "lucide-react";

interface UserType {
  id: string;
  name: string;
  email: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/search"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Search
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/report"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Report
          </Link>

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <Search className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-items">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>My Items</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/search"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/report"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Report
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/my-items"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      My Items
                    </Link>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 text-sm font-medium"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button
                      className="w-full justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
