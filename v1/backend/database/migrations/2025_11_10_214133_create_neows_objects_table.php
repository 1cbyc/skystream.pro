<?php

use Illuminate\Database\Migrations\Migration;
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
        Schema::create('neows_objects', function (Blueprint $table) {
            $table->id();
            $table->string('neo_id')->unique()->comment('The unique identifier for the Near-Earth Object');
            $table->string('name')->comment('The name of the NEO');
            $table->json('estimated_diameter')->comment('Estimated diameter in kilometers, meters, miles, and feet');
            $table->boolean('is_potentially_hazardous')->comment('Flag indicating if the object is potentially hazardous');
            $table->json('close_approach')->comment('Data about the closest approach to Earth');
            $table->json('orbit_data')->comment('Orbital data for the NEO');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('neows_objects');
    }
};
