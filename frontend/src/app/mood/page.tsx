"use client";

import { useState } from "react";
import useSWR from "swr";
import { format, subDays, parseISO } from "date-fns";

// Define the structure of the APOD data we expect from the API.
interface ApodData {
  title: string;
  url: string;
  explanation: string;
  mood: string;
  color_palette: string[];
  apod_date: string;
}

// A simple fetcher function for useSWR. It throws an error on non-ok responses.
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(
      errorData.message || "An error occurred while fetching the data.",
    );
    throw error;
  }

  const result = await res.json();
  return result.data; // The backend wraps data in a 'data' property.
};

/**
 * The MoodPage component displays the Astronomy Picture of the Day (APOD)
 * and its associated mood analysis. It allows users to select a date to view past APODs.
 */
const MoodPage = () => {
  // State to manage the currently selected date. Default to today.
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format the date into YYYY-MM-DD for the API request.
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  // Construct the API URL using the environment variable.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/mood/${formattedDate}`;

  // Use the SWR hook for data fetching, caching, and revalidation.
  const {
    data: apodData,
    error,
    isLoading,
  } = useSWR<ApodData>(apiUrl, fetcher);

  // Handlers for changing the date.
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We add a 'T00:00:00' to ensure the date is parsed in the local timezone,
    // avoiding off-by-one day errors.
    const newDate = new Date(e.target.value + "T00:00:00");
    if (newDate <= new Date()) {
      // Prevent selecting future dates
      setCurrentDate(newDate);
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              APOD Mood Visualizer
            </h1>
            <p className="text-gray-400">
              The cosmos through color and emotion, one day at a time.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2">
            <button
              onClick={goToPreviousDay}
              className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              title="Previous Day"
            >
              &lt;
            </button>
            <input
              type="date"
              value={formattedDate}
              onChange={handleDateChange}
              max={format(new Date(), "yyyy-MM-dd")}
              className="bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={goToToday}
              className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              title="Go to Today"
            >
              Today
            </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700 min-h-[60vh] flex items-center justify-center">
          {isLoading && <LoadingSkeleton />}
          {error && <ErrorMessage message={error.message} />}
          {apodData && !isLoading && <ApodDisplay data={apodData} />}
        </div>
      </div>
    </div>
  );
};

// --- Child Components ---

const LoadingSkeleton = () => (
  <div className="w-full animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div className="w-full bg-gray-700 rounded-lg aspect-square"></div>
    <div className="flex flex-col gap-4">
      <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
      <div className="h-6 w-1/4 bg-gray-700 rounded"></div>
      <div className="h-10 w-1/2 bg-gray-700 rounded-full mt-2"></div>
      <div className="h-32 w-full bg-gray-700 rounded mt-4"></div>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center p-8 bg-red-900/30 border border-red-700 rounded-lg">
    <h2 className="text-2xl font-bold text-red-300 mb-2">
      Failed to Load Data
    </h2>
    <p className="text-red-400">{message}</p>
    <p className="text-gray-400 mt-4 text-sm">
      The picture for this day might not be available or may not be an image.
    </p>
  </div>
);

const ApodDisplay = ({ data }: { data: ApodData }) => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    {/* Image */}
    <div className="w-full">
      <img
        src={data.url}
        alt={data.title}
        className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-square bg-gray-900"
      />
    </div>

    {/* Details */}
    <div className="flex flex-col gap-4">
      <span className="text-sm text-gray-400 font-medium">
        {format(parseISO(data.apod_date), "MMMM d, yyyy")}
      </span>
      <h1 className="text-4xl font-bold text-white">{data.title}</h1>

      {/* Mood Tag */}
      <div className="flex items-center gap-3 my-2">
        <span className="text-lg font-semibold text-gray-300">Mood:</span>
        <span className="px-4 py-1 bg-purple-600/80 text-white text-sm font-bold rounded-full capitalize border border-purple-500">
          {data.mood}
        </span>
      </div>

      {/* Color Palette */}
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold text-gray-300">
          Color Palette:
        </span>
        <div className="flex gap-1 h-10 w-full max-w-sm">
          {data.color_palette.map((color, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm border-2 border-transparent"
              style={{ backgroundColor: color }}
              title={color}
            ></div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <p className="text-gray-300 leading-relaxed mt-4 text-justify">
        {data.explanation}
      </p>
    </div>
  </div>
);

export default MoodPage;
