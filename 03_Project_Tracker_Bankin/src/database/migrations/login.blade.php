<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Alturos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
    <style>
        body { font-family: 'Figtree', sans-serif; }
        .sliding-panel { transition: transform 0.6s ease-in-out; }
        .overlay-panel { transition: transform 0.6s ease-in-out; }
    </style>
</head>
<body class="bg-slate-950 flex items-center justify-center min-h-screen p-4 selection:bg-emerald-500 selection:text-white">

    <!-- Background Mesh -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
    </div>

    <div class="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] border border-white/10 z-10"
         x-data="{ isSignUp: false }">

        <!-- Sign Up Form Container -->
        <div class="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out z-10 opacity-0"
             :class="isSignUp ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10'">
            <form action="{{ route('register') }}" method="POST" class="w-full max-w-xs space-y-4">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
                <div class="flex justify-center gap-4 mb-4">
                    <button type="button" class="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></button>
                    <button type="button" class="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.08-2.16 2.72-5.333 2.72-8.053 0-.72-.08-1.467-.213-2.187h-10.56z"/></svg></button>
                </div>
                <span class="block text-center text-xs text-slate-400">or use your email for registration</span>

                <input type="text" name="name" placeholder="Name" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />
                <input type="email" name="email" placeholder="Email" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />
                <input type="password" name="password_confirmation" placeholder="Confirm Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />

                <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 transition transform hover:scale-105">Sign Up</button>
            </form>
        </div>

        <!-- Sign In Form Container -->
        <div class="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out z-20"
             :class="isSignUp ? 'translate-x-full opacity-0' : 'opacity-100'">
            <form action="{{ route('login') }}" method="POST" class="w-full max-w-xs space-y-4">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-2 text-center">Sign In</h1>
                <div class="flex justify-center gap-4 mb-4">
                    <button type="button" class="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></button>
                    <button type="button" class="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.08-2.16 2.72-5.333 2.72-8.053 0-.72-.08-1.467-.213-2.187h-10.56z"/></svg></button>
                </div>
                <span class="block text-center text-xs text-slate-400">or use your email account</span>

                <input type="email" name="email" placeholder="Email" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" required />

                <a href="#" class="block text-xs text-slate-400 hover:text-emerald-400 text-center">Forgot your password?</a>

                <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 transition transform hover:scale-105">Sign In</button>
            </form>
        </div>

        <!-- Overlay Container -->
        <div class="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50"
             :class="isSignUp ? '-translate-x-full' : ''">
            <div class="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out flex items-center justify-center"
                 :class="isSignUp ? 'translate-x-1/2' : 'translate-x-0'">

                <!-- Overlay Left (Visible when Sign Up is active) -->
                <div class="w-1/2 flex flex-col items-center justify-center px-10 text-center transform transition-transform duration-700 ease-in-out"
                     :class="isSignUp ? 'translate-x-0' : '-translate-x-[20%]'">
                    <h1 class="text-3xl font-bold mb-4">Welcome Back!</h1>
                    <p class="text-sm mb-8 text-emerald-100">To keep connected with us please login with your personal info</p>
                    <button @click="isSignUp = false" class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/20 transition">Sign In</button>
                </div>

                <!-- Overlay Right (Visible when Sign In is active) -->
                <div class="w-1/2 flex flex-col items-center justify-center px-10 text-center transform transition-transform duration-700 ease-in-out"
                     :class="isSignUp ? 'translate-x-[20%]' : 'translate-x-0'">
                    <h1 class="text-3xl font-bold mb-4">Hello, Friend!</h1>
                    <p class="text-sm mb-8 text-emerald-100">Enter your personal details and start your journey with us</p>
                    <button @click="isSignUp = true" class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/20 transition">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
