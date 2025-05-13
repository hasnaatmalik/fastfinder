import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import { generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and verification code are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if OTP is valid
    if (user.verificationCode !== otp) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // Check if OTP is expired
    if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    // Update user
    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    await user.save()

    // Generate token
    const token = generateToken(user._id.toString())

    // Set auth cookie
    setAuthCookie(token)

    // Return user data (without sensitive information)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      isVerified: user.isVerified,
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during verification" }, { status: 500 })
  }
}
