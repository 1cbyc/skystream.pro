<?php

namespace App\Modules\Mood\Jobs;

use App\Modules\Mood\Services\NASAClient;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * A queueable job to fetch the Astronomy Picture of the Day (APOD) from NASA,
 * perform a basic analysis, and store it in the database.
 */
class FetchAPODJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The date for which to fetch the APOD.
     * @var \Carbon\Carbon
     */
    protected Carbon $date;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param \Carbon\Carbon|null $date The specific date to fetch. Defaults to today UTC if null.
     */
    public function __construct(Carbon $date = null)
    {
        $this->date = $date ?? Carbon::today('UTC');
    }

    /**
     * Execute the job.
     *
     * @param \App\Modules\Mood\Services\NASAClient $nasaClient
     * @return void
     */
    public function handle(NASAClient $nasaClient): void
    {
        $dateString = $this->date->toDateString();
        Log::info("FetchAPODJob starting for date: {$dateString}");

        try {
            $apodData = $nasaClient->fetchApod($dateString);

            if (!$apodData || !isset($apodData['media_type'])) {
                Log::warning("APOD data for {$dateString} is missing or incomplete. Skipping.");
                return;
            }

            if ($apodData['media_type'] !== 'image') {
                Log::info("APOD for {$dateString} is a {$apodData['media_type']}, not an image. Skipping analysis.");
                // Optionally, we could still store the record without mood data.
                return;
            }

            // Perform a basic, heuristic-based analysis for the MVP.
            $analysis = $this->performAnalysis($apodData);

            // Create or update the record in the database. This is idempotent.
            DB::table('apod_mood')->updateOrInsert(
                ['apod_date' => $dateString],
                [
                    'title' => $apodData['title'],
                    'url' => $apodData['hdurl'] ?? $apodData['url'], // Prefer HD URL
                    'nasa_id' => $apodData['date'], // Using the date as a unique identifier for APOD
                    'mood' => $analysis['mood'],
                    'mood_score' => $analysis['score'],
                    'color_palette' => json_encode($analysis['palette']),
                    'ai_summary' => $apodData['explanation'], // Use the explanation as a summary for now
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            Log::info("Successfully processed and stored APOD for {$dateString}.");

        } catch (Throwable $e) {
            Log::error("FetchAPODJob failed for date: {$dateString}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Re-throw the exception to allow Laravel's queue to handle the failure
            // (e.g., retry the job or move it to the failed_jobs table).
            throw $e;
        }
    }

    /**
     * Performs a simple, heuristic-based analysis of the APOD data.
     *
     * This is a placeholder for a more advanced image analysis service.
     *
     * @param array $data The APOD data from the NASA API.
     * @return array An array containing the mood, a confidence score, and a placeholder color palette.
     */
    private function performAnalysis(array $data): array
    {
        $text = strtolower(($data['title'] ?? '') . ' ' . ($data['explanation'] ?? ''));

        // Default values
        $mood = 'neutral';
        $score = 0.5;

        // Simple keyword matching for mood classification
        if (preg_match('/\b(nebula|galaxy|stars|serene|calm|deep space)\b/', $text)) {
            $mood = 'awe';
            $score = 0.85;
        } elseif (preg_match('/\b(sun|flare|energetic|supernova|explosion)\b/', $text)) {
            $mood = 'energetic';
            $score = 0.8;
        } elseif (preg_match('/\b(dark|shadow|void|black hole|mysterious)\b/', $text)) {
            $mood = 'mysterious';
            $score = 0.9;
        } elseif (preg_match('/\b(earth|planet|home|our world|satellite)\b/', $text)) {
            $mood = 'contemplative';
            $score = 0.75;
        }

        return [
            'mood'    => $mood,
            'score'   => $score,
            // A placeholder color palette. A real implementation would extract this from the image.
            'palette' => ['#0A192F', '#172A45', '#30415D', '#566E87', '#B9D5F0'],
        ];
    }
}
