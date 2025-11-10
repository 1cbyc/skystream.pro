<?php

namespace App\Services;

use Carbon\Carbon;
use Exception;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * A centralized HTTP client for interacting with various NASA APIs.
 *
 * This service handles API key management, request retries, and caching
 * to ensure efficient and reliable communication with NASA's services.
 */
class NASAClient
{
    /**
     * The base URL for the NASA API.
     */
    protected string $baseUrl = 'https://api.nasa.gov';

    /**
     * The configured NASA API key.
     */
    protected string $apiKey;

    /**
     * The pre-configured HTTP client instance.
     */
    protected PendingRequest $client;

    /**
     * NASAClient constructor.
     *
     * Initializes the HTTP client and validates the NASA API key.
     *
     * @throws \Exception if the NASA API key is not configured.
     */
    public function __construct()
    {
        // Fetch the API key from the services configuration file.
        // It's important to store this in your .env file and not in the code.
        $this->apiKey = config('services.nasa.key');

        if (!$this->apiKey || $this->apiKey === 'YOUR_NASA_API_KEY') {
            // Throwing an exception prevents the app from running without a valid key.
            throw new Exception('NASA API key is missing or not configured. Please add it to your .env file.');
        }

        // Initialize the HTTP client with the base URL and default parameters.
        $this->client = Http::baseUrl($this->baseUrl)
            ->withQueryParameters(['api_key' => $this->apiKey])
            ->timeout(30) // Set a 30-second timeout for requests.
            ->retry(3, 200, null, false); // Retry failed requests 3 times, with a 200ms delay.
    }

    /**
     * Fetches the Astronomy Picture of the Day (APOD).
     *
     * It first checks a persistent database cache for a valid entry to avoid unnecessary API calls.
     * If a fresh entry is not found, it fetches the data from the API and caches it.
     *
     * @param string|null $date The date for the APOD in 'YYYY-MM-DD' format. Defaults to today.
     * @return array|null The APOD data as an associative array, or null on failure.
     */
    public function getApod(?string $date = null): ?array
    {
        // Use today's date if none is provided.
        $targetDate = $date ? Carbon::parse($date) : Carbon::today();
        $dateString = $targetDate->toDateString();
        $sourceId = $dateString;
        $source = 'APOD';

        // 1. Check persistent DB cache
        $cached = DB::table('nasa_cache')
            ->where('source', $source)
            ->where('source_id', $sourceId)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($cached) {
            return json_decode($cached->payload, true);
        }

        // 2. If not in cache or expired, fetch from API
        $response = $this->client->get('/planetary/apod', ['date' => $dateString]);

        if ($response->failed()) {
            Log::error('Failed to fetch APOD from NASA API.', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            return null;
        }

        $data = $response->json();

        // 3. Store the new data in the cache
        DB::table('nasa_cache')->updateOrInsert(
            ['source' => $source, 'source_id' => $sourceId],
            [
                'payload' => json_encode($data),
                'fetched_at' => Carbon::now(),
                // APOD is daily, so cache expires at the end of the day.
                'expires_at' => $targetDate->copy()->endOfDay(),
            ]
        );

        return $data;
    }
}
