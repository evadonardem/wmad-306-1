<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\Task;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register bindings or singletons here
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Authorization policy mappings (explicit registration keeps behavior consistent across Laravel versions)
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);

        // Improve asset loading by prefetching Vite chunks
        Vite::prefetch(concurrency: 3);
    }
}
