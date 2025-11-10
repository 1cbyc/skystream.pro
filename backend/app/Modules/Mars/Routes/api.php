<?php

use App\Modules\Mars\Controllers\MarsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mars Module API Routes
|--------------------------------------------------------------------------
|
| This file defines the API routes specifically for the Mars module.
| These routes are responsible for fetching Mars Rover photos.
|
*/

// All routes in this file are automatically prefixed with '/api' by Laravel's RouteServiceProvider.
Route::prefix('mars')->group(function () {
    /**
     * GET /api/mars/photos
     *
     * Retrieves a paginated list of Mars Rover photos.
     *
     * Query Parameters:
     * - `rover` (optional|string): Filter by rover name (e.g., 'curiosity').
     * - `camera` (optional|string): Filter by camera name.
     * - `sol` (optional|integer): Filter by Martian day (sol).
     * - `page` (optional|integer): The page number for pagination.
     */
    Route::get('/photos', [MarsController::class, 'getPhotos'])->name('mars.photos');
});
