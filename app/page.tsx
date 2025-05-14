"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { MapPin, Search, Bell, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("currentUser")
    setIsLoggedIn(!!user)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-secondary">
                  Lost Something on Campus?
                  <span className="text-primary block mt-2">We'll Help You Find It</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  FAST Finder connects the FAST CFD community to help recover lost items and return found belongings to
                  their rightful owners.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden bg-muted">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 z-10 rounded-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <Logo size="lg" />
              </div>
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg z-20 text-sm font-medium">
                Serving FAST CFD Campus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-24 bg-secondary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[700px] text-white/80 md:text-xl/relaxed">
                Simple steps to recover your lost items or help others find theirs
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Report</h3>
              <p className="text-white/80">
                Report lost items or items you've found on campus with detailed descriptions
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Connect</h3>
              <p className="text-white/80">
                Get notified when someone reports finding your lost item or claims an item you found
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Recover</h3>
              <p className="text-white/80">Safely arrange to recover your belongings or return items to their owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Locations */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">
                Campus Coverage
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                We cover all major locations across the FAST CFD campus
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <LocationCard
              title="SFC Building"
              items={["Ground Floor", "First Floor (FYP Lab)", "Second Floor Labs", "Classrooms"]}
            />
            <LocationCard
              title="CS Building"
              items={["Classrooms", "Admin Offices", "Faculty Offices", "Labs (GP, CALL, Mac)", "Data Center"]}
            />
            <LocationCard
              title="FSM Building"
              items={["Cafe", "Auditorium", "Classrooms", "Faculty Offices", "Admin Offices"]}
            />
            <LocationCard title="Hostels" items={["Girls Hostel (near SFC)", "Boys Hostel (at Dhabba)"]} />
            <LocationCard title="Other Areas" items={["TUC Shop", "Hair Saloon", "Parking Areas", "Sports Grounds"]} />
            <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center bg-primary/10 rounded-xl border border-primary/20">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Can't find your location?</h3>
              <p className="text-muted-foreground">
                We're constantly expanding our coverage. Let us know if we missed a spot!
              </p>
              <Button variant="outline" className="mt-2">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-muted-foreground md:text-xl/relaxed">
                Ready to Find What You've Lost?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Join the FAST Finder community today and help make our campus a better place
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-1">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function LocationCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col space-y-3 p-6 bg-secondary/5 rounded-xl border border-secondary/10">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-foreground/70 flex items-start">
            <span className="mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
