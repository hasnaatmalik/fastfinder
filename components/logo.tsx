import { MapPin } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary rounded-full scale-125 opacity-20"></div>
        <div className="relative bg-primary text-white p-1.5 rounded-full">
          <MapPin className={sizeClasses[size]} />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-secondary`}>
          <span className="text-primary">FAST Finder</span>
        </span>
      )}
    </Link>
  )
}
