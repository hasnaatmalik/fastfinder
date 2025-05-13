import {type NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";
import {createToken, setAuthCookie} from "@/lib/auth-edge";

export async function POST(request: NextRequest) {
  try {
    const {email, password} = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {success: false, error: "Email and password are required"},
        {status: 400}
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({email}).select(
      "+password +verificationCode +isVerified"
    );

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        {success: false, error: "Invalid email or password"},
        {status: 401}
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
          // Only in development, send the verification code for testing
          ...(process.env.NODE_ENV === "development" && {
            verificationCode: user.verificationCode,
          }),
        },
        {status: 403}
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {success: false, error: "Invalid email or password"},
        {status: 401}
      );
    }

    // Create JWT token
    const token = createToken(user._id.toString());

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
        },
      },
      {status: 200}
    );

    // Set auth cookie
    setAuthCookie(response, token);

    // Log for debugging
    console.log("Login successful, token set in cookie");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {success: false, error: "An error occurred during login"},
      {status: 500}
    );
  }
}
