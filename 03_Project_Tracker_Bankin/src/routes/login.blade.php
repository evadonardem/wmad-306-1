<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Alturos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <style>
        body { font-family: 'Figtree', sans-serif; }

        /* Sliding Animation Classes */
        .container.right-panel-active .sign-in-container {
            transform: translateX(100%);
        }
        .container.right-panel-active .sign-up-container {
            transform: translateX(100%);
            opacity: 1;
            z-index: 5;
            animation: show 0.6s;
        }
        @keyframes show {
            0%, 49.99% { opacity: 0; z-index: 1; }
            50%, 100% { opacity: 1; z-index: 5; }
        }
        .container.right-panel-active .overlay-container {
            transform: translateX(-100%);
        }
        .container.right-panel-active .overlay {
            transform: translateX(50%);
        }
        .container.right-panel-active .overlay-left {
            transform: translateX(0);
        }
        .container.right-panel-active .overlay-right {
            transform: translateX(20%);
        }
    </style>
</head>
<body class="bg-slate-950 flex items-center justify-center min-h-screen p-4 selection:bg-emerald-500 selection:text-white">

    <!-- Background Mesh -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
    </div>

    <div class="container relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] border border-white/10 z-10" id="container">

        <!-- Sign Up Form Container -->
        <div class="form-container sign-up-container absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out opacity-0 z-1">
            <form action="{{ route('register') }}" method="POST" class="w-full max-w-xs space-y-4">
                <div class="h-full flex flex-col justify-center items-center p-10 text-center">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
                <div class="flex justify-center gap-4 mb-4">
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"><i class="fab fa-google"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"><i class="fab fa-apple"></i></a>
                </div>
                <span class="block text-center text-xs text-slate-400">or use your email for registration</span>

                <input type="text" name="name" placeholder="Name" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />
                <input type="email" name="email" placeholder="Email" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />
                <input type="password" name="password_confirmation" placeholder="Confirm Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />

                <button type="submit" class="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-teal-500/20 transition transform hover:scale-105">Sign Up</button>
                </div>
            </form>
        </div>

        <!-- Sign In Form Container -->
        <div class="form-container sign-in-container absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out z-2">
            <form action="{{ route('login') }}" method="POST" class="w-full max-w-xs space-y-4">
                <div class="h-full flex flex-col justify-center items-center p-10 text-center">
                @csrf
                <h1 class="text-3xl font-bold text-white mb-2 text-center">Sign In</h1>
                <div class="flex justify-center gap-4 mb-4">
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"><i class="fab fa-google"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"><i class="fab fa-apple"></i></a>
                </div>
                <span class="block text-center text-xs text-slate-400">or use your email account</span>

                <input type="email" name="email" placeholder="Email" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />
                <input type="password" name="password" placeholder="Password" class="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition" required />

                <a href="#" class="block text-xs text-slate-400 hover:text-teal-400 text-center">Forgot your password?</a>

                <button type="submit" class="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-teal-500/20 transition transform hover:scale-105">Sign In</button>
                </div>
            </form>
        </div>

        <!-- Overlay Container -->
        <div class="overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50">
            <div class="overlay bg-gradient-to-br from-teal-400 to-teal-600 text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out">

                <!-- Overlay Left (Visible when Sign Up is active) -->
                <div class="overlay-panel overlay-left absolute flex flex-col items-center justify-center top-0 h-full w-1/2 px-10 text-center transform -translate-x-[20%] transition-transform duration-700 ease-in-out">
                    <h1 class="text-3xl font-bold mb-4">Welcome Back!</h1>
                    <p class="text-sm mb-8 text-teal-100">To keep connected with us please login with your personal info</p>
                    <button class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/20 transition" id="signIn">Sign In</button>
                </div>

                <!-- Overlay Right (Visible when Sign In is active) -->
                <div class="overlay-panel overlay-right absolute flex flex-col items-center justify-center top-0 right-0 h-full w-1/2 px-10 text-center transform transition-transform duration-700 ease-in-out">
                    <h1 class="text-3xl font-bold mb-4">Hello, Friend!</h1>
                    <p class="text-sm mb-8 text-teal-100">Enter your personal details and start your journey with us</p>
                    <button class="bg-transparent border border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/20 transition" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    </script>
</body>
</html>
