<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800">Project Dashboard</h1>
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow">
                Create Project
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($projects as $project)
                @php
                    $isLocked = $project->start_date && $project->start_date > now();
                    $difficultyColor = match($project->difficulty) {
                        'easy' => 'bg-green-100 text-green-800',
                        'medium' => 'bg-yellow-100 text-yellow-800',
                        'hard' => 'bg-red-100 text-red-800',
                        default => 'bg-gray-100 text-gray-800',
                    };
                @endphp

                <div class="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
                    @if($isLocked)
                        <div class="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 backdrop-blur-sm">
                            <div class="text-center p-4 bg-white rounded shadow-lg">
                                <svg class="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <span class="text-gray-800 font-bold block">LOCKED</span>
                                <span class="text-xs text-gray-500">Starts {{ $project->start_date->format('M d, Y') }}</span>
                            </div>
                        </div>
                    @endif

                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-semibold text-gray-800 truncate pr-2">{{ $project->title }}</h2>
                        <span class="px-2 py-1 rounded-full text-xs font-bold uppercase {{ $difficultyColor }}">
                            {{ $project->difficulty }}
                        </span>
                    </div>

                    <p class="text-gray-600 mb-4 h-12 overflow-hidden text-sm">{{ Str::limit($project->description, 100) }}</p>

                    <div class="mb-4">
                        <div class="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{{ $project->progress }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: {{ $project->progress }}%"></div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                        <span class="font-medium">Status: <span class="uppercase">{{ str_replace('_', ' ', $project->status) }}</span></span>
                        <span>{{ $project->end_date ? 'Due: ' . $project->end_date->format('M d') : 'No Deadline' }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</body>
</html>
