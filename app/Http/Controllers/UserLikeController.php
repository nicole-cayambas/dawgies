<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserLike;
use Illuminate\Support\Facades\Auth;

class UserLikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'breed' => 'required',
        ]);

        $user = Auth::user();
        $itemId = $request->breed;

        // Check if like exists
        $like = UserLike::where('user_id', $user->id)
                        ->where('breed', $itemId)
                        ->first();

        if ($like) {
            $like->delete();
            $status = 'unliked';
        } else {
            UserLike::create([
                'user_id' => $user->id,
                'breed' => $itemId,
            ]);
            $status = 'liked';
        }

        return response()->json([
            'status' => $status,
            'breed' => $itemId,
        ]);
    }
}
