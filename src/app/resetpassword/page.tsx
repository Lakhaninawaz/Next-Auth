"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [user, setUser] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [myToast, setMyToast] = useState(false);

  const onForgotEmailVerify = async (e: any) => {
    if (user.email === "") {
      setError("Please fill the email field");
      toast.error("Please fill the email field");
    } else {
      e.preventDefault();
      try {
        setLoading(true);
        const response = await axios.post("/api/users/forgotpassword", user);
        setMyToast(true);
      } catch (err: any) {
        setLoading(false);
        toast.error("Email not found!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-3xl font-semibold">
              Forgot your password?
            </h1>
            <p className="text-sm text-slate-300">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {myToast ? (
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 px-4 py-3 text-sm">
              Reset password link has been sent to your email address.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <label className="text-sm text-slate-200">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
                  type="email"
                  value={user.email}
                  placeholder="you@example.com"
                  onChange={(e) => setUser({ email: e.target.value })}
                />
              </label>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3 font-semibold shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={onForgotEmailVerify}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <div className="text-sm text-slate-300 text-center">
                Remembered it?{" "}
                <Link href="/login" className="text-white hover:text-indigo-200">
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;