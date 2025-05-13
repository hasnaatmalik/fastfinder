import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import { sendVerificationEmail } from "@/lib/email-service"
import { generateOTP } from "@/lib/validation"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json({ success: false, error: "User is already verified" }, { status: 400 })
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15) // OTP expires in 15 minutes

    // Update user with new OTP
    user.verificationCode = otp
    user.verificationCodeExpiry = otpExpiry
    await user.save()

    // Send verification email
    const emailResult = await sendVerificationEmail(email, user.name, otp)
    if (!emailResult.success) {
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Verification code has been sent to your email.",
      verificationCode: otp, // Only for development purposes, remove in production
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while resending the verification code" },
      { status: 500 },
    )
  }
}
