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
        Schema::create('apod_mood', function (Blueprint $table) {
            $table->id();
            $table->date('apod_date')->unique()->comment('The date of the Astronomy Picture of the Day');
            $table->string('nasa_id')->nullable()->comment('A unique identifier from NASA if available');
            $table->string('title');
            $table->string('url', 512);
            $table->string('mood', 64)->nullable()->comment('The classified mood of the image, e.g., serene, awe');
            $table->float('mood_score')->nullable()->comment('The confidence score of the mood classification');
            $table->json('color_palette')->nullable()->comment('The extracted color palette from the image');
            $table->text('ai_summary')->nullable()->comment('An AI-generated summary or description of the image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apod_mood');
    }
};
