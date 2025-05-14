import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email-service"
import { generateOTP } from "@/lib/validation"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Please provide your email address" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({
        success: true,
        message: "If your email is registered, you will receive a password reset code",
      })
    }

    // Generate reset code
    const resetCode = generateOTP()
    const resetCodeExpiry = new Date()
    resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15) // Code expires in 15 minutes

    // Update user
    user.resetCode = resetCode
    user.resetCodeExpiry = resetCodeExpiry
    await user.save()

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, resetCode)

    return NextResponse.json({
      success: true,
      message: "If your email is registered, you will receive a password reset code",
      resetCode: resetCode, // Only for development purposes, remove in production
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
