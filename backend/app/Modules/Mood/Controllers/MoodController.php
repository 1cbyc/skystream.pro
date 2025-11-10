<?php

namespace App\Modules\Mood\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MoodController extends Controller
{
    /**
     * Responds with a consistent JSON envelope.
     *
     * @param mixed $data
     * @param int $status
     * @param array $meta
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiResponse($data = null, int $status = 200, array $meta = []): JsonResponse
    {
        $response = [
            'status' => $status >= 200 && $status < 300 ? 'ok' : 'error',
            'data'   => $data,
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        if ($response['status'] === 'error') {
            $response['message'] = $data;
            unset($response['data']);
        }

        return response()->json($response, $status);
    }

    /**
     * Retrieves the APOD mood data for a specific date.
     *
     * Handles both 'today' and specific 'YYYY-MM-DD' dates.
     *
     * @param string $date The date string, either 'today' or 'YYYY-MM-DD'.
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $date): JsonResponse
    {
        if ($date === 'today') {
            $targetDate = Carbon::today('UTC')->toDateString();
        } else {
            $validator = Validator::make(['date' => $date], [
                'date' => 'required|date_format:Y-m-d',
            ]);

            if ($validator->fails()) {
                return $this->apiResponse($validator->errors()->first(), Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $targetDate = $date;
        }

        try {
            $apodMood = DB::table('apod_mood')->where('apod_date', $targetDate)->first();

            if (!$apodMood) {
                return $this->apiResponse('APOD data not found for the specified date.', Response::HTTP_NOT_FOUND);
            }

            // Decode the JSON fields before returning
            $apodMood->color_palette = json_decode($apodMood->color_palette);

            return $this->apiResponse($apodMood);

        } catch (Throwable $e) {
            // Log the exception here if you have logging set up
            return $this->apiResponse('An internal server error occurred.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
