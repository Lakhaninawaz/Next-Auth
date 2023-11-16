import User from "@/models/userModel"
import nodemailer from "nodemailer"
import bcryptjs, { hash } from 'bcryptjs'


export const sendEmail = async({email, emailType, userId}: any) => {
    try{
        //create a hashed Token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        //create transporter
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOption = {
            from: 'nawaz@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html:`${emailType === "VERIFY"? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>to Verify your email} 
            or copy and paste the link in your browser, <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
            :            
            `<p>Click <a href="${process.env.DOMAIN}/updatePassword?token=${hashedToken}">here</a>to Reset your password} 
            or copy and paste the link in your browser, <br> ${process.env.DOMAIN}/updatePassword?token=${hashedToken}
            </p>`
          }`
        }

          const mailresponse = await transport.sendMail(mailOption);

          return mailresponse;
    } catch(error:any){
        throw new Error(error.message);
    }
}