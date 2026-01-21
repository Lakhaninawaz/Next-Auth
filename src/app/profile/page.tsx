"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", email: "", isVerified: false, _id: "" });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    setData(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Account</p>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Profile</h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              {data.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            {loading ? (
              <p className="text-slate-300">Loading...</p>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-lg font-semibold">
                    {data.username ? data.username.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">{data.username}</h2>
                    <p className="text-slate-300">{data.email}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-300">
                  <p>Status: {data.isVerified ? "Email verified" : "Email not verified"}</p>
                  <p className="mt-1">User ID: {data._id}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/profile/${data._id}`}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    View public profile
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 hover:brightness-110 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}