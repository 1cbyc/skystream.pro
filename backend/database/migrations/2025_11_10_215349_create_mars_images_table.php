<?php

use Illuminate/Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('mars_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nasa_id')->unique()->comment('The unique identifier for the image from NASA');
            $table->integer('sol')->comment('The Martian day (sol) the photo was taken on');
            $table->string('camera')->comment('The name of the rover camera');
            $table->string('img_src', 512)->comment('The URL source for the image');
            $table->json('labels')->nullable()->comment('AI-generated labels for the image content (e.g., rock, soil, tracks)');
            $table->timestamp('earth_date')->comment('The Earth date the photo was taken on');
            $table->timestamps();

            $table->index('sol');
            $table->index('camera');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('mars_images');
    }
};
