@extends('projects.layout')

@section('title', 'ProTrack')

@section('content')
    <div class="p-8 md:p-12 relative">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
                <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    ProTrack
                </h1>
                <p class="text-slate-400 mt-2">Track your progress.</p>
            </div>
            <a href="{{ route('projects.create') }}" class="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40">
                Create Project
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <template x-for="project in projects" :key="project.id">
                <div x-show="(statusFilter === 'all' || statusFilter === project.status) && (difficultyFilter === 'all' || difficultyFilter === project.difficulty) && (project.title.toLowerCase().includes(searchQuery.toLowerCase()))"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 scale-90"
                     x-transition:enter-end="opacity-100 scale-100"
                     class="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 cursor-pointer"
                     @click="activeProject = { ...project, end_date: project.end_date ? project.end_date.split('T')[0] : '' }">

                    <!-- Delete Button -->
                    <button @click.stop="deletingId = project.id; showDeleteModal = true" class="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>

                    <!-- Favorite Button -->
                    <button @click.stop="toggleFavorite(project)" class="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/10">
                        <svg class="w-4 h-4 transition-colors" :class="project.is_favorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </button>

                    <div class="flex justify-between items-start mb-3">
                        <h2 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate pr-8" x-text="project.title"></h2>
                    </div>

                    <div class="flex gap-2 mb-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border" :class="getDifficultyColor(project.difficulty)" x-text="project.difficulty"></span>
                    </div>

                    <p class="text-slate-400 mb-4 h-10 overflow-hidden text-xs leading-relaxed" x-text="project.description.substring(0, 80) + (project.description.length > 80 ? '...' : '')"></p>

                    <div class="mb-4">
                        <div class="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                            <span>Progress</span>
                            <span class="text-emerald-400" x-text="project.progress + '%'"></span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]" :style="'width: ' + project.progress + '%'"></div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-3 mt-auto">
                        <span class="font-medium flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full" :class="{
                                'bg-emerald-500': project.status === 'completed',
                                'bg-blue-500': project.status === 'in_progress',
                                'bg-slate-500': project.status === 'pending'
                            }"></span>
                            <span class="tracking-wider" x-text="formatStatus(project.status)"></span>
                        </span>
                        <span class="font-mono" x-text="project.end_date ? 'Due: ' + formatDate(project.end_date) : 'No Deadline'"></span>
                    </div>
                </div>
            </template>
        </div>

        <!-- Project Details Modal -->
        <div x-show="activeProject"
             x-cloak
             class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition ease-in duration-200"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0">

            <template x-if="activeProject">
            <div class="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                 @click.away="activeProject = null"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0 translate-y-4 scale-95"
                 x-transition:enter-end="opacity-100 translate-y-0 scale-100">

                <!-- Modal Header -->
                <div class="relative h-32 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-8 shrink-0">
                    <div class="absolute top-4 right-4">
                        <button @click="activeProject = null" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <h2 class="text-3xl font-bold text-white" x-text="activeProject.title"></h2>
                    <div class="flex gap-3 mt-2">
                        <span class="px-2 py-1 rounded-full text-xs font-bold uppercase bg-white/10 text-white border border-white/20" x-text="activeProject.difficulty"></span>
                        <span class="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20" x-text="formatStatus(activeProject.status)"></span>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="p-8 overflow-y-auto">
                    <div class="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <span class="text-xs font-bold text-slate-500 uppercase block mb-1">Start Date</span>
                            <span class="text-slate-200 font-mono" x-text="formatDate(activeProject.start_date)"></span>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-slate-500 uppercase block mb-1">End Date</span>
                            <input type="date" x-model="activeProject.end_date" class="bg-slate-950/50 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]">
                        </div>
                    </div>

                    <div class="mb-8">
                        <span class="text-xs font-bold text-slate-500 uppercase block mb-2">Description</span>
                        <textarea x-model="activeProject.description" rows="3" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"></textarea>
                    </div>

                    <!-- Tasks List -->
                    <div class="mb-8">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-xs font-bold text-slate-500 uppercase">Tasks (<span x-text="activeProject?.tasks.length"></span>)</span>
                        </div>

                        <div class="space-y-2">
                            <template x-for="task in activeProject.tasks" :key="task.id">
                                <div class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group/task"
                                     :class="{
                                        'bg-emerald-500/5 border-emerald-500/20': task.status === 'finished',
                                        'opacity-60 bg-slate-800/50': task.status === 'skipped',
                                        'bg-red-500/5 border-red-500/10': task.status === 'unfinished' && false
                                     }">

                                    <!-- Task Title -->
                                    <div class="flex items-center flex-1 select-none cursor-pointer"
                                         @click="updateTaskStatus(task, task.status === 'unfinished' ? 'finished' : 'unfinished')">
                                        <div class="relative flex items-center justify-center w-5 h-5 mr-3 rounded border transition-all duration-300"
                                             :class="{
                                                'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]': task.status === 'finished',
                                                'border-slate-600 bg-slate-800': task.status === 'unfinished',
                                                'bg-amber-500/10 border-amber-500/20': task.status === 'skipped'
                                             }">
                                            <svg x-show="task.status === 'finished'" class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <svg x-show="task.status === 'unfinished'" class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            <svg x-show="task.status === 'skipped'" class="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                        </div>
                                        <span class="text-sm font-medium transition-colors" :class="{
                                            'text-emerald-400 line-through decoration-emerald-500/50': task.status === 'finished',
                                            'text-slate-300': task.status === 'unfinished',
                                            'text-amber-400 italic': task.status === 'skipped'
                                        }" x-text="task.title"></span>
                                    </div>

                                    <!-- Task Actions -->
                                    <div class="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity bg-slate-900/80 rounded-lg p-1 backdrop-blur-sm">
                                        <button @click="updateTaskStatus(task, 'finished')" class="text-slate-400 hover:text-emerald-400 p-1.5 rounded hover:bg-emerald-500/10 transition-colors" title="Mark Finished">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </button>
                                        <button @click="updateTaskStatus(task, 'unfinished')" class="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors" title="Mark Unfinished">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                        <button @click="updateTaskStatus(task, 'skipped')" class="text-slate-400 hover:text-amber-400 p-1.5 rounded hover:bg-amber-500/10 transition-colors" title="Skip Task">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                        </button>
                                        <div class="w-px h-4 bg-white/10 mx-1"></div>
                                        <button @click="deleteTask(task.id)" class="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors" title="Delete task">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </template>

                            <!-- Add Task Input -->
                            <div class="mt-3 flex gap-2">
                                <input type="text" x-model="newTaskTitle" @keydown.enter="addTask()" placeholder="Add a new task..." class="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                                <button @click="addTask()" class="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg px-3 py-2 transition-colors font-medium text-sm">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm font-bold text-slate-400 mb-2">
                            <span>Project Progress</span>
                            <span class="text-emerald-400" x-text="activeProject.progress + '%'"></span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                            <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-1000" :style="'width: ' + activeProject.progress + '%'"></div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button @click="updateProjectDetails()" class="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-emerald-500/20 transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
            </template>
        </div>
    </div>
@endsection
