<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Project Tracker')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
    <style>
        body { font-family: 'Figtree', sans-serif; }
        [x-cloak] { display: none !important; }
        @keyframes pulse-glow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-glow 3s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-slate-950 text-slate-200 antialiased selection:bg-emerald-500 selection:text-white"
      x-data="{
            sidebarOpen: true,
            searchQuery: '',
            statusFilter: 'all',
            difficultyFilter: 'all',
            activeProject: null,
            formatDate(dateString) {
                if (!dateString) return 'N/A';
                return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            },
            newTaskTitle: '',
            calculateProgress() {
                if (!this.activeProject || !this.activeProject.tasks.length) {
                    if(this.activeProject) this.activeProject.progress = 0;
                    return;
                };
                const finished = this.activeProject.tasks.filter(t => t.status === 'finished').length;
                const total = this.activeProject.tasks.length;
                this.activeProject.progress = total > 0 ? Math.round((finished / total) * 100) : 0;
            },
            updateTaskStatus(task, status) {
                const originalStatus = task.status;
                task.status = status;
                this.calculateProgress();
                fetch(`/tasks/${task.id}/status`, {
                    method: 'PATCH',
                    headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: status })
                })
                .then(res => {
                    if (!res.ok) {
                        task.status = originalStatus; // Revert on error
                        this.calculateProgress();
                    }
                    return res.json();
                })
                .then(data => {
                    if(data.progress !== undefined) {
                        this.activeProject.progress = data.progress;
                    }
                });
            },
            addTask() {
                if (!this.newTaskTitle) return;
                fetch(`/projects/${this.activeProject.id}/tasks`, {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: this.newTaskTitle })
                })
                .then(res => res.json())
                .then(data => {
                    this.activeProject.tasks.push(data.task);
                    this.calculateProgress();
                    this.newTaskTitle = '';
                });
            },
            deleteTask(taskId) {
                if (!confirm('Delete this task?')) return;
                fetch(`/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                })
                .then(res => res.json())
                .then(data => {
                    this.activeProject.tasks = this.activeProject.tasks.filter(t => t.id !== taskId);
                    this.calculateProgress();
                });
            }
         }">
    <!-- Background Gradients -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]"></div>
    </div>

    <div class="relative z-10 flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out"
               :class="sidebarOpen ? 'w-64' : 'w-20'">
            <div class="flex-1 overflow-y-auto scrollbar-hide">
                <div class="p-6 flex items-center justify-between">
                    <a href="{{ route('home') }}">
                        <h2 class="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 overflow-hidden whitespace-nowrap"
                            x-show="sidebarOpen" x-transition>
                            Alturos
                        </h2>
                    </a>
                    <button @click="sidebarOpen = !sidebarOpen" class="text-slate-400 hover:text-white transition-colors p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

                @if (request()->routeIs('home'))
                <!-- Search -->
                <div class="px-6 mb-6" x-show="sidebarOpen" x-transition>
                    <div class="relative group">
                        <input type="text" x-model="searchQuery" placeholder="Search projects..." class="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all group-hover:border-white/20">
                        <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                @endif

                <nav class="mt-2 px-4 space-y-2">
                    <a href="{{ route('home') }}" class="flex items-center px-4 py-3 rounded-lg transition-colors group relative overflow-hidden {{ request()->routeIs('home') ? 'text-white bg-white/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5' }}">
                        <svg class="w-5 h-5 flex-shrink-0 {{ request()->routeIs('home') ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span class="ml-3 whitespace-nowrap" x-show="sidebarOpen" x-transition>Dashboard</span>
                        <div class="absolute inset-0 bg-emerald-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" x-show="!sidebarOpen"></div>
                    </a>
                </nav>

                @if (request()->routeIs('home'))
                <!-- Filters -->
                <div class="mt-8 px-4 pb-4" x-show="sidebarOpen" x-transition>
                    <div class="mb-6">
                        <h3 class="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Status</h3>
                        <div class="space-y-1">
                            @foreach(['all', 'pending', 'in_progress', 'completed', 'locked'] as $status)
                                <button @click="statusFilter = '{{ $status }}'"
                                        :class="statusFilter === '{{ $status }}' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'"
                                        class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize border flex items-center justify-between group">
                                    {{ str_replace('_', ' ', $status) }}
                                    <span x-show="statusFilter === '{{ $status }}'" class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                </button>
                            @endforeach
                        </div>
                    </div>

                    <div>
                        <h3 class="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Difficulty</h3>
                        <div class="space-y-1">
                            @foreach(['all', 'easy', 'medium', 'hard'] as $diff)
                                <button @click="difficultyFilter = '{{ $diff }}'"
                                        :class="difficultyFilter === '{{ $diff }}' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'"
                                        class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize border flex items-center justify-between">
                                    {{ $diff }}
                                    <span x-show="difficultyFilter === '{{ $diff }}'" class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                </button>
                            @endforeach
                        </div>
                    </div>
                </div>
                @endif
            </div>
            <div class="p-4 border-t border-white/5">
                @auth
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            <span class="ml-3 whitespace-nowrap" x-show="sidebarOpen" x-transition>Logout</span>
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        <span class="ml-3 whitespace-nowrap" x-show="sidebarOpen" x-transition>Login</span>
                    </a>
                @endauth
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto">
            @yield('content')
        </main>
    </div>
</body>
</html>
