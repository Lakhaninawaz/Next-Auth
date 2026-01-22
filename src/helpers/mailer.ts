import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

type EmailType = "VERIFY" | "RESET";

interface SendEmailArgs {
  email: string;
  emailType: EmailType;
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailArgs) => {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, EMAIL_FROM, DOMAIN } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials are missing (EMAIL_USER / EMAIL_PASS)");
  }

  const host = EMAIL_HOST || "sandbox.smtp.mailtrap.io";
  const port = Number(EMAIL_PORT) || 2525;
  const from = EMAIL_FROM || "no-reply@example.com";

  // create a hashed Token
  const hashedToken = await bcryptjs.hash(userId.toString(), 10);

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

  const baseDomain = (DOMAIN || "http://localhost:3000").replace(/\/+$/, "");
  const encodedToken = encodeURIComponent(hashedToken);

  const verifyLink = `${baseDomain}/verifyemail?token=${encodedToken}`;
  const resetLink = `${baseDomain}/updatePassword?token=${encodedToken}`;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Use SSL only for port 465, TLS for 587
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
        ? `<p>Click <a href="${verifyLink}">here</a> to verify your email, or copy and paste this link:<br>${verifyLink}</p>`
        : `<p>Click <a href="${resetLink}">here</a> to reset your password, or copy and paste this link:<br>${resetLink}</p>`,
  };

  try {
    return await transport.sendMail(mailOption);
  } catch (error: any) {
    // surface the SMTP error up to the API route
    throw new Error(error.message || "Failed to send email");
  }
};