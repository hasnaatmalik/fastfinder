import Link from "next/link"
import { Logo } from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 bg-secondary text-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Logo showText={false} />
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} FAST Finder. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
