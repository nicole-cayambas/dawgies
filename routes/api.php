<?php

use App\Http\Controllers\UserLikeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('likes', [UserLikeController::class, 'toggle']);
});
