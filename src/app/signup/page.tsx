"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!user.email || !user.password || !user.username) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
      return;
    }
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      toast.success("Signup successful");
      toast.success("Check your inbox to verify your email");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password && user.username));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Create account</h1>
            <p className="text-sm text-slate-300">
              Join us and start your journey today.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm text-slate-200">
              Username
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="yourname"
              />
            </label>

            <label className="text-sm text-slate-200">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>

            <label className="text-sm text-slate-200">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={onSignup}
              disabled={buttonDisabled || loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3 font-semibold shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Sign up"}
            </button>

            <p className="text-sm text-slate-300 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:text-indigo-200">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}