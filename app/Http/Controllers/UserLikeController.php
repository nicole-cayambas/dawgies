<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\Request;
use App\Models\UserLike;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserLikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'breed' => 'required',
        ]);

        $user = Auth::user();
        $breed = $request->post('breed');

        // Check if like exists
        $like = UserLike::where('user_id', $user->id)
            ->where('breed', $breed)
            ->first();

        \Log::info( 'User ' . $user->id . ' toggled like for breed: ' . $breed );
        if ($like) {
            $like->delete();
        } else {
            $like = UserLike::create([
                'user_id' => $user->id,
                'breed' => $breed,
            ]);
        }

        $updatedBreeds = Breed::paginate(1, 6, [Breed::class, 'getExtraData']);
        return Inertia::render('dashboard', [
            'breeds' => $updatedBreeds
        ]);
    }
}
