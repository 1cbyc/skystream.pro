<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Standard Laravel user route - useful for checking authentication status.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --------------------------------------------------------------------------
// Modular Route Loading
// --------------------------------------------------------------------------
// This section automatically scans the `app/Modules` directory and loads
// any `Routes/api.php` files it finds. This keeps our main API file clean
// and allows for a plug-and-play modular architecture.
// --------------------------------------------------------------------------

$modulesPath = app_path('Modules');
$moduleDirectories = File::directories($modulesPath);

foreach ($moduleDirectories as $moduleDirectory) {
    $routesPath = $moduleDirectory . '/Routes/api.php';
    if (File::exists($routesPath)) {
        require $routesPath;
    }
}
