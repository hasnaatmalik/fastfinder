import nodemailer from "nodemailer";

// Configure email transporter
let transporter: nodemailer.Transporter;

// Initialize the transporter based on environment
function getTransporter() {
  if (transporter) return transporter;

  // For development/testing without actual email sending
  if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
    console.log("Creating test account for email");
    // Create a test account using Ethereal Email
    return nodemailer.createTestAccount().then((account) => {
      console.log("Test email account created:", account);
      return nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  // For production or when email credentials are provided
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
) {
  try {
    // For development, log the OTP instead of sending an email if no email credentials
    if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
      console.log(`[DEV MODE] Verification OTP for ${email}: ${otp}`);
      return {success: true};
    }

    const transport = await getTransporter();

    const mailOptions = {
      from: `"FAST Finder" <${
        process.env.EMAIL_USER || "noreply@fastfinder.com"
      }>`,
      to: email,
      subject: "Verify Your Email - FAST Finder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FE7743;">Welcome to FAST Finder!</h2>
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

    const info = await transport.sendMail(mailOptions);

    // Log email URL for development testing with Ethereal
    if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

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
    // For development, log the token instead of sending an email if no email credentials
    if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
      console.log(`[DEV MODE] Password reset token for ${email}: ${token}`);
      return {success: true};
    }

    const transport = await getTransporter();
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"FAST Finder" <${
        process.env.EMAIL_USER || "noreply@fastfinder.com"
      }>`,
      to: email,
      subject: "Reset Your Password - FAST Finder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FE7743;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Use the code below to reset your password:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 30px 0;">
            <h3 style="font-size: 24px; margin: 0; letter-spacing: 5px;">${token}</h3>
          </div>
          <p>Or click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FE7743; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>The FAST Finder Team</p>
        </div>
      `,
    };

    const info = await transport.sendMail(mailOptions);

    // Log email URL for development testing with Ethereal
    if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return {success: true};
  } catch (error) {
    console.error("Email sending error:", error);
    return {success: false, error: "Failed to send password reset email"};
  }
}
