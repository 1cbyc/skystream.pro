<?php

namespace App\Modules\Mars\Commands;

use App\Modules\Mars\Jobs\FetchMarsPhotosJob;
use App\Modules\Mood\Services\NASAClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * A command to dispatch jobs for fetching Mars Rover photos.
 *
 * This command acts as a "master scheduler". It queries the NASA API for the
 * latest available Martian day (sol) for each active rover and then dispatches
 * a specific job to ingest the photos for that day. This command should be
 * scheduled to run daily.
 */
class DispatchMarsPhotoJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mars:dispatch-jobs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetches the latest sol for active Mars rovers and dispatches jobs to ingest their photos.';

    /**
     * The list of currently active Mars rovers to check.
     *
     * @var array
     */
    protected array $rovers = ['curiosity', 'perseverance'];

    /**
     * Execute the console command.
     *
     * @param \App\Modules\Mood\Services\NASAClient $nasaClient
     * @return int
     */
    public function handle(NASAClient $nasaClient): int
    {
        $this->info('Starting Mars photo job dispatch...');

        foreach ($this->rovers as $rover) {
            try {
                $this->line("Fetching manifest for rover: {$rover}...");

                // This assumes a `fetchRoverManifest` method exists in NASAClient.
                // This method should query the Rover Manifest API for metadata.
                $manifest = $nasaClient->fetchRoverManifest($rover);

                if (!$manifest || !isset($manifest['photo_manifest']['max_sol'])) {
                    $this->warn("Could not retrieve manifest or max_sol for rover: {$rover}. Skipping.");
                    continue;
                }

                $maxSol = $manifest['photo_manifest']['max_sol'];
                $this->info("Latest sol for {$rover} is {$maxSol}.");

                // Dispatch a job to fetch photos for the most recent sol.
                // The job itself is responsible for handling pagination and preventing duplicates.
                FetchMarsPhotosJob::dispatch($rover, $maxSol);

                $this->info("Dispatched FetchMarsPhotosJob for rover: {$rover}, sol: {$maxSol}.");

            } catch (Throwable $e) {
                $this->error("Failed to dispatch job for rover: {$rover}. Error: {$e->getMessage()}");
                Log::error("DispatchMarsPhotoJobs failed for rover: {$rover}", ['exception' => $e]);
            }
        }

        $this->info('Mars photo job dispatch complete.');
        return Command::SUCCESS;
    }
}
