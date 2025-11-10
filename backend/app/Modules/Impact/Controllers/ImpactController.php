<?php

namespace App\Modules\Impact\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * ImpactController
 *
 * Handles API requests related to Near-Earth Objects (NEOs) and impact simulations.
 */
class ImpactController extends Controller
{
    /**
     * Retrieves a list of NEOs with close approaches within a given date range.
     *
     * This endpoint is paginated to handle potentially large result sets.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNearby(Request $request): JsonResponse
    {
        // 1. Validate the incoming request parameters.
        $validator = Validator::make($request->all(), [
            'date_from' => 'required|date_format:Y-m-d',
            'date_to' => 'sometimes|date_format:Y-m-d|after_or_equal:date_from',
            'limit' => 'sometimes|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return $this->apiResponse($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $validator->validated();
        $dateFrom = $validated['date_from'];
        $dateTo = $validated['date_to'] ?? $dateFrom; // Default to a single day if 'date_to' is not provided.
        $limit = $validated['limit'] ?? 15; // Default page size.

        try {
            // 2. Query the database using a raw JSON query for cross-database compatibility.
            // This safely queries the 'close_approach_date' field within the JSON 'close_approach' column.
            $nearbyObjects = DB::table('neows_objects')
                ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(close_approach, '$.close_approach_date')) BETWEEN ? AND ?", [$dateFrom, $dateTo])
                ->orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(close_approach, '$.miss_distance.kilometers')) ASC") // Order by closest approach
                ->paginate($limit);

            // 3. Decode JSON fields for a cleaner API response.
            $nearbyObjects->getCollection()->transform(function ($item) {
                $item->estimated_diameter = json_decode($item->estimated_diameter);
                $item->close_approach = json_decode($item->close_approach);
                $item->orbit_data = json_decode($item->orbit_data);
                return $item;
            });

            // 4. Return the paginated response.
            return $this->apiResponse($nearbyObjects);
        } catch (Throwable $e) {
            report($e);
            return $this->apiResponse(
                'An internal server error occurred while fetching NEO data.',
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
