"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { format, subDays, startOfWeek } from "date-fns";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";

// --- Type Definitions ---
// These types should match the structure of the data coming from the backend API.

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

interface ApiResponse {
  current_page: number;
  data: NeoData[];
  total: number;
}

// --- Helper Functions ---

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch NEO data.");
  }
  const result = await res.json();
  return result.data; // The backend wraps paginated data in a 'data' property.
};

// --- Main Page Component ---

const ImpactPage = () => {
  // State for the date range, defaulting to the current week.
  const [startDate, setStartDate] = useState(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  // Construct the API URL based on the selected date range.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/impact/nearby?date_from=${format(startDate, "yyyy-MM-dd")}&date_to=${format(endDate, "yyyy-MM-dd")}`;

  // Use SWR for data fetching.
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR<ApiResponse>(apiUrl, fetcher);

  // Dynamically import the map component to avoid SSR issues with Leaflet.
  const ImpactMap = useMemo(
    () =>
      dynamic(() => import("@/components/ImpactMap"), {
        ssr: false,
        loading: () => (
          <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg"></div>
        ),
      }),
    [],
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Date Range Picker */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">NEOWS Impact Explorer</h1>
            <p className="text-gray-400">
              Tracking near-Earth objects and their close approaches.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2">
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value + "T00:00:00");
                if (e.target.value && !isNaN(newDate.getTime())) {
                  setStartDate(newDate);
                }
              }}
              className="bg-gray-800 text-white p-2 rounded-md"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const newDate = new Date(e.target.value + "T00:00:00");
                if (e.target.value && !isNaN(newDate.getTime())) {
                  setEndDate(newDate);
                }
              }}
              max={format(new Date(), "yyyy-MM-dd")}
              className="bg-gray-800 text-white p-2 rounded-md"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Map */}
          <div className="lg:col-span-2 h-[60vh] bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-700">
            <ImpactMap neos={apiResponse?.data} />
          </div>

          {/* Right Column: List of NEOs */}
          <div className="lg:col-span-1 bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-700 h-[60vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Close Approaches ({apiResponse?.total ?? 0})
            </h2>
            {isLoading && <NeoListSkeleton />}
            {error && <ErrorMessage message={error.message} />}
            {apiResponse && <NeoList neos={apiResponse.data} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Child Components ---

const NeoList = ({ neos }: { neos: NeoData[] }) => {
  if (!neos || neos.length === 0) {
    return (
      <p className="text-gray-400">
        No near-Earth objects found for the selected date range.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {neos.map((neo) => (
        <div
          key={neo.neo_id}
          className={`p-3 rounded-lg border ${neo.is_potentially_hazardous ? "border-red-500/50 bg-red-900/20" : "border-gray-700 bg-gray-800"}`}
        >
          <p className="font-bold text-white">{neo.name}</p>
          <p className="text-sm text-gray-400">
            Miss Distance:{" "}
            {parseFloat(
              neo.close_approach.miss_distance.kilometers,
            ).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
            km
          </p>
          <p className="text-xs text-gray-500">
            Diameter: ~
            {(
              neo.estimated_diameter.kilometers.estimated_diameter_min * 1000
            ).toFixed(0)}{" "}
            m
          </p>
        </div>
      ))}
    </div>
  );
};

const NeoListSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-3 rounded-lg bg-gray-700 h-16"></div>
    ))}
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
    <p className="font-bold text-red-300">Error</p>
    <p className="text-red-400 text-sm">{message}</p>
  </div>
);

export default ImpactPage;
