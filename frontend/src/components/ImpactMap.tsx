'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Type Definitions ---
// Re-defining these types here to make the component self-contained.
// In a larger application, these would be in a shared `types.ts` file.

interface EstimatedDiameter {
  kilometers: {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
  };
}

interface CloseApproach {
  close_approach_date: string;
  relative_velocity: {
    kilometers_per_hour: string;
  };
  miss_distance: {
    kilometers: string;
  };
}

interface NeoData {
  id: number;
  neo_id: string;
  name: string;
  estimated_diameter: EstimatedDiameter;
  is_potentially_hazardous: boolean;
  close_approach: CloseApproach;
}

interface ImpactMapProps {
  neos: NeoData[] | undefined;
}

// --- Main Map Component ---

const ImpactMap = ({ neos }: ImpactMapProps) => {
  // A sensible default center and zoom level for a world map.
  const mapCenter: LatLngExpression = [20, 0];
  const mapZoom = 2;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%', backgroundColor: '#1a202c', borderRadius: '0.5rem' }}
      scrollWheelZoom={true}
    >
      {/* Use a dark-themed map tile layer that matches the application's aesthetic. */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Map over the NEOs data and render a CircleMarker for each one. */}
      {neos && neos.map(neo => {
        // NOTE: The NASA API does not provide a lat/lon for the close approach path.
        // For visualization purposes, we generate a random position on the globe.
        // This is purely illustrative to show the global distribution of close approaches.
        const position: LatLngExpression = [
          Math.random() * 170 - 85, // Latitude between -85 and +85
          Math.random() * 360 - 180, // Longitude between -180 and +180
        ];

        // Determine the marker's color and size based on its properties.
        const pathOptions = {
          color: neo.is_potentially_hazardous ? '#ef4444' : '#a78bfa', // Red for hazardous, purple otherwise
          fillColor: neo.is_potentially_hazardous ? '#ef4444' : '#a78bfa',
          fillOpacity: 0.7,
        };

        // The size of the circle can represent the estimated diameter of the NEO.
        const radius = Math.max(
          5, // Minimum radius of 5
          Math.min(
            30, // Maximum radius of 30
            (neo.estimated_diameter.kilometers.estimated_diameter_max * 1000) / 50 // Scale factor
          )
        );

        return (
          <CircleMarker
            key={neo.neo_id}
            center={position}
            pathOptions={pathOptions}
            radius={radius}
          >
            {/* The Popup component provides information when a marker is clicked. */}
            <Popup>
              <div className="bg-gray-800 text-white p-1 rounded-md shadow-lg border-none">
                <h3 className="font-bold text-lg">{neo.name}</h3>
                <p className={`text-sm ${neo.is_potentially_hazardous ? 'text-red-400' : 'text-gray-300'}`}>
                  {neo.is_potentially_hazardous ? 'Potentially Hazardous' : 'Not Hazardous'}
                </p>
                <ul className="mt-2 text-xs text-gray-400 space-y-1">
                  <li>
                    <strong>Approach:</strong> {neo.close_approach.close_approach_date}
                  </li>
                  <li>
                    <strong>Diameter:</strong> ~
                    {(neo.estimated_diameter.kilometers.estimated_diameter_max * 1000).toFixed(0)} meters
                  </li>
                  <li>
                    <strong>Miss Distance:</strong>{' '}
                    {parseFloat(neo.close_approach.miss_distance.kilometers).toLocaleString('en-US', { maximumFractionDigits: 0 })} km
                  </li>
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default ImpactMap;
