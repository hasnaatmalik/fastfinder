// API utility functions for making requests to the backend

// Base API URL - adjust if needed
const API_BASE_URL = "/api";

// Type definitions
type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  verificationCode?: string; // For development purposes only
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
};

type LoginData = {
  email: string;
  password: string;
};

type VerifyData = {
  email: string;
  code: string;
};

type ResendOtpData = {
  email: string;
};

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  password: string;
  confirmPassword: string;
};

// Registration
export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Login
export async function loginUser(data: LoginData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Important for cookies
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Verify account
export async function verifyAccount(data: VerifyData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Resend OTP
export async function resendOtp(data: ResendOtpData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Forgot password
export async function forgotPassword(
  data: ForgotPasswordData
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Reset password
export async function resetPassword(
  data: ResetPasswordData
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Logout
export async function logoutUser(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Get current user
export async function getCurrentUser(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

// Item related API calls
export async function getItems(query = ""): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items${query ? `?${query}` : ""}`,
      {
        credentials: "include",
      }
    );

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

export async function getItem(id: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

export async function createItem(data: any): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

export async function updateItem(id: string, data: any): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}

export async function deleteItem(id: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {success: false, error: "Failed to connect to the server"};
  }
}
