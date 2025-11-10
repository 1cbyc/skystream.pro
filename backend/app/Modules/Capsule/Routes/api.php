<?php

use App\Modules\Capsule\Controllers\CapsuleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Capsule Module API Routes
|--------------------------------------------------------------------------
|
| This file defines the API routes specifically for the Capsule module.
| These routes are responsible for generating date-based "space snapshots".
|
*/

// All routes in this file are automatically prefixed with '/api' by Laravel's RouteServiceProvider.
Route::prefix('capsule')->group(function () {
    /**
     * GET /api/capsule/birthday
     *
     * Generates a "space snapshot" for a given date.
     *
     * Query Parameters:
     * - `date` (required|Y-m-d): The date for which to generate the capsule.
     */
    Route::get('/birthday', [CapsuleController::class, 'generate'])->name('capsule.birthday');
});
