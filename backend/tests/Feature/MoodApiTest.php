<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MoodApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test fetching the APOD data for today.
     *
     * @return void
     */
    public function test_can_get_apod_for_today(): void
    {
        $today = Carbon::today('UTC');
        $testData = [
            'apod_date' => $today->toDateString(),
            'title' => 'Test APOD for Today',
            'url' => 'http://example.com/today.jpg',
            'mood' => 'testful',
            'mood_score' => 0.99,
            'color_palette' => json_encode(['#ffffff', '#000000']),
            'ai_summary' => 'This is a test summary.',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Seed the database with today's data
        DB::table('apod_mood')->insert($testData);

        // Make the API request
        $response = $this->getJson('/api/mood/today');

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'ok',
                     'data' => [
                         'apod_date' => $today->toDateString(),
                         'title' => 'Test APOD for Today',
                         'mood' => 'testful',
                     ]
                 ]);
    }

    /**
     * Test fetching the APOD data for a specific date.
     *
     * @return void
     */
    public function test_can_get_apod_for_specific_date(): void
    {
        $specificDate = Carbon::yesterday('UTC');
        $testData = [
            'apod_date' => $specificDate->toDateString(),
            'title' => 'Test APOD for Yesterday',
            'url' => 'http://example.com/yesterday.jpg',
            'mood' => 'nostalgic',
            'mood_score' => 0.8,
            'color_palette' => json_encode(['#cccccc', '#333333']),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Seed the database
        DB::table('apod_mood')->insert($testData);

        // Make the API request
        $response = $this->getJson('/api/mood/' . $specificDate->toDateString());

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'ok',
                     'data' => [
                         'title' => 'Test APOD for Yesterday',
                     ]
                 ]);
    }

    /**
     * Test the response when no data is available for the requested date.
     *
     * @return void
     */
    public function test_returns_404_when_apod_data_not_found(): void
    {
        $dateWithNoData = '2000-01-01';

        $response = $this->getJson('/api/mood/' . $dateWithNoData);

        $response->assertStatus(404)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'APOD data not found for the specified date.',
                 ]);
    }

    /**
     * Test the response for an invalid date format.
     *
     * @return void
     */
    public function test_returns_422_for_invalid_date_format(): void
    {
        $invalidDate = 'not-a-date';

        $response = $this->getJson('/api/mood/' . $invalidDate);

        $response->assertStatus(422) // Unprocessable Entity
                 ->assertJson([
                     'status' => 'error',
                 ]);
    }
}
