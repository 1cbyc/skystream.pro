<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nasa_cache', function (Blueprint $table) {
            $table->id();
            $table->enum('source', [
                'APOD',
                'NEOWS',
                'DONKI',
                'MARS',
                'EPIC',
                'IMAGE_LIBRARY'
            ])->comment('The NASA API source of the cached data');

            $table->string('source_id')->nullable()->comment('An identifier for the specific resource from the source, e.g., a date for APOD');
            $table->longText('payload')->comment('The JSON response from the API');
            $table->timestamp('fetched_at')->comment('When the data was fetched from the API');
            $table->timestamp('expires_at')->nullable()->comment('When the cached data should be considered stale');

            $table->unique(['source', 'source_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nasa_cache');
    }
};
