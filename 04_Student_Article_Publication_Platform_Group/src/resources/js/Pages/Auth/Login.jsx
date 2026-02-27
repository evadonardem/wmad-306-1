import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // The Dark Background
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-slate-900">
            <Head title="Log in" />

            {/* Main Glassmorphism Container with Neon Glow */}
            <div className="flex w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,238,255,0.1)] overflow-hidden">

                {/* Left Side: The Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">

                    {/* Subtle neon glow behind the form for depth */}
                    <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[100px] -z-10"></div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 text-sm">Sign in to access your publications.</p>
                    </div>

                    {status && <div className="mb-4 text-sm font-medium text-cyan-400">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Input (Glassmorphism style) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="your@email.com"
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        {/* Password Input (Glassmorphism style) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-slate-400 hover:text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/20 bg-slate-900/50 text-cyan-500 focus:ring-cyan-500/50"
                                />
                                <span className="ml-2">Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Neon Glowing Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-[0_0_15px_rgba(0,238,255,0.4)] hover:shadow-[0_0_25px_rgba(0,238,255,0.6)] transition-all duration-300 disabled:opacity-50 mt-4"
                        >
                            Log In
                        </button>
                    </form>
                </div>

                {/* Right Side: Cyan Gradient Panel (Hidden on mobile for scannability) */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 p-12 flex-col justify-center items-center text-center relative overflow-hidden">

                    {/* Decorative blurred shapes to add "Subtle Depth" */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl"></div>

                    <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg z-10">New Here?</h2>
                    <p className="text-cyan-50 text-lg mb-10 leading-relaxed max-w-sm z-10">
                        Join our Student Article Publication Platform to share your ideas and read amazing work.
                    </p>

                    {/* Link to Register Page */}
                    <Link
                        href={route('register')}
                        className="z-10 px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-lg"
                    >
                        Create an Account
                    </Link>
                </div>

            </div>
        </div>
    );
}
