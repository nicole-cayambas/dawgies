<?php

use App\Http\Controllers\BreedController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLikeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [BreedController::class, 'index'])->name('dashboard');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('likes', [UserLikeController::class, 'toggle'])->name('likes.toggle');
});

require __DIR__.'/settings.php';
