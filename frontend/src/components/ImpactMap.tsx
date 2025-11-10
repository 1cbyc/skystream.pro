"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Type Definitions ---
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

// --- Deterministic Position Generation ---

/**
 * Creates a simple but effective hash from a string.
 * This is used to ensure that each NEO has a consistent, repeatable position on the map.
 * @param str The input string (e.g., neo_id).
 * @returns A numeric hash.
 */
const stringToHash = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char; /* hash * 33 + c */
  }
  return hash;
};

/**
 * Generates a deterministic Lat/Lng coordinate based on a unique ID.
 * This prevents map markers from changing position on every re-render.
 * @param id The unique identifier for the NEO.
 * @returns A LatLngExpression array.
 */
const getDeterministicPosition = (id: string): LatLngExpression => {
  const hash = stringToHash(id);
  // Use modulo to constrain the hash to valid lat/lon ranges.
  const lat = (hash % 1700) / 10 - 85; // Latitude between -85 and +85
  const lon = (hash % 3600) / 10 - 180; // Longitude between -180 and +180
  return [lat, lon];
};

// --- Main Map Component ---

const ImpactMap = ({ neos }: ImpactMapProps) => {
  const mapCenter: LatLngExpression = [20, 0];
  const mapZoom = 2;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1a202c",
        borderRadius: "0.5rem",
      }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {neos &&
        neos.map((neo) => {
          // NOTE: The NASA API does not provide a lat/lon for the close approach path.
          // For visualization purposes, we generate a deterministic, pseudo-random position
          // based on the NEO's unique ID. This is purely illustrative but ensures stability.
          const position = getDeterministicPosition(neo.neo_id);

          const pathOptions = {
            color: neo.is_potentially_hazardous ? "#ef4444" : "#a78bfa",
            fillColor: neo.is_potentially_hazardous ? "#ef4444" : "#a78bfa",
            fillOpacity: 0.7,
          };

          const radius = Math.max(
            5,
            Math.min(
              30,
              (neo.estimated_diameter.kilometers.estimated_diameter_max *
                1000) /
                50,
            ),
          );

          return (
            <CircleMarker
              key={neo.neo_id}
              center={position}
              pathOptions={pathOptions}
              radius={radius}
            >
              <Popup>
                <div className="bg-gray-800 text-white p-1 rounded-md shadow-lg border-none">
                  <h3 className="font-bold text-lg">{neo.name}</h3>
                  <p
                    className={`text-sm ${neo.is_potentially_hazardous ? "text-red-400" : "text-gray-300"}`}
                  >
                    {neo.is_potentially_hazardous
                      ? "Potentially Hazardous"
                      : "Not Hazardous"}
                  </p>
                  <ul className="mt-2 text-xs text-gray-400 space-y-1">
                    <li>
                      <strong>Approach:</strong>{" "}
                      {neo.close_approach.close_approach_date}
                    </li>
                    <li>
                      <strong>Diameter:</strong> ~
                      {(
                        neo.estimated_diameter.kilometers
                          .estimated_diameter_max * 1000
                      ).toFixed(0)}{" "}
                      meters
                    </li>
                    <li>
                      <strong>Miss Distance:</strong>{" "}
                      {parseFloat(
                        neo.close_approach.miss_distance.kilometers,
                      ).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      km
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
