import React from "react";
import Link from "next/link";
import Navbar from "./navbar/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200">
          Secure auth starter
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
          Authentication that feels modern, simple, and fast.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Sign up, log in, verify your email, and reset passwords with a clean experience
          across every step.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:brightness-110 transition"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-14 grid w-full gap-4 md:grid-cols-3">
          {["Email verification", "Password resets", "Profile access"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/10"
            >
              <p className="text-sm uppercase tracking-[0.15em] text-slate-300">Feature</p>
              <p className="mt-2 text-lg font-semibold">{item}</p>
              <p className="mt-2 text-slate-300 text-sm">
                Seamless flows with consistent styling and toast feedback.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
