<?php

namespace App\Modules\Mood\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Throwable;

/**
 * NASAClient Service
 *
 * A centralized client for interacting with NASA's public APIs.
 * It handles request construction, caching, and error handling to ensure
 * efficient and reliable communication while respecting API rate limits.
 */
class NASAClient
{
    /**
     * The Guzzle HTTP client instance.
     *
     * @var \GuzzleHttp\Client
     */
    protected Client $client;

    /**
     * The NASA API key.
     *
     * @var string
     */
    protected string $apiKey;

    /**
     * The base URI for all NASA API requests.
     *
     * @var string
     */
    protected string $baseUri = "https://api.nasa.gov";

    /**
     * NASAClient constructor.
     */
    public function __construct()
    {
        // Retrieve the API key from the environment configuration.
        // Fallback to the public 'DEMO_KEY' if not set.
        $this->apiKey = config("services.nasa.key", "DEMO_KEY");

        if ($this->apiKey === "DEMO_KEY") {
            Log::warning(
                "NASAClient is using the default DEMO_KEY. Rate limits will be very low.",
            );
        }

        $this->client = new Client([
            "base_uri" => $this->baseUri,
            "timeout" => 15.0, // Set a reasonable timeout for requests.
        ]);
    }

    /**
     * Fetches the Astronomy Picture of the Day (APOD).
     *
     * @param string|null $date The date for the APOD in 'YYYY-MM-DD' format. Defaults to today.
     * @return array|null The APOD data or null on failure.
     */
    public function fetchApod(?string $date = null): ?array
    {
        $query = [];
        if ($date) {
            $query["date"] = $date;
        }

        // The APOD changes once a day. Caching for 24 hours (1440 minutes) is safe.
        return $this->get("/planetary/apod", $query, 1440);
    }

    /**
     * Fetches Near-Earth Objects (NEOs) for a given date range.
     *
     * @param string $startDate The start date in 'YYYY-MM-DD' format.
     * @param string|null $endDate The end date in 'YYYY-MM-DD' format. Defaults to start date if null.
     * @return array|null The NEOs data or null on failure.
     */
    public function fetchNeows(
        string $startDate,
        ?string $endDate = null,
    ): ?array {
        $query = [
            "start_date" => $startDate,
            "end_date" => $endDate ?? $startDate,
        ];

        // NEO data can be updated, so a shorter cache TTL of 60 minutes is appropriate.
        return $this->get("/neo/rest/v1/feed", $query, 60);
    }

    /**
     * Fetches photos from a Mars rover for a specific Martian day (sol).
     *
     * @param string $rover The name of the rover (e.g., 'curiosity', 'opportunity', 'spirit').
     * @param int $sol The Martian day (sol) to query.
     * @param string|null $camera The camera to filter by (optional).
     * @param int $page The page number for pagination.
     * @return array|null The photos data or null on failure.
     */
    public function fetchMarsPhotos(
        string $rover,
        int $sol,
        ?string $camera = null,
        int $page = 1,
    ): ?array {
        $path = "/mars-photos/api/v1/rovers/{$rover}/photos";

        $query = [
            "sol" => $sol,
            "page" => $page,
        ];

        if ($camera) {
            $query["camera"] = $camera;
        }

        // Mars rover photos are historical and don't change. A long cache TTL is safe.
        return $this->get($path, $query, 60 * 24 * 30); // Cache for 30 days
    }

    /**
     * Fetches the mission manifest for a specific Mars rover.
     *
     * The manifest contains metadata about the rover's mission, such as its
     * landing date, launch date, status, and the most recent Martian day (sol)
     * for which photos are available.
     *
     * @param string $rover The name of the rover (e.g., 'curiosity', 'opportunity', 'spirit').
     * @return array|null The manifest data or null on failure.
     */
    public function fetchRoverManifest(string $rover): ?array
    {
        $path = "/mars-photos/api/v1/manifests/{$rover}";

        // The manifest is updated daily, so a 24-hour cache is appropriate.
        return $this->get($path, [], 60 * 24);
    }

    /**
     * A centralized GET request handler with built-in caching.
     *
     * This method constructs the request, checks the cache for an existing
     * response, and if not found, queries the API and caches the result.
     *
     * @param string $path The API endpoint path (e.g., '/planetary/apod').
     * @param array $query The query parameters for the request.
     * @param int $ttlMinutes The Time-To-Live for the cache entry in minutes.
     * @return array|null The JSON-decoded response as an array, or null if an error occurs.
     */
    protected function get(
        string $path,
        array $query = [],
        int $ttlMinutes = 60,
    ): ?array {
        // Add the API key to every request.
        $query["api_key"] = $this->apiKey;

        // Sort parameters to ensure a consistent cache key.
        ksort($query);
        $cacheKey = "nasa_api:" . md5($path . "?" . http_build_query($query));

        // Use Laravel's cache to store and retrieve the response.
        return Cache::remember(
            $cacheKey,
            now()->addMinutes($ttlMinutes),
            function () use ($path, $query) {
                try {
                    $response = $this->client->request("GET", $path, [
                        "query" => $query,
                    ]);

                    $body = (string) $response->getBody();

                    // Return the decoded JSON data.
                    return json_decode($body, true);
                } catch (RequestException $e) {
                    // Log detailed error information for Guzzle-specific exceptions.
                    Log::error("NASAClient Request Error", [
                        "path" => $path,
                        "query" => $query,
                        "status_code" => $e->hasResponse()
                            ? $e->getResponse()->getStatusCode()
                            : "N/A",
                        "error" => $e->getMessage(),
                    ]);
                    return null;
                } catch (Throwable $e) {
                    // Catch any other general exceptions.
                    Log::error("NASAClient General Error", [
                        "path" => $path,
                        "error" => $e->getMessage(),
                    ]);
                    return null;
                }
            },
        );
    }
}
