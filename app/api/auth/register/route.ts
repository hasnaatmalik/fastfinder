import {type NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import {sendVerificationEmail} from "@/lib/email-service";
import {
  validateEmail,
  validatePassword,
  validateContactNumber,
  generateOTP,
} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const {name, email, password, confirmPassword, contactNumber} =
      await req.json();

    // Validation
    if (!name || !email || !password || !confirmPassword || !contactNumber) {
      return NextResponse.json(
        {success: false, error: "Please fill in all fields"},
        {status: 400}
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {success: false, error: "Passwords do not match"},
        {status: 400}
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        {success: false, error: "Please enter a valid email address"},
        {status: 400}
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {success: false, error: passwordValidation.message},
        {status: 400}
      );
    }

    if (!validateContactNumber(contactNumber)) {
      return NextResponse.json(
        {success: false, error: "Please enter a valid contact number"},
        {status: 400}
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return NextResponse.json(
        {success: false, error: "Email already in use"},
        {status: 400}
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP expires in 15 minutes

    // Create user
    const user = new User({
      name,
      email,
      password,
      contactNumber,
      verificationCode: otp,
      verificationCodeExpiry: otpExpiry,
      isVerified: false,
    });

    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, name, otp);

    // Log the result for debugging
    console.log("Email sending result:", emailResult);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // We still return success but with a warning
      return NextResponse.json({
        success: true,
        message:
          "Registration successful! Please check your email for the verification code. If you don't receive it, you can request a new code.",
        verificationCode: otp, // Only for development purposes
        warning: "Email delivery might be delayed",
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! Please check your email for the verification code.",
      verificationCode: otp, // Only for development purposes
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {success: false, error: "An error occurred during registration"},
      {status: 500}
    );
  }
}
