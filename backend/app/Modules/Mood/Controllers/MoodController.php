<?php

namespace App\Modules\Mood\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * MoodController
 *
 * Handles API requests related to the APOD (Astronomy Picture of the Day) Mood feature.
 */
class MoodController extends Controller
{
    /**
     * Retrieves the APOD mood data for a specific date.
     *
     * This method handles requests for both 'today' and specific dates in 'YYYY-MM-DD' format.
     * It validates the input, queries the database, and returns the data in a consistent JSON format.
     *
     * @param string $date The date string, which can be 'today' or a date like '2024-01-15'.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $date): JsonResponse
    {
        if ($date === "today") {
            $targetDate = Carbon::today("UTC")->toDateString();
        } else {
            // Validate that the provided date is in the correct format.
            $validator = Validator::make(
                ["date" => $date],
                [
                    "date" => "required|date_format:Y-m-d",
                ],
            );

            if ($validator->fails()) {
                return $this->apiResponse(
                    $validator->errors()->first(),
                    Response::HTTP_UNPROCESSABLE_ENTITY,
                );
            }
            $targetDate = $date;
        }

        try {
            // Query the database for the APOD record for the target date.
            $apodMood = DB::table("apod_mood")
                ->where("apod_date", $targetDate)
                ->first();

            if (!$apodMood) {
                return $this->apiResponse(
                    "APOD data not found for the specified date.",
                    Response::HTTP_NOT_FOUND,
                );
            }

            // The color_palette is stored as JSON, so we decode it before sending the response.
            $apodMood->color_palette = json_decode($apodMood->color_palette);

            return $this->apiResponse($apodMood);
        } catch (Throwable $e) {
            // Log the actual error for debugging purposes.
            report($e);

            // Return a generic server error to the client.
            return $this->apiResponse(
                "An internal server error occurred.",
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Responds with a consistent JSON envelope for all API calls.
     *
     * @param mixed $data The payload (data or error message).
     * @param int $status The HTTP status code.
     * @param array $meta Optional metadata.
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiResponse(
        $data = null,
        int $status = 200,
        array $meta = [],
    ): JsonResponse {
        $isSuccess = $status >= 200 && $status < 300;

        $response = [
            "status" => $isSuccess ? "ok" : "error",
        ];

        if ($isSuccess) {
            $response["data"] = $data;
        } else {
            $response["message"] = $data;
        }

        if (!empty($meta)) {
            $response["meta"] = $meta;
        }

        return response()->json($response, $status);
    }
}
