import {type NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import {verifyToken} from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {success: false, error: "Not authenticated"},
        {status: 401}
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json(
        {success: false, error: "Invalid token"},
        {status: 401}
      );
    }

    await connectToDatabase();

    // Find user
    const user = await User.findById(decoded.sub);
    if (!user) {
      return NextResponse.json(
        {success: false, error: "User not found"},
        {status: 404}
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      {success: false, error: "An error occurred while fetching user data"},
      {status: 500}
    );
  }
}
