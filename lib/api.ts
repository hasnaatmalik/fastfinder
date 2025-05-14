import {jwtVerify, SignJWT} from "jose";
import {cookies} from "next/headers";

// Clean up the JWT_SECRET by removing line breaks and extra spaces
const JWT_SECRET = (process.env.JWT_SECRET || "your-secret-key").replace(
  /\s+/g,
  ""
);
const JWT_EXPIRES_IN = "7d";

// Create JWT token
export async function createToken(userId: string) {
  try {
    console.log("Auth.ts: Creating token with userId:", userId);
    console.log(
      "Auth.ts: Using JWT_SECRET (first 10 chars):",
      JWT_SECRET.substring(0, 10)
    );

    const token = await new SignJWT({sub: userId})
      .setProtectedHeader({alg: "HS256"})
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(new TextEncoder().encode(JWT_SECRET));

    console.log(
      "Auth.ts: Token created successfully (first 20 chars):",
      token.substring(0, 20)
    );
    return token;
  } catch (error) {
    console.error("Auth.ts: Error creating token:", error);
    throw error;
  }
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    console.log(
      "Auth.ts: Verifying token (first 20 chars):",
      token.substring(0, 20)
    );
    console.log(
      "Auth.ts: Using JWT_SECRET (first 10 chars):",
      JWT_SECRET.substring(0, 10)
    );

    const {payload} = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    console.log("Auth.ts: Token verified successfully, payload:", payload);
    return payload;
  } catch (error) {
    console.error("Auth.ts: Token verification error:", error);
    return null;
  }
}

// Get current user from token
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
