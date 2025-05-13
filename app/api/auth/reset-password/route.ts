import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import { validatePassword } from "@/lib/validation"

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password, confirmPassword } = await req.json()

    if (!email || !otp || !password || !confirmPassword) {
      return NextResponse.json({ success: false, error: "Please fill in all fields" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ success: false, error: passwordValidation.message }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid reset code" }, { status: 400 })
    }

    // Check if reset code is valid
    if (user.resetCode !== otp) {
      return NextResponse.json({ success: false, error: "Invalid reset code" }, { status: 400 })
    }

    // Check if reset code is expired
    if (user.resetCodeExpiry && user.resetCodeExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "Reset code has expired" }, { status: 400 })
    }

    // Update user password
    user.password = password
    user.resetCode = undefined
    user.resetCodeExpiry = undefined
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during password reset" }, { status: 500 })
  }
}
