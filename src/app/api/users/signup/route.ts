import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        console.log(reqBody);

        //check if user already exists by email or username
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //create a new user in the database (but don't save yet)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        //send verification email BEFORE saving user (updateDb=false since user not in DB yet)
        const hashedToken = await sendEmail({
            email,
            emailType: "VERIFY",
            userId: newUser._id,
            updateDb: false
        })

        // Set the token returned by mailer on the new user
        newUser.verifyToken = hashedToken;
        newUser.verifyTokenExpiry = new Date(Date.now() + 3600000);

        //save user after email is sent successfully
        const savedUser = await newUser.save();
        // console.log(savedUser);

        return NextResponse.json({
            message: "Verification email sent. Please verify your email to complete registration.",
            succeess: true,
            savedUser
        })
    } catch (error: any) {
        console.log("Error in signup route:", error);
        if (error?.code === 11000) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}