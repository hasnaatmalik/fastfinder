import {NextResponse} from "next/server";
import {clearAuthCookie} from "@/lib/auth";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear auth cookie
    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {success: false, error: "An error occurred during logout"},
      {status: 500}
    );
  }
}
