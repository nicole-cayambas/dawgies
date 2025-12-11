<?php

namespace App\Listeners;

use App\Events\BreedsFetched;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Arr;

class CacheBreedsWithImages implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BreedsFetched $event)
    {
        // Cache the list of breeds for 24 hours
        Cache::put('breeds_list', $event->breeds, now()->addHours(24));

        $keys = []; // maps numeric index => breed name
        $responses = Http::pool(function ($pool) use ($event, &$keys) {
            foreach ($event->breeds as $breed) {
                if ($breed->subBreeds->isNotEmpty()) {
                    foreach ($breed->subBreeds as $subBreed) {
                        $endpoint = "https://dog.ceo/api/breed/{$breed->name}/{$subBreed}/images";
                        $keys[] = "{$breed->name}_{$subBreed}";
                        $pool->get($endpoint);
                    }
                } else {
                    $endpoint = "https://dog.ceo/api/breed/{$breed->name}/images";
                    $keys[] = $breed->name;
                    $pool->get($endpoint);
                }
            }
        });

        // Loop responses
        foreach ($responses as $i => $res) {
            $key = $keys[$i]; // proper breed/sub-breed name
            if (!$res || $res->failed()) continue;
            if ($res->json('status') !== 'success') continue;

            \Log::info("Caching images for {$key}", [
                'count' => count($res->json('message')),
                'sample_image' => $res->json('message')[0] ?? null,
            ]);
            Cache::put("breed_image_{$key}", $res->json('message'), now()->addHours(24));
        }
    }
}
