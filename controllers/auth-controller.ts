"use server";
import {
  createUser,
  getUserByEmail,
  updateUser,
  setCurrentUser,
  getUserByVerificationToken,
  getUserByResetToken,
} from "@/models/User";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/email-service";
import crypto from "crypto";

// Generate a random token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Register a new user
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const contactNumber = formData.get("contactNumber") as string;

  // Validation
  if (!name || !email || !password || !confirmPassword || !contactNumber) {
    return {success: false, error: "Please fill in all fields"};
  }

  if (password !== confirmPassword) {
    return {success: false, error: "Passwords do not match"};
  }

  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return {success: false, error: "Email already in use"};
  }

  // Generate verification token
  const verificationToken = generateToken();
  const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Create user
  const user = createUser({
    name,
    email,
    password, // In a real app, you would hash this password
    contactNumber,
    verificationToken,
    verificationTokenExpiry,
    isVerified: false,
  });

  // Send verification email
  const emailResult = await sendVerificationEmail(
    email,
    name,
    verificationToken
  );
  if (!emailResult.success) {
    return {success: false, error: "Failed to send verification email"};
  }

  // Return success without setting the current user
  return {
    success: true,
    message:
      "Registration successful! Please check your email to verify your account.",
  };
}

// Verify email
export async function verifyEmail(token: string) {
  if (!token) {
    return {success: false, error: "Invalid verification token"};
  }

  const user = getUserByVerificationToken(token);
  if (!user) {
    return {success: false, error: "Invalid verification token"};
  }

  // Check if token is expired
  if (
    user.verificationTokenExpiry &&
    user.verificationTokenExpiry < Date.now()
  ) {
    return {success: false, error: "Verification token has expired"};
  }

  // Update user
  const updatedUser = updateUser(user.id, {
    isVerified: true,
    verificationToken: undefined,
    verificationTokenExpiry: undefined,
  });

  if (!updatedUser) {
    return {success: false, error: "Failed to verify email"};
  }

  return {
    success: true,
    message: "Email verified successfully! You can now log in.",
  };
}

// Login user
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  if (!email || !password) {
    return {success: false, error: "Please fill in all fields"};
  }

  // Find user
  const user = getUserByEmail(email);
  if (!user) {
    return {success: false, error: "Invalid email or password"};
  }

  // Check password
  if (user.password !== password) {
    // In a real app, you would compare hashed passwords
    return {success: false, error: "Invalid email or password"};
  }

  // Check if user is verified
  if (!user.isVerified) {
    return {
      success: false,
      error: "Please verify your email before logging in",
    };
  }

  // Set current user (without password)
  const {password: _, ...userWithoutPassword} = user;
  setCurrentUser(userWithoutPassword);

  return {success: true, message: "Login successful!"};
}

// Request password reset
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return {success: false, error: "Please provide your email address"};
  }

  const user = getUserByEmail(email);
  if (!user) {
    // Don't reveal that the user doesn't exist for security reasons
    return {
      success: true,
      message:
        "If your email is registered, you will receive a password reset link",
    };
  }

  // Generate reset token
  const resetToken = generateToken();
  const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  // Update user
  updateUser(user.id, {
    resetToken,
    resetTokenExpiry,
  });

  // Send password reset email
  await sendPasswordResetEmail(email, user.name, resetToken);

  return {
    success: true,
    message:
      "If your email is registered, you will receive a password reset link",
  };
}

// Reset password
export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !password || !confirmPassword) {
    return {success: false, error: "Please fill in all fields"};
  }

  if (password !== confirmPassword) {
    return {success: false, error: "Passwords do not match"};
  }

  const user = getUserByResetToken(token);
  if (!user) {
    return {success: false, error: "Invalid reset token"};
  }

  // Check if token is expired
  if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
    return {success: false, error: "Reset token has expired"};
  }

  // Update user
  updateUser(user.id, {
    password, // In a real app, you would hash this password
    resetToken: undefined,
    resetTokenExpiry: undefined,
  });

  return {
    success: true,
    message:
      "Password reset successful! You can now log in with your new password.",
  };
}

// Logout user
export async function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
  return {success: true};
}
