<?php

namespace App\Jobs;

use App\Services\NASAClient;
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
 * Fetches the Astronomy Picture of the Day (APOD) from the NASA API,
 * performs a basic analysis, and stores it in the database.
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
     * Create a new job instance.
     *
     * @param \Carbon\Carbon|null $date The specific date to fetch. Defaults to today if null.
     */
    public function __construct(Carbon $date = null)
    {
        // If no date is provided, default to the current date in UTC.
        $this->date = $date ?? Carbon::today('UTC');
    }

    /**
     * Execute the job.
     *
     * This method is called when the job is processed by a queue worker.
     *
     * @param \App\Services\NASAClient $nasaClient The service client for NASA APIs.
     * @return void
     */
    public function handle(NASAClient $nasaClient): void
    {
        try {
            $dateString = $this->date->toDateString();
            Log::info("Fetching APOD for date: {$dateString}");

            $apodData = $nasaClient->getApod($dateString);

            if (!$apodData || !isset($apodData['media_type'])) {
                Log::warning('APOD data is missing or incomplete.', ['date' => $dateString]);
                return;
            }

            // For the MVP, we only process images. Video processing can be added later.
            if ($apodData['media_type'] !== 'image') {
                Log::info("APOD for {$dateString} is not an image, skipping mood processing.");
                return;
            }

            // Placeholder for a more advanced analysis service.
            // In a real implementation, this might dispatch another job to download
            // and process the image to extract the color palette and mood.
            $moodData = $this->classifyMoodFromData($apodData);

            // Use updateOrInsert to create a new record or update an existing one
            // based on the `apod_date`.
            DB::table('apod_mood')->updateOrInsert(
                ['apod_date' => $dateString],
                [
                    'title'         => $apodData['title'],
                    'url'           => $apodData['url'],
                    'nasa_id'       => $apodData['date'], // Using date as a unique ID for APOD
                    'mood'          => $moodData['mood'],
                    'mood_score'    => $moodData['score'],
                    'color_palette' => json_encode($moodData['palette']),
                    // `ai_summary` will be populated by a different process.
                    'ai_summary'    => null,
                    'created_at'    => Carbon::now(),
                    'updated_at'    => Carbon::now(),
                ]
            );

            Log::info("Successfully processed and stored APOD for {$dateString}");

        } catch (Throwable $e) {
            Log::error('An error occurred in FetchAPODJob.', [
                'exception_message' => $e->getMessage(),
                'date'              => $this->date->toDateString(),
                'trace'             => $e->getTraceAsString(),
            ]);

            // Release the job back onto the queue for another attempt after a delay.
            // This is useful for transient errors like network issues.
            $this->release(300); // 5 minutes
        }
    }

    /**
     * A placeholder for the mood classification logic based on APOD metadata.
     *
     * This is a simple heuristic-based approach for the MVP. A more advanced
     * implementation would involve actual image analysis.
     *
     * @param array $apodData The data returned from the APOD API.
     * @return array An array containing the mood, score, and a placeholder palette.
     */
    private function classifyMoodFromData(array $apodData): array
    {
        $title = strtolower($apodData['title'] ?? '');
        $explanation = strtolower($apodData['explanation'] ?? '');
        $text = $title . ' ' . $explanation;

        $mood = 'neutral';
        $score = 0.5;

        // Simple keyword-based heuristics
        if (preg_match('/nebula|galaxy|serene|stars|calm/', $text)) {
            $mood = 'awe';
            $score = 0.8;
        } elseif (preg_match('/sun|flare|energetic|explosion|supernova/', $text)) {
            $mood = 'energetic';
            $score = 0.7;
        } elseif (preg_match('/dark|shadow|void|black hole|mysterious/', $text)) {
            $mood = 'mysterious';
            $score = 0.85;
        } elseif (preg_match('/earth|planet|home|our/', $text)) {
            $mood = 'contemplative';
            $score = 0.75;
        }

        return [
            'mood'    => $mood,
            'score'   => $score,
            'palette' => ['#1a202c', '#2d3748', '#4a5568', '#718096', '#edf2f7'], // Placeholder palette
        ];
    }
}
