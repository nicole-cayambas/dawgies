<?php

namespace App\Providers;

use App\Events\BreedsFetched;
use App\Events\CacheResults;
use App\Listeners\CacheBreedsWithImages;
use App\Listeners\CacheResultsListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
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
        Event::listen(
            BreedsFetched::class,
            CacheBreedsWithImages::class,
        );
    }
}
