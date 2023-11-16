"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function VerifyEmailReset() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading ] = useState(false)
  const [user, setUser] = useState({
    password: "",
    forgotPasswordToken: "",
  });

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemailpass", { token });
      setVerified(true);

      user.forgotPasswordToken = token;
      setUser(user);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  const onSet = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true)

      const res = await axios.post("api/users/updatepassword", user);
      console.log(res);

      toast.success(res.data.message);

        router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      {verified && (
        <div className="flex flex-col justify-center items-center gap-2 h-[32rem] w-[32rem]  py-2 border border-black/30 shadow-xl rounded-lg">
        <h1 className="text-4xl font-semibold text-primary">{loading ? "Processing" : "Enter New Password"}</h1>
          <h2>
            {token && (
              <div className=" items-center font-bold text-green-500 rounded-md border-8 border-l-green-600 mb-6  p-3">
                Email Verified Successfully
              </div>
            )}
          </h2>

          <form className="flex flex-col items-center w-full justify-start p-3 gap-4">
            

            <label className="text-lg text-accent font-semibold block w-[80%] text-left mb-2">New Password :</label>
            <input
              className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 w-[80%] text-secondary"
              type="text"
              id="password"
              value={user.password}
              placeholder="Enter your new password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button className="py-2 px-4 text-base hover:scale-110 border border-black/40 rounded-lg hover:bg-black hover:text-white transition mb-4 focus:outline-none" onClick={onSet}>
              Set New Password
            </button>
            <p className="text-red-500">Please do not refresh this page!</p>
          </form>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Something Wrong!</h2>
        </div>
      )}



      <Toaster />
    </div>
  );
}