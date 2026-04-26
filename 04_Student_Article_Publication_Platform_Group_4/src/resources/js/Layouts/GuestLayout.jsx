import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 top-1/4 h-40 w-40 animate-pulse rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
                <Link href="/" className="mb-8 inline-flex items-center gap-2 self-start">
                    <ApplicationLogo className="h-10 w-10" />
                    <span className="text-sm font-semibold tracking-wide text-slate-300">Campus Quill</span>
                </Link>

                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <section>
                        <p className="mb-3 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                            Academic Publication
                        </p>
                        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                            Publish bright ideas with a clean role-based workflow.
                        </h1>
                        <p className="mt-4 max-w-xl text-slate-300">
                            Students discover quality articles, writers share expertise, and admins keep the platform curated.
                        </p>
                    </section>

                    <section className="rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-cyan-900/20 backdrop-blur">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
