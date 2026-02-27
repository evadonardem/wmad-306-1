@extends('projects.layout')

@section('title', 'Create Project')

@section('content')
    <div class="p-8 md:p-12">
            <div class="max-w-3xl mx-auto">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-white tracking-tight">New Project</h1>
                    <p class="text-slate-400 mt-2">Define the scope and constraints of your next venture.</p>
                </div>

                <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                    <form action="{{ route('projects.store') }}" method="POST" class="space-y-6">
                        @csrf

                        <!-- Title -->
                        <div>
                            <label for="title" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Project Title</label>
                            <input type="text" name="title" id="title" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" placeholder="e.g. Quantum AI Interface" required>
                        </div>

                        <!-- Description -->
                        <div>
                            <label for="description" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                            <textarea name="description" id="description" rows="4" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" placeholder="Describe the project goals..." required></textarea>
                        </div>

                        <!-- Grid for Status & Difficulty -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="status" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                                <div class="relative">
                                    <select name="status" id="status" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all">
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label for="difficulty" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Difficulty</label>
                                <div class="relative">
                                    <select name="difficulty" id="difficulty" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all">
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dates -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="start_date" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Start Date</label>
                                <input type="date" name="start_date" id="start_date" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all [color-scheme:dark]">
                            </div>

                            <div>
                                <label for="end_date" class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">End Date</label>
                                <input type="date" name="end_date" id="end_date" class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all [color-scheme:dark]">
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-white/5 mt-8">
                            <a href="{{ route('home') }}" class="text-slate-400 hover:text-white font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                Cancel
                            </a>
                            <button type="submit" class="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    </div>
@endsection
