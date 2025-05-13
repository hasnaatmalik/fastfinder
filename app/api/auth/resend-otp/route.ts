import {type NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import {sendVerificationEmail} from "@/lib/email-service";
import {generateOTP} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const {email} = await req.json();

    if (!email) {
      return NextResponse.json(
        {success: false, error: "Email is required"},
        {status: 400}
      );
    }

    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({email});
    if (!user) {
      return NextResponse.json(
        {success: false, error: "User not found"},
        {status: 404}
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        {success: false, error: "User is already verified"},
        {status: 400}
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP expires in 15 minutes

    // Update user with new OTP
    user.verificationCode = otp;
    user.verificationCodeExpiry = otpExpiry;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, user.name, otp);

    // Log the result for debugging
    console.log("Email resend result:", emailResult);

    if (!emailResult.success) {
      console.error("Failed to resend verification email:", emailResult.error);
      // We still return success but with a warning
      return NextResponse.json({
        success: true,
        message:
          "A new verification code has been sent to your email. If you don't receive it, please try again later.",
        verificationCode: otp, // Only for development purposes
        warning: "Email delivery might be delayed",
      });
    }

    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent to your email.",
      verificationCode: otp, // Only for development purposes
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while resending the verification code",
      },
      {status: 500}
    );
  }
}
