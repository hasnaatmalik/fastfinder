import {type NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import {createToken, setAuthCookie} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const {email, password} = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {success: false, error: "Please fill in all fields"},
        {status: 400}
      );
    }

    await connectToDatabase();

    // Find user - explicitly select the password field
    const user = await User.findOne({email}).select("+password");
    if (!user) {
      return NextResponse.json(
        {success: false, error: "Invalid email or password"},
        {status: 400}
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {success: false, error: "Invalid email or password"},
        {status: 400}
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before logging in",
          needsVerification: true,
          email: user.email,
        },
        {status: 403}
      );
    }

    // Generate token
    const token = createToken(user._id.toString());

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        isVerified: user.isVerified,
      },
    });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {success: false, error: "An error occurred during login"},
      {status: 500}
    );
  }
}
