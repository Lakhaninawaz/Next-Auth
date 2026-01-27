import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

type EmailType = "VERIFY" | "RESET";

interface SendEmailArgs {
  email: string;
  emailType: EmailType;
  userId: string;
  updateDb?: boolean; // Optional flag to update database
}

export const sendEmail = async ({ email, emailType, userId, updateDb = true }: SendEmailArgs) => {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, EMAIL_FROM, DOMAIN } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials are missing (EMAIL_USER / EMAIL_PASS)");
  }

  const from = EMAIL_FROM || "no-reply@example.com";

  // create a hashed Token
  const hashedToken = await bcryptjs.hash(userId.toString(), 10);

  // Only update database if updateDb is true (for existing users)
  if (updateDb) {
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
  }

  const baseDomain = (DOMAIN || "http://localhost:3000").replace(/\/+$/, "");
  const encodedToken = encodeURIComponent(hashedToken);

  const verifyLink = `${baseDomain}/verifyemail?token=${encodedToken}`;
  const resetLink = `${baseDomain}/updatePassword?token=${encodedToken}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Fail fast if credentials are bad instead of silently succeeding
  await transport.verify();

  const mailOption = {
    from,
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html:
      emailType === "VERIFY"
        ? `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
                  <p style="font-size: 14px; margin-bottom: 30px; color: #666;">Thank you for signing up! Please verify your email address to complete your registration and unlock all features of our platform.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyLink}" style="display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
                  </div>
                  <p style="font-size: 13px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    Or copy and paste this link in your browser:<br>
                    <span style="color: #667eea; word-break: break-all; font-size: 12px;">${verifyLink}</span>
                  </p>
                  <p style="font-size: 12px; color: #999; margin-top: 20px;">This link will expire in 1 hour for security purposes.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                  <p>© 2026 Your Company. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
        : `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
                  <p style="font-size: 14px; margin-bottom: 30px; color: #666;">We received a request to reset your password. Click the button below to create a new password. If you didn't make this request, you can ignore this email.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #f5576c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
                  </div>
                  <p style="font-size: 13px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    Or copy and paste this link in your browser:<br>
                    <span style="color: #f5576c; word-break: break-all; font-size: 12px;">${resetLink}</span>
                  </p>
                  <p style="font-size: 12px; color: #999; margin-top: 20px;">This link will expire in 1 hour for security purposes.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                  <p>© 2026 Your Company. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
  };

  try {
    await transport.sendMail(mailOption);
    return hashedToken; // Return the token for use in signup
  } catch (error: any) {
    // surface the SMTP error up to the API route
    throw new Error(error.message || "Failed to send email");
  }
};