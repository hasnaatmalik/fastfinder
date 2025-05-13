import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
) {
  try {
    // For development, log the OTP instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log(`Verification OTP for ${email}: ${otp}`);
      return {success: true};
    }

    const mailOptions = {
      from: `"FAST Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - FAST Finder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to FAST Finder!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with FAST Finder. To complete your registration, please use the verification code below:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="font-size: 24px; margin: 0; letter-spacing: 5px;">${otp}</h3>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>The FAST Finder Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Email sending error:", error);
    return {success: false, error: "Failed to send verification email"};
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  try {
    // For development, log the token instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset token for ${email}: ${token}`);
      return {success: true};
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"FAST Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - FAST Finder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>The FAST Finder Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Email sending error:", error);
    return {success: false, error: "Failed to send password reset email"};
  }
}
