<?php

use App\Modules\Mood\Controllers\MoodController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mood Module API Routes
|--------------------------------------------------------------------------
|
| This file defines the API routes specifically for the Mood module.
| These routes handle fetching the APOD (Astronomy Picture of the Day)
| data that has been processed by the backend.
|
*/

// All routes in this file are automatically prefixed with '/api' by Laravel's RouteServiceProvider.
Route::prefix("mood")->group(function () {
    /**
     * GET /api/mood/{date}
     *
     * Retrieves the mood and APOD data for a specific date.
     * The {date} parameter is validated to either be the literal string 'today'
     * or a date formatted as 'YYYY-MM-DD'.
     *
     * This single, flexible route handles the requirements from the project specification:
     * - GET /api/mood/today
     * - GET /api/mood/:date
     */
    Route::get("/{date}", [MoodController::class, "show"])
        ->where("date", "today|[0-9]{4}-[0-9]{2}-[0-9]{2}")
        ->name("mood.show");
});
