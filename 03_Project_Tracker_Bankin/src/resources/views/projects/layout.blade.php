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
<body class="bg-slate-950 text-slate-200 antialiased selection:bg-emerald-500 selection:text-white" x-data="appData()">
    <script>
        function appData() {
            return {
                projects: @json($projects ?? []).map(p => ({...p, is_favorite: Boolean(p.is_favorite)})),
                init() {
                    this.projects.forEach(p => this.calculateProgress(p));
                },
                sidebarOpen: true,
                activeProject: null,
                searchQuery: '',
                statusFilter: 'all',
                difficultyFilter: 'all',
                showDeleteModal: false,
                showToast: false,
                toastMessage: '',
                deletingId: null,
                errorMessage: '',
                formatDate(dateString) {
                    if (!dateString) return 'N/A';
                    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                },
                formatStatus(status) {
                    const map = { 'pending': 'Pending', 'in_progress': 'In Progress', 'completed': 'Completed' };
                    return map[status] || status.replace(/_/g, ' ');
                },
                getDifficultyColor(difficulty) {
                    const colors = {
                        'easy': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                        'medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        'hard': 'bg-red-500/10 text-red-400 border-red-500/20'
                    };
                    return colors[difficulty] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                },
                newTaskTitle: '',
                toggleFavorite(project) {
                    project.is_favorite = !project.is_favorite;
                    this.projects.sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0));

                    fetch(`/projects/${project.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                        body: JSON.stringify({ is_favorite: project.is_favorite })
                    });
                },
                calculateProgress(project = null) {
                    const target = project || this.activeProject;
                    if (!target || !target.tasks) return;

                    const total = target.tasks.length;
                    const finished = target.tasks.filter(t => t.status === 'finished').length;
                    const progress = total === 0 ? 0 : Math.round((finished / total) * 100);

                    target.progress = progress;

                    // Determine status based on progress for optimistic updates
                    let newStatus = target.status;
                    if (progress === 100) {
                        newStatus = 'completed';
                    } else if (progress > 0) {
                        newStatus = 'in_progress';
                    } else {
                        newStatus = 'pending';
                    }
                    target.status = newStatus;

                    // Sync with main projects list
                    if (!project && this.activeProject) {
                        const p = this.projects.find(p => p.id === this.activeProject.id);
                        if (p) {
                            p.progress = progress;
                            p.status = newStatus;
                        }
                    }
                },
                updateTaskStatus(task, status) {
                    const originalStatus = task.status;
                    task.status = status;
                    this.calculateProgress(); // Optimistic UI update

                    fetch(`/tasks/${task.id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                        body: JSON.stringify({ status: status })
                    })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(data => {
                        this.activeProject.progress = data.project_progress;
                        this.activeProject.status = data.project_status;
                        const p = this.projects.find(p => p.id === this.activeProject.id);
                        if (p) {
                            p.progress = data.project_progress;
                            p.status = data.project_status;
                        }
                    })
                    .catch(() => {
                        task.status = originalStatus; // Revert on error
                        this.calculateProgress();
                    });
                },
                addTask() {
                    if (!this.newTaskTitle.trim()) return;
                    fetch(`/projects/${this.activeProject.id}/tasks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                        body: JSON.stringify({ title: this.newTaskTitle.trim() })
                    })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(data => {
                        if (data.task) {
                            this.activeProject.tasks.push(data.task);
                            this.activeProject.progress = data.project_progress;
                            this.activeProject.status = data.project_status;
                            const p = this.projects.find(p => p.id === this.activeProject.id);
                            if (p) {
                                p.progress = data.project_progress;
                                p.status = data.project_status;
                            }
                            this.newTaskTitle = '';
                        }
                    })
                    .catch((error) => {
                        console.error('Error adding task:', error);
                        alert('Failed to add task. Please ensure you have run "php artisan migrate:fresh".');
                    });
                },
                deleteTask(taskId) {
                    fetch(`/tasks/${taskId}`, {
                        method: 'DELETE',
                        headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' }
                    })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(data => {
                        this.activeProject.tasks = this.activeProject.tasks.filter(t => t.id !== taskId);
                        this.activeProject.progress = data.project_progress;
                        this.activeProject.status = data.project_status;
                        const p = this.projects.find(p => p.id === this.activeProject.id);
                        if (p) {
                            p.progress = data.project_progress;
                            p.status = data.project_status;
                        }
                    })
                    .catch(() => { this.toastMessage = 'Error deleting task.'; this.showToast = true; setTimeout(() => this.showToast = false, 3000); });
                },
                deleteProject() {
                    if (!this.deletingId) return;
                    this.errorMessage = '';
                    fetch(`/projects/${this.deletingId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}',
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        if (res.ok) {
                            this.projects = this.projects.filter(p => p.id !== this.deletingId);
                            this.showDeleteModal = false;
                            this.deletingId = null;
                            this.toastMessage = 'Project Deleted Successfully';
                            this.showToast = true;
                            setTimeout(() => this.showToast = false, 3000);
                        } else {
                            this.errorMessage = 'Error deleting project. Please try again.';
                        }
                    })
                    .catch(() => {
                        this.errorMessage = 'Error deleting project. Please try again.';
                    });
                },
                updateProjectDetails() {
                    if (!this.activeProject) return;
                    fetch(`/projects/${this.activeProject.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                        body: JSON.stringify({
                            description: this.activeProject.description,
                            end_date: this.activeProject.end_date,
                            progress: this.activeProject.progress,
                            status: this.activeProject.status
                        })
                    })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(data => {
                        const index = this.projects.findIndex(p => p.id === data.project.id);
                        if (index !== -1) {
                            this.projects[index] = { ...this.projects[index], ...data.project };
                        }
                        this.toastMessage = 'Project Saved Successfully';
                        this.showToast = true;
                        setTimeout(() => this.showToast = false, 3000);
                    })
                    .catch(() => {
                        this.toastMessage = 'Error saving project.'; this.showToast = true; setTimeout(() => this.showToast = false, 3000);
                    });
                }
            }
        }
    </script>
    <!-- Background Gradients -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]"></div>
    </div>

    <div class="relative z-10 flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out"
               :class="sidebarOpen ? 'w-64' : 'w-0 border-none overflow-hidden'">
            <div class="flex-1 overflow-y-auto scrollbar-hide w-64">
                <div class="p-6 flex items-center justify-between">
                    <a href="{{ route('home') }}">
                        <h2 class="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 overflow-hidden whitespace-nowrap"
                            x-show="sidebarOpen" x-transition>
                            ProTrack
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
                            @php
                                $statusLabels = [
                                    'all' => 'All',
                                    'pending' => 'Pending',
                                    'in_progress' => 'In Progress',
                                    'completed' => 'Completed',
                                ];
                            @endphp
                            @foreach($statusLabels as $status => $label)
                                <button @click="statusFilter = '{{ $status }}'"
                                        :class="statusFilter === '{{ $status }}' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'"
                                        class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border flex items-center justify-between group">
                                    {{ $label }}
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

        <main class="flex-1 overflow-y-auto relative">
            <!-- Floating Sidebar Toggle (Visible when closed) -->
            <button @click="sidebarOpen = true" x-show="!sidebarOpen" x-transition class="absolute top-6 left-6 z-50 p-2 bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            @yield('content')
        </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div x-show="showDeleteModal"
         x-cloak
         class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0">

        <div class="bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl max-w-md w-full relative overflow-hidden"
             @click.away="showDeleteModal = false"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 translate-y-4 scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 scale-100">

             <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
             <div class="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>

             <h3 class="text-2xl font-bold text-white mb-2">Delete Project?</h3>
             <p class="text-slate-400 mb-8">This action cannot be undone. All tasks and data associated with this project will be permanently removed.</p>

             <p x-show="errorMessage" x-text="errorMessage" class="text-red-400 text-sm mb-4 font-bold"></p>

             <div class="flex justify-end gap-4">
                 <button @click="showDeleteModal = false; deletingId = null" class="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                 <button @click="deleteProject()" class="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all">Confirm Delete</button>
             </div>
        </div>
    </div>

    <!-- Success Toast -->
    <div x-show="showToast"
         x-cloak
         class="fixed bottom-6 right-6 z-[70] bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 translate-y-4"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 translate-y-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span class="font-bold" x-text="toastMessage"></span>
    </div>
</body>
</html>
