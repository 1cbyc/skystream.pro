<?php

use App\Modules\Impact\Controllers\ImpactController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Impact Module API Routes
|--------------------------------------------------------------------------
|
| This file defines the API routes specifically for the Impact module.
| These routes are responsible for fetching Near-Earth Object (NEO) data
| and handling impact simulation requests.
|
*/

// All routes in this file are automatically prefixed with '/api' by Laravel's RouteServiceProvider.
Route::prefix('impact')->group(function () {
    /**
     * GET /api/impact/nearby
     *
     * Retrieves a paginated list of Near-Earth Objects based on their close
     * approach date.
     *
     * Query Parameters:
     * - `date_from` (required|Y-m-d): The start date of the search window.
     * - `date_to` (optional|Y-m-d): The end date of the search window.
     * - `limit` (optional|integer): The number of results per page.
     */
    Route::get('/nearby', [ImpactController::class, 'getNearby'])->name('impact.nearby');
});
