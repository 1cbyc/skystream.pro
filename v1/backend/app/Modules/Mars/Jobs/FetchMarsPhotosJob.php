<?php

namespace App\Modules\Mars\Jobs;

use App\Modules\Mood\Services\NASAClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * A queueable job to fetch Mars Rover photos for a specific rover and Martian day (sol)
 * and store them in the database.
 */
class FetchMarsPhotosJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public int $tries = 3;

    /**
     * The name of the Mars rover.
     *
     * @var string
     */
    protected string $rover;

    /**
     * The Martian day (sol) to fetch photos for.
     *
     * @var int
     */
    protected int $sol;

    /**
     * Create a new job instance.
     *
     * @param string $rover The name of the rover (e.g., 'curiosity', 'opportunity', 'spirit').
     * @param int $sol The Martian day to query.
     */
    public function __construct(string $rover, int $sol)
    {
        $this->rover = $rover;
        $this->sol = $sol;
    }

    /**
     * Execute the job.
     *
     * @param \App\Modules\Mood\Services\NASAClient $nasaClient
     * @return void
     */
    public function handle(NASAClient $nasaClient): void
    {
        Log::info("FetchMarsPhotosJob starting for rover: {$this->rover}, sol: {$this->sol}");

        try {
            $page = 1;
            $newPhotosCount = 0;

            // Loop through pages until no more photos are returned.
            while (true) {
                $photosData = $nasaClient->fetchMarsPhotos($this->rover, $this->sol, null, $page);

                if (!$photosData || empty($photosData['photos'])) {
                    // No more photos on this page, or an API error occurred.
                    break;
                }

                $recordsToInsert = [];
                foreach ($photosData['photos'] as $photo) {
                    $recordsToInsert[] = [
                        'nasa_id' => $photo['id'],
                        'sol' => $photo['sol'],
                        'camera' => $photo['camera']['name'],
                        'img_src' => $photo['img_src'],
                        'earth_date' => $photo['earth_date'],
                        // 'labels' will be populated by a separate AI enrichment process in the future.
                        'labels' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Use insertOrIgnore to efficiently add only new records,
                // relying on the 'nasa_id' unique constraint to prevent duplicates.
                $insertedCount = DB::table('mars_images')->insertOrIgnore($recordsToInsert);
                $newPhotosCount += $insertedCount;

                // If this page was the last one, the next fetch will be empty and the loop will break.
                $page++;
            }

            Log::info("FetchMarsPhotosJob complete for rover: {$this->rover}, sol: {$this->sol}. Added {$newPhotosCount} new photos.");

        } catch (Throwable $e) {
            Log::error("FetchMarsPhotosJob failed for rover: {$this->rover}, sol: {$this->sol}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Re-throw the exception to let the queue worker handle the job failure.
            throw $e;
        }
    }
}
