"use client"

import axios from "axios"
import Link from "next/link"
import React, { useEffect, useState } from "react"

export default function VerifyEmailPage(){
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");

    const verifyUserEmail = async () => {
        try{
            await axios.post("/api/users/verifyemail", { token })
            setVerified(true);
        } 
        catch (error: any){
            setError(error.response.data.error)
            console.log(error);
            console.log(error.response.data.error);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, [token])
    

    useEffect(() => {
      if(token.length > 0){
        verifyUserEmail();
      }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 mt-1 bg-orange-500 text-black">{token ? `${token}` : "no Token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl bg-blue-500 text-black">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )
            }

            {error && (
                <div>
                    <h2 className="mt-2 px-2 text-2xl bg-red-500 text-black">{error !== "" ? `${error}`: "Error"}</h2>
                </div>
            )
            }
        </div>
    )
    
}