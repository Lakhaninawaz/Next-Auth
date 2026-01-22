"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
          <p className="text-sm text-slate-200">Loading reset page...</p>
        </div>
      }
    >
      <VerifyEmailReset />
    </Suspense>
  );
}

function VerifyEmailReset() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [loading, setLoading ] = useState(false)
  const [user, setUser] = useState({
    password: "",
    forgotPasswordToken: "",
  });

  const verifyUserEmail = async (resetToken: string) => {
    try {
      await axios.post("/api/users/verifyemailpass", { token: resetToken });
      setVerified(true);
      setUser((prev) => ({ ...prev, forgotPasswordToken: resetToken }));
    } catch (err: any) {
      const msg = err.response?.data?.error || "The reset link is invalid or expired.";
      console.log(err);
      setError(msg);
    }
  };

  useEffect(() => {
    const urlToken =
      searchParams.get("token") || Array.from(searchParams.values())[0] || "";

    if (!urlToken) {
      setError("Reset token is missing from the URL.");
      return;
    }

    setToken(urlToken);
  }, [searchParams]);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail(token);
    }
  }, [token]);

  const onSet = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true)

      const res = await axios.post("/api/users/updatepassword", user);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        {verified ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Password reset</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {loading ? "Processing" : "Set a new password"}
            </h1>
            <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 px-4 py-3">
              Email verified successfully
            </div>

            <form className="mt-6 flex flex-col gap-4">
              <label className="text-sm text-slate-200">
                New password
                <input
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
                  type="password"
                  id="password"
                  value={user.password}
                  placeholder="Enter your new password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
              </label>

              <button
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3 font-semibold shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={onSet}
                disabled={loading || !user.password}
              >
                {loading ? "Saving..." : "Set new password"}
              </button>
              <p className="text-xs text-slate-400 text-center">Don&apos;t refresh this page.</p>
            </form>
          </div>
        ) : (
          error ? (
            <div className="bg-white/10 backdrop-blur-xl border border-red-500/30 text-red-200 rounded-2xl shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold">Something went wrong</h2>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
              <p className="text-sm text-slate-200">Validating your reset link...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}