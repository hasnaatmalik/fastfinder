"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    setIsLoggedIn(!!user)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="md:hidden" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Logo />
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex w-full max-w-sm items-center space-x-2 mx-4">
          <Input
            type="search"
            placeholder="Search lost & found items..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
                Dashboard
              </Link>
              <Link href="/report" className="text-sm font-medium hover:underline underline-offset-4">
                Report Item
              </Link>
              <Link href="/my-items" className="text-sm font-medium hover:underline underline-offset-4">
                My Items
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
            <Input
              type="search"
              placeholder="Search lost & found items..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <nav className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
                  Dashboard
                </Link>
                <Link href="/report" className="text-sm font-medium hover:underline underline-offset-4">
                  Report Item
                </Link>
                <Link href="/my-items" className="text-sm font-medium hover:underline underline-offset-4">
                  My Items
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                  Login
                </Link>
                <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
