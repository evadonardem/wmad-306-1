import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        // The Dark Background
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-slate-900">
            <Head title="Register" />

            {/* Main Glassmorphism Container with Neon Glow */}
            <div className="flex w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,238,255,0.1)] overflow-hidden">

                {/* Left Side: Cyan Gradient Panel (Flipped for the "Slide" effect) */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-blue-600 to-cyan-500 p-12 flex-col justify-center items-center text-center relative overflow-hidden">

                    {/* Decorative blurred shapes */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl"></div>

                    <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg z-10">One of Us!</h2>
                    <p className="text-cyan-50 text-lg mb-10 leading-relaxed max-w-sm z-10">
                        Already have an account on the Student Article Publication Platform?
                    </p>

                    {/* Link back to Login */}
                    <Link
                        href={route('login')}
                        className="z-10 px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-lg"
                    >
                        Sign In Instead
                    </Link>
                </div>

                {/* Right Side: The Registration Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">

                    {/* Subtle neon glow */}
                    <div className="absolute top-0 right-0 w-full h-full bg-cyan-500/5 blur-[100px] -z-10"></div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                        <p className="text-slate-400 text-sm">Join the platform to start publishing.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="Your Name"
                                required
                            />
                            <InputError message={errors.name} className="mt-1 text-red-400 text-xs" />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="your@email.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-1 text-red-400 text-xs" />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                            <InputError message={errors.password} className="mt-1 text-red-400 text-xs" />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1 text-red-400 text-xs" />
                        </div>

                        {/* Neon Glowing Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-[0_0_15px_rgba(0,238,255,0.4)] hover:shadow-[0_0_25px_rgba(0,238,255,0.6)] transition-all duration-300 disabled:opacity-50 mt-2"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
