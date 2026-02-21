@extends('projects.app')

@section('title', 'Sign In / Sign Up')

@section('content')
<div class="flex items-center justify-center min-h-screen p-4" x-data="{ isSignUp: {{ $errors->has('name') ? 'true' : 'false' }} }">
    <div class="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[500px] border border-white/10"
         :class="{ 'right-panel-active': isSignUp }">

        <!-- Sign Up Container -->
        <div class="absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 opacity-0 z-10"
             :class="isSignUp ? 'translate-x-[100%] opacity-100 z-50' : ''">
            <form method="POST" action="{{ route('register') }}" class="bg-slate-900 flex flex-col items-center justify-center h-full px-10 text-center">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-4">Create Account</h1>

                @if($errors->any() && $errors->has('name'))
                    <div class="w-full text-red-400 text-xs mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">
                        {{ $errors->first() }}
                    </div>
                @endif

                <div class="flex gap-4 mb-4">
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><i class="fab fa-google"></i>G</a>
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><i class="fab fa-linkedin-in"></i>L</a>
                </div>
                <span class="text-slate-400 text-sm mb-4">or use your email for registration</span>

                <input type="text" name="name" value="{{ old('name') }}" placeholder="Name" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 mb-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none" required />
                <input type="email" name="email" value="{{ old('email') }}" placeholder="Email" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 mb-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 mb-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none" required />

                <button class="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-10 rounded-full uppercase tracking-wider text-xs hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">Sign Up</button>
            </form>
        </div>

        <!-- Sign In Container -->
        <div class="absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-20"
             :class="isSignUp ? 'translate-x-[100%]' : ''">
            <form method="POST" action="{{ route('login') }}" class="bg-slate-900 flex flex-col items-center justify-center h-full px-10 text-center">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-4">Sign in</h1>

                @if($errors->any() && !$errors->has('name'))
                    <div class="w-full text-red-400 text-xs mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">
                        {{ $errors->first() }}
                    </div>
                @endif

                <div class="flex gap-4 mb-4">
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><i class="fab fa-google"></i>G</a>
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><i class="fab fa-linkedin-in"></i>L</a>
                </div>
                <span class="text-slate-400 text-sm mb-4">or use your account</span>

                <input type="email" name="email" value="{{ old('email') }}" placeholder="Email" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 mb-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border-none rounded-lg px-4 py-3 mb-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none" required />

                <a href="#" class="text-slate-400 text-xs mt-2 mb-6 hover:text-emerald-400 transition-colors">Forgot your password?</a>
                <button class="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-10 rounded-full uppercase tracking-wider text-xs hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">Sign In</button>
            </form>
        </div>

        <!-- Overlay Container -->
        <div class="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-100"
             :class="isSignUp ? '-translate-x-[100%]' : ''">
            <div class="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white relative -left-[100%] h-full w-[200%] transform transition-transform duration-700 ease-in-out"
                 :class="isSignUp ? 'translate-x-[50%]' : ''">

                <!-- Overlay Left (For Sign In view) -->
                <div class="absolute flex flex-col items-center justify-center h-full w-1/2 text-center top-0 px-10 transform transition-transform duration-700 ease-in-out -translate-x-[20%]"
                     :class="isSignUp ? 'translate-x-0' : ''">
                    <h1 class="text-3xl font-bold mb-4">Welcome Back!</h1>
                    <p class="text-sm leading-relaxed mb-8 text-emerald-100">To keep connected with us please login with your personal info</p>
                    <button @click="isSignUp = false" class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full uppercase tracking-wider text-xs hover:bg-white hover:text-emerald-600 transition-colors">Sign In</button>
                </div>

                <!-- Overlay Right (For Sign Up view) -->
                <div class="absolute flex flex-col items-center justify-center h-full w-1/2 text-center top-0 right-0 px-10 transform transition-transform duration-700 ease-in-out"
                     :class="isSignUp ? 'translate-x-[20%]' : 'translate-x-0'">
                    <h1 class="text-3xl font-bold mb-4">Hello, Friend!</h1>
                    <p class="text-sm leading-relaxed mb-8 text-emerald-100">Enter your personal details and start your journey with ProTrack</p>
                    <button @click="isSignUp = true" class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full uppercase tracking-wider text-xs hover:bg-white hover:text-emerald-600 transition-colors">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
