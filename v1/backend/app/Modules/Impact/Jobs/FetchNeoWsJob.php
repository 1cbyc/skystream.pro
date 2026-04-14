<?php

namespace App\Modules\Impact\Jobs;

use App\Modules\Impact\Models\NeowsObject;
use App\Modules\Impact\Models\NeowsObject;
use App\Modules\Mood\Services\NASAClient;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * A queueable job to fetch Near-Earth Object (NEO) data from the NASA NeoWs API
 * and store it in the database using the NeowsObject model.
 */
class FetchNeoWsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public int $tries = 3;

    /**
     * The start date for the API query.
     * @var \Carbon\Carbon
     */
    protected Carbon $startDate;

    /**
     * The end date for the API query.
     * @var \Carbon\Carbon
     */
    protected Carbon $endDate;

    /**
     * Create a new job instance.
     *
     * @param \Carbon\Carbon|null $startDate The start date for the fetch range. Defaults to today.
     * @param \Carbon\Carbon|null $endDate The end date for the fetch range. Defaults to 7 days from the start date.
     */
    public function __construct(
        Carbon $startDate = null,
        Carbon $endDate = null,
    ) {
        $this->startDate = $startDate ?? Carbon::today("UTC");
        $this->endDate = $endDate ?? $this->startDate->copy()->addDays(7);
    }

    /**
     * Execute the job.
     *
     * @param \App\Modules\Mood\Services\NASAClient $nasaClient
     * @return void
     */
    public function handle(NASAClient $nasaClient): void
    {
        $startDateString = $this->startDate->toDateString();
        $endDateString = $this->endDate->toDateString();
        Log::info(
            "FetchNeoWsJob starting for date range: {$startDateString} to {$endDateString}",
        );

        try {
            $neoData = $nasaClient->fetchNeows(
                $startDateString,
                $endDateString,
            );

            if (!$neoData || !isset($neoData["near_earth_objects"])) {
                Log::warning(
                    "NeoWs data for the specified date range is missing or incomplete. Skipping.",
                );
                return;
            }

            $insertedCount = 0;
            $updatedCount = 0;

            // The API response groups NEOs by date, so we iterate through each date's array.
            foreach (
                $neoData["near_earth_objects"]
                as $date => $objectsOnDate
            ) {
                foreach ($objectsOnDate as $neo) {
                    // The 'close_approach_data' is an array; we typically care about the first one for this query.
                    $closeApproachData = $neo["close_approach_data"][0] ?? null;

                    // Use updateOrCreate to find a NEO by its neo_id or create a new one.
                    // This correctly handles `created_at` and `updated_at` timestamps.
                    $neowsObject = NeowsObject::updateOrCreate(
                        ["neo_id" => $neo["neo_reference_id"]], // Attributes to find the record by
                        [
                            "name" => $neo["name"],
                            "estimated_diameter" => $neo["estimated_diameter"], // Model will cast to JSON
                            "is_potentially_hazardous" =>
                                $neo["is_potentially_hazardous_asteroid"],
                            "close_approach" => $closeApproachData, // Model will cast to JSON
                            "orbit_data" => $neo["orbital_data"], // Model will cast to JSON
                        ],
                    );

                    // Check if the model was recently created to correctly log inserts vs. updates.
                    if ($neowsObject->wasRecentlyCreated) {
                        $insertedCount++;
                    } else {
                        $updatedCount++;
                    }
                }
            }

            Log::info(
                "FetchNeoWsJob complete. Inserted: {$insertedCount}, Updated: {$updatedCount} NEO records.",
            );
        } catch (Throwable $e) {
            Log::error(
                "FetchNeoWsJob failed for date range: {$startDateString} to {$endDateString}",
                [
                    "error" => $e->getMessage(),
                    "trace" => $e->getTraceAsString(),
                ],
            );

            // Re-throw the exception to let the queue worker handle the failure (retry, etc.).
            throw $e;
        }
    }
}
