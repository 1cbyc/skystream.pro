'use client';

import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';

// --- Type Definitions ---
// Defines the structure of a single Mars photo object from our API.
interface MarsPhoto {
  id: number;
  nasa_id: number;
  sol: number;
  camera: string;
  img_src: string;
  earth_date: string;
  labels: string[] | null;
}

// Defines the structure of the paginated API response.
interface ApiResponse {
  current_page: number;
  data: MarsPhoto[];
  last_page: number;
  total: number;
}

// --- Helper Functions ---

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch Mars photos.');
  }
  const result = await res.json();
  return result.data; // Our backend wraps paginated data in a 'data' property.
};

const getKey = (pageIndex: number, previousPageData: ApiResponse | null): string | null => {
  // Reached the end of the data.
  if (previousPageData && !previousPageData.data.length) return null;

  // First page, no previous data.
  if (pageIndex === 0) return `${process.env.NEXT_PUBLIC_API_BASE}/mars/photos?page=1`;

  // We have previous data, so we can calculate the next page.
  if (!previousPageData) return null; // Should not happen if pageIndex > 0
  return `${process.env.NEXT_PUBLIC_API_BASE}/mars/photos?page=${previousPageData.current_page + 1}`;
};


// --- Main Page Component ---

function MarsPage() {
  const {
    data,
    error,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<ApiResponse>(getKey, fetcher);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isLoading = isLoadingInitialData || isLoadingMore;

  const photos: MarsPhoto[] = data ? data.flatMap(page => page.data) : [];

  const isEmpty = data?.[0]?.data.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data.length < 25);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mars Explorer</h1>
            <p className="text-gray-400">A curated gallery of photos from the Red Planet.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Placeholder for future filter controls */}
            <select disabled className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-500 cursor-not-allowed">
              <option>All Rovers</option>
            </select>
            <select disabled className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-500 cursor-not-allowed">
              <option>All Cameras</option>
            </select>
          </div>
        </header>

        {/* Photo Gallery */}
        {error && <ErrorMessage message={error.message} />}
        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map(photo => (
                <PhotoCard key={photo.nasa_id} photo={photo} />
              ))}
              {isLoadingMore && <LoadingSkeleton />}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              {!isReachingEnd && (
                <button
                  onClick={() => setSize(size + 1)}
                  disabled={isLoadingMore}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors text-white font-bold py-3 px-8 rounded-lg"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More Photos'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Child Components ---

const PhotoCard = ({ photo }: { photo: MarsPhoto }) => (
  <div className="group relative block bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
    <img
      src={photo.img_src}
      alt={`Mars Rover photo from sol ${photo.sol}`}
      className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
      <p className="text-sm font-semibold text-white">Sol {photo.sol}</p>
      <p className="text-xs text-gray-300">{photo.camera}</p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <>{[...Array(8)].map((_, i) => (
    <div key={i} className="bg-gray-700 rounded-lg aspect-square animate-pulse"></div>
  ))}</>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="col-span-full text-center p-8 bg-red-900/30 border border-red-700 rounded-lg">
    <h2 className="text-xl font-bold text-red-300">Could Not Load Photos</h2>
    <p className="text-red-400 mt-2">{message}</p>
  </div>
);

export default MarsPage;
