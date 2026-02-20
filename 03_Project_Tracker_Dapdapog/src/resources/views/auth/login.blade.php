<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- If Tailwind is compiled via Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            background: linear-gradient(135deg, #0f172a, #1e293b);
        }

        .fade-in {
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.95);
        }

        .donut {
            animation: spin 10s linear infinite;
            width: 220px;
            height: 220px;
            filter: drop-shadow(0 0 25px rgba(59,130,246,0.35));
            transition: transform 0.4s ease;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .donut-container:hover .donut {
            animation-duration: 4s;
        }

        .pulse {
            animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
            0%,100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .error .donut-ring {
            stroke: url(#redGradient) !important;
            filter: drop-shadow(0 0 25px rgba(248,113,113,0.6));
        }
    </style>
</head>

<body class="fade-in flex items-center justify-center min-h-screen">

<div class="card rounded-2xl shadow-2xl max-w-5xl w-full flex overflow-hidden">

    <!-- LEFT: LOGIN FORM -->
    <div class="w-1/2 p-12">
        <h2 class="text-4xl font-bold text-slate-800 mb-2">Welcome Back</h2>
        <p class="text-slate-500 mb-8">Sign in to manage your projects efficiently.</p>

        <form method="POST" action="{{ route('login') }}" class="space-y-6">
            @csrf

            <div>
                <label class="block text-sm font-medium text-slate-700">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value="{{ old('email') }}"
                    required
                    autofocus
                    class="mt-1 w-full px-4 py-3 border rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
                @error('email')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    class="mt-1 w-full px-4 py-3 border rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
                @error('password')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex items-center justify-between text-sm">
                <label class="flex items-center space-x-2">
                    <input type="checkbox" name="remember" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="text-slate-700">Remember me</span>
                </label>

                <a href="{{ route('password.request') }}" class="text-blue-600 hover:underline">
                    Forgot password?
                </a>
            </div>

            <button
                type="submit"
                class="w-full py-3 bg-blue-700 text-white rounded-lg shadow-lg transition transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
                Sign In
            </button>
        </form>
    </div>

    <!-- RIGHT: DONUT LOGO -->
    <div class="w-1/2 bg-slate-900 flex items-center justify-center relative">

        <div class="donut-container" id="donutContainer">
            <svg class="donut" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

                <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#2563eb"/>
                        <stop offset="100%" stop-color="#3b82f6"/>
                    </linearGradient>

                    <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#b91c1c"/>
                        <stop offset="100%" stop-color="#f87171"/>
                    </linearGradient>
                </defs>

                <circle
                    class="donut-ring"
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="url(#blueGradient)"
                    stroke-width="40"
                    stroke-linecap="round"
                />
            </svg>
        </div>

    </div>
</div>

<script>
    const donutContainer = document.getElementById('donutContainer');
    const passwordInput = document.getElementById('password');

    passwordInput.addEventListener('focus', () => {
        donutContainer.classList.add('pulse');
    });

    passwordInput.addEventListener('blur', () => {
        donutContainer.classList.remove('pulse');
    });

    // Blade validation error check
    @if($errors->any())
        donutContainer.classList.add('error');
    @endif
</script>

</body>
</html>
