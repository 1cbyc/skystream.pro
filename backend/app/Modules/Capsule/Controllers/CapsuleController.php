<?php

namespace App\Modules\Capsule\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * CapsuleController
 *
 * Handles API requests for generating date-based "space snapshots".
 */
class CapsuleController extends Controller
{
    /**
     * Generates a "capsule" for a given date.
     *
     * For the MVP, this capsule consists of the APOD data for the specified date.
     * It validates the 'date' from the request query parameters.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate(Request $request): JsonResponse
    {
        // 1. Validate the 'date' query parameter.
        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return $this->apiResponse(
                $validator->errors(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $targetDate = $validator->validated()['date'];

        try {
            // 2. Query the database for the APOD record.
            $apodData = DB::table('apod_mood')
                ->where('apod_date', $targetDate)
                ->first();

            if (!$apodData) {
                // If data is missing, we inform the user. A future enhancement could be to
                // dispatch a one-off job to attempt to fetch the data.
                return $this->apiResponse(
                    'Capsule data not found for the specified date. It may not have been processed yet.',
                    Response::HTTP_NOT_FOUND
                );
            }

            // 3. Decode JSON fields for a clean response.
            $apodData->color_palette = json_decode($apodData->color_palette);

            // The capsule data is structured to be extensible in the future.
            $capsuleData = [
                'apod' => $apodData,
                // In the future, add more data here, e.g., 'planets' => ...
            ];

            // 4. Return the successful response.
            return $this->apiResponse($capsuleData);

        } catch (Throwable $e) {
            report($e); // Log the exception for debugging.
            return $this->apiResponse(
                'An internal server error occurred while generating the capsule.',
                Response::HTTP_INTERNAL_SERVER_ERROR
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
            'status' => $isSuccess ? 'ok' : 'error',
        ];

        if ($isSuccess) {
            $response['data'] = $data;
        } else {
            $response['message'] = $data;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $status);
    }
}
