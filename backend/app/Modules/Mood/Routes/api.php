<?php

use App\Modules\Mood\Controllers\MoodController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mood Module API Routes
|--------------------------------------------------------------------------
|
| This file defines the API routes for the Mood module. These routes are
| responsible for exposing the APOD mood data to the frontend.
|
*/

// The routes are automatically prefixed with '/api' by Laravel's RouteServiceProvider.
Route::prefix('mood')->group(function () {
    /**
     * GET /api/mood/{date}
     *
     * Retrieves the mood data for a specific date. The {date} parameter can be
     * the string 'today' or a date in 'YYYY-MM-DD' format.
     *
     * This single route handles both requirements from the project specification:
     * - GET /api/mood/today
     * - GET /api/mood/:date
     */
    Route::get('/{date}', [MoodController::class, 'show'])
         ->where('date', 'today|[0-9]{4}-[0-9]{2}-[0-9]{2}')
         ->name('mood.show');
});
