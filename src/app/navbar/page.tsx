import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-20">
            <nav className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/20">
                <Link href="/" className="flex items-center gap-2 text-white">
                    <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-sm font-semibold">
                        NA
                    </span>
                    <span className="text-lg font-semibold">Next Auth</span>
                </Link>

                <div className="flex items-center gap-2 text-sm">
                    <Link
                        href="/login"
                        className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-md shadow-indigo-500/25 hover:brightness-110 transition"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </header>
    );
}