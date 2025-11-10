<?php

namespace App\Modules\Mars\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * MarsController
 *
 * Handles API requests for fetching Mars Rover photos.
 */
class MarsController extends Controller
{
    /**
     * Retrieves a paginated list of Mars Rover photos.
     *
     * This endpoint allows for filtering by rover, camera, and Martian day (sol).
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPhotos(Request $request): JsonResponse
    {
        // 1. Validate the incoming query parameters.
        $validator = Validator::make($request->all(), [
            'rover' => 'sometimes|string|in:curiosity,opportunity,spirit,perseverance',
            'camera' => 'sometimes|string|max:50',
            'sol' => 'sometimes|integer|min:0',
            'limit' => 'sometimes|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return $this->apiResponse($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $validator->validated();
        $limit = $validated['limit'] ?? 25; // Default page size.

        try {
            // 2. Build the database query.
            $query = DB::table('mars_images');

            if (isset($validated['sol'])) {
                $query->where('sol', $validated['sol']);
            }

            if (isset($validated['camera'])) {
                $query->where('camera', $validated['camera']);
            }

            // Note: The rover name is not stored in the DB yet. This is a future improvement.
            // if (isset($validated['rover'])) {
            //     $query->where('rover', $validated['rover']);
            // }

            // 3. Order the results and paginate.
            $photos = $query->orderBy('earth_date', 'desc')->paginate($limit);

            // 4. Decode JSON fields for a cleaner API response.
            $photos->getCollection()->transform(function ($item) {
                if ($item->labels) {
                    $item->labels = json_decode($item->labels);
                }
                return $item;
            });

            // 5. Return the paginated response.
            return $this->apiResponse($photos);

        } catch (Throwable $e) {
            report($e);
            return $this->apiResponse(
                'An internal server error occurred while fetching Mars photos.',
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
