"use client"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function ProfilePage() {

    const router = useRouter();
    const [data, setData] = useState({ username: "", email: "", isVerified: false, _id: "" })

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            toast.success('Logout Successful')
            router.push('/login')
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data)
    }

    useEffect(() => {
        getUserDetails()
    }, [])


    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8">
          {/* Toast notifications */}
          <Toaster position="top-center" reverseOrder={false} />
    
          {/* Page title */}
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <hr className="w-full border-t border-gray-300 mb-8" />
    
          {/* User information */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">
              {data.username === "" ? "Processing" : (
                <Link href={`/profile/${data._id}`}>
                  <p className="text-green-500 underline">{data.username}</p>
                </Link>
              )}
            </h2>
    
            {/* Email and Verification status */}
{data.username === "" ? (
  "Processing"
) : (
  <>
    <p className="text-gray-600 mb-2">{data.email}</p>
    {data.isVerified ? (
      <p className="text-green-500 mb-4">Email Verified</p>
    ) : (
      <p className="text-red-500 mb-4">Email Not Verified</p>
    )}
  </>
)}

    
            {/* Logout button */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      );
}