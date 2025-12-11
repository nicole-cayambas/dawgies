<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BreedController extends Controller
{
    public function index(Request $request)
    {
        $breeds = Breed::paginate(
            page: $request->get('page', 1),
            perPage: 6,
            apply: [Breed::class, 'getImages']
        );

        return Inertia::render('dashboard', [
            'breeds' => $breeds,
        ]);
    }
}
