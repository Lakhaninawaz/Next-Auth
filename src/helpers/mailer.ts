import User from "@/models/userModel"
import nodemailer from "nodemailer"
import bcryptjs, { hash } from 'bcryptjs'


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
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

    const baseDomain = (process.env.DOMAIN || "http://localhost:3000").replace(/\/+$/, "");
    const encodedToken = encodeURIComponent(hashedToken);

    const verifyLink = `${baseDomain}/verifyemail?token=${encodedToken}`;
    const resetLink = `${baseDomain}/updatePassword?token=${encodedToken}`;

    // create transporter
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: "nawaz@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? `<p>Click <a href="${verifyLink}">here</a> to verify your email, or copy and paste this link:<br>${verifyLink}</p>`
          : `<p>Click <a href="${resetLink}">here</a> to reset your password, or copy and paste this link:<br>${resetLink}</p>`,
    };

    const mailresponse = await transport.sendMail(mailOption);

    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};