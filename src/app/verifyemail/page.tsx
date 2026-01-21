"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
            toast.success("Email verified successfully");
        } catch (err: any) {
            const msg = err.response?.data?.error || "Verification failed";
            setError(msg);
            toast.error(msg);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
            <Toaster position="top-center" />
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Email verification</p>
                    <h1 className="mt-2 text-3xl font-semibold">Verify your email</h1>
                    <p className="mt-3 text-sm text-slate-300">
                        We&apos;re validating your verification link. This page will update automatically.
                    </p>

                    {verified && (
                        <div className="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 px-4 py-3">
                            Email verified successfully.
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 text-sm">
                        <Link
                            href="/login"
                            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 hover:brightness-110 transition"
                        >
                            Continue to login
                        </Link>
                        <Link
                            href="/signup"
                            className="text-indigo-200 hover:text-white"
                        >
                            Need a new account? Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}