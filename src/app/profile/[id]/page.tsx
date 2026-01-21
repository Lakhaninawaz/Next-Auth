export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Profile</p>
                <h1 className="mt-2 text-3xl font-semibold">User Profile</h1>
                <p className="mt-2 text-sm text-slate-300">Dynamic route example</p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-semibold">
                        ID
                    </span>
                    <span className="text-slate-100 break-all">{id}</span>
                </div>
            </div>
        </div>
    );
}