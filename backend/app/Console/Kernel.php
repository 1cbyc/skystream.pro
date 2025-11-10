<?php

namespace App\Console;

use App\Modules\Impact\Jobs\FetchNeoWsJob;
use App\Modules\Mood\Jobs\FetchAPODJob;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Modules\Mars\Commands\DispatchMarsPhotoJobs::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule): void
    {
        // Schedule the FetchAPODJob to run daily at a time when server load is typically low.
        // This dispatches the job to the queue worker.
        // `withoutOverlapping()` is a safeguard to prevent the job from running
        // again if the previous day's job hasn't finished.
        $schedule
            ->job(new FetchAPODJob())
            ->dailyAt("01:00")
            ->withoutOverlapping();

        // Schedule the FetchNeoWsJob to run daily to get the upcoming week's NEO data.
        $schedule
            ->job(new FetchNeoWsJob())
            ->dailyAt("02:00") // Staggered from the APOD job
            ->withoutOverlapping();

        // Schedule the command to dispatch Mars photo ingestion jobs daily.
        $schedule
            ->command("mars:dispatch-jobs")
            ->dailyAt("03:00") // Staggered from the other jobs
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . "/Commands");

        require base_path("routes/console.php");
    }
}
