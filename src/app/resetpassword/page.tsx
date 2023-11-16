"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [user, setUser] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [myToast, setMyToast] = useState(false);

  const onForgotEmailVerify = async (e:any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", user);
      setMyToast(true);
      console.log("Email Found", response.data);
    } catch (error:any) {
      setLoading(false);
      toast.error("Email Not Found!");
      throw new Error(error);
    }
  };

  return (
    <div className="flex items-center min-h-screen justify-center">
      {myToast ? (
        <div className="items-center font-bold text-green-500 rounded-md border-8 border-l-green-600 p-3">
          <h1>Reset password link has been sent to your email address!</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 h-[32rem] w-[32rem]  py-2 border border-black/30 shadow-xl rounded-lg">
          <h1 className="text-3xl font-semibold mb-5">{loading ? "Processing" : "Forgot Password ...?" }</h1>

          <form className="flex flex-col items-center w-full justify-start p-3 gap-4">
            <label htmlFor="email" className="text-lg text-accent font-semibold block w-[80%] text-left mb-2">
              Email:
            </label>
            <input
              className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 w-[80%] text-secondary"
              type="email"
              id="email"
              value={user.email}
              placeholder="Enter your email"
              onChange={(e) => setUser({ email: e.target.value })}
            />

            <button
              className="py-2 px-4 text-base hover:scale-110 border border-black/40 rounded-lg hover:bg-black hover:text-white transition mb-4 focus:outline-none"
              onClick={onForgotEmailVerify}
            >
              Submit
            </button>
          </form>

          <Link href="/login" className="cursor underline text-blue-500 text-lg mt-2">
            Visit Login Page
          </Link>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ForgotPasswordPage;