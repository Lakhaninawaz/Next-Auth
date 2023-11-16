import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"


connect();

export async function POST(request:NextRequest) {
    try {
        
        const reqBody = await request.json();
        
        const {password, forgotPasswordToken} = reqBody;
        console.log(forgotPasswordToken);
        const user:any = await User.findOne({forgotPasswordToken})
        console.log(user);
        if(!user){
            return NextResponse.json({ error: "User Not Found!" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update the password field in the document
    const updatedUser = await User.updateOne(
        { _id: user._id }, // Use the appropriate identifier, like _id
        { $set: { password: hashedPassword } }
      );
  
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();

      const response = NextResponse.json({
        message: "Password Updated Successful",
        success : true,
    });

    response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});

    return response

    } catch (error:any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}