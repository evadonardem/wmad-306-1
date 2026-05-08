<?php

namespace App\Providers;

use App\Models\League;
use App\Models\Team;
use App\Policies\LeaguePolicy;
use App\Policies\TeamPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        League::class => LeaguePolicy::class,
        Team::class => TeamPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
