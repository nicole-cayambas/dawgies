<?php

namespace App\Models;

use App\Events\BreedsFetched;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class Breed
{
    protected static string $baseRoute = 'https://dog.ceo/api';

    protected $attributes = [
        'images' => [],
        'image' => '',
        'subBreeds' => [],
        'name' => '',
    ];

    public static function all(): Collection
    {
        return Cache::remember('breeds_list', now()->addHours(24), function () {
            $endpoint = self::$baseRoute . "/breeds/list/all";
            $response = Http::get($endpoint);
            if ($response->failed()) {
                return collect([]);
            }
            $collected = $response->collect('message');
            $models = $collected->map(function ($item, $key) {
                $model = new static();
                $model->name = $key;
                $model->subBreeds = collect($item);
                return $model;
            });

            // Trigger event to cache images so we wont have to keep fetching later
            event(new BreedsFetched($models));

            return $models;
        });
    }

    public static function find(string $breed, $id = 'all', $subBreedKey = null): ?self
    {
        // create a new instance of the model since we're extending using Eloquent's Model class
        $model = new static();
        $model->name = $breed;
        $model->image = null;
        $model->images = [];

        $breedKey = $breed;
        if ($subBreedKey) {
            $breedKey = "{$breed}_{$subBreedKey}";
        }
        $imagesCached = Cache::get("breed_image_{$breedKey}");
        $imagesCached == null && \Log::info($breedKey . " not found in cache");

        if ($imagesCached) {
            $images = $imagesCached;
        } else {
            $endpoint = self::$baseRoute . "/breed/$breed/images";
            $response = Http::get($endpoint);
            if ($response->failed()) return $model;
            if ($response->json('status') !== 'success') return $model;

            $images = $response->json('message');
            Cache::put("breed_image_{$breedKey}", $images, now()->addHours(24));
        }
        if($images == null) {
            return $model;
        }
        
        if ($id === 'all') {
            $model->images = $images;
        } else if ($id === 'random') {
            $model->image = $images[array_rand($images)];
        } else {
            $model->image = $images[$id] ?? null;
        }
        return $model;
    }

    public static function findSubs(string $breed): ?self
    {
        $endpoint = self::$baseRoute . "/breed/$breed/list";
        $response = Http::get($endpoint);
        if ($response->failed()) {
            return null;
        }
        $collected = $response->collect('message');
        $model = new static();
        $model->subBreeds = $collected;
        return $model;
    }

    public static function paginate($page = 1, $perPage = 10, callable|null $apply = null): LengthAwarePaginator
    {
        $data = static::all();

        $total = $data->count();
        $results = $data->forPage($page, $perPage)->values();
        if ($apply) {
            $results = $apply($results);
        }

        return new LengthAwarePaginator(
            $results,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    public static function getExtraData(Collection &$breeds): Collection
    {
        // Get images
        foreach ($breeds as &$breed) {
            $breedModel = self::find($breed->name, 1);
            if ($breedModel) {
                $breed->image = $breedModel->image;
            }
        }

        // Get likes count
        $extractedNames = $breeds->pluck('name')->toArray();
        $breedsWithLikes = UserLike::whereIn('breed', $extractedNames)
            ->select('breed', \DB::raw('count(*) as like_count'))
            ->groupBy('breed')
            ->pluck('like_count', 'breed')
            ->toArray();
        foreach ($breeds as &$breed) {
            $breed->likes = $breedsWithLikes[$breed->name] ?? 0;
        }

        // Update hasLiked
        $user = \Auth::user();
        if ($user) {
            $userLikes = UserLike::where('user_id', $user->id)
                ->whereIn('breed', $extractedNames)
                ->pluck('breed')
                ->toArray();
            foreach ($breeds as &$breed) {
                $breed->hasLiked = in_array($breed->name, $userLikes);
            }
        }

        return $breeds;
    }
}
