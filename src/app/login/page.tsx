"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!user.email || !user.password) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      toast.success("Login successful");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-3xl font-semibold">Welcome back</h1>
            <p className="text-sm text-slate-300">
              Sign in to continue to your account.
            </p>
          </div>

          <div className="flex flex-col gap-4">
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
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3 font-semibold shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Login"}
            </button>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <Link
                href="/resetpassword"
                className="hover:text-white transition"
              >
                Forgot password?
              </Link>
              <Link href="/signup" className="hover:text-white transition">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
