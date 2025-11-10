<?php

namespace App\Modules\Impact\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * NeowsObject Model
 *
 * Represents a record in the 'neows_objects' table.
 */
class NeowsObject extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'neows_objects';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'neo_id',
        'name',
        'estimated_diameter',
        'is_potentially_hazardous',
        'close_approach',
        'orbit_data',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estimated_diameter' => 'array',
        'is_potentially_hazardous' => 'boolean',
        'close_approach' => 'array',
        'orbit_data' => 'array',
    ];
}
