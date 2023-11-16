import {  NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();


export async function POST(request: NextResponse){

    try {
        const reqBody = await request.json()
        const {token} = reqBody // user requested token
        console.log(token);

        const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}});
        console.log(user);
        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user);

        user.forgotPasswordToken = token;

        const response = NextResponse.json({
            message: "Email verified successfully",
            success : true,
        })

        response.cookies.set("token", token, {httpOnly: true});

        return response;

        

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

}