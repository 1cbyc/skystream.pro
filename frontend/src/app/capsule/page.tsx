'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { format, parseISO } from 'date-fns';

// --- Type Definitions ---
// These types define the structure of the data we expect from the capsule API endpoint.

interface ApodData {
  title: string;
  url: string;
  explanation: string;
  mood: string;
  color_palette: string[];
  apod_date: string;
}

interface CapsuleData {
  apod: ApodData;
  // This structure is extensible for future data like planetary positions.
}

// --- Helper Functions ---

const fetcher = async (url: string): Promise<CapsuleData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to generate capsule.');
  }
  const result = await res.json();
  return result.data;
};

// --- Main Page Component ---

const CapsulePage = () => {
  // `dateInput` tracks the value in the date picker.
  const [dateInput, setDateInput] = useState<string>('');
  // `submittedDate` tracks the date the user has submitted, which triggers the API fetch.
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);

  // The API URL is conditional on `submittedDate` being set.
  const apiUrl = submittedDate
    ? `${process.env.NEXT_PUBLIC_API_BASE}/capsule/birthday?date=${submittedDate}`
    : null;

  // SWR will only start fetching if `apiUrl` is not null.
  const { data: capsuleData, error, isLoading } = useSWR<CapsuleData>(apiUrl, fetcher);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateInput) {
      setSubmittedDate(dateInput);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header and Form Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Capsule Generator</h1>
          <p className="text-gray-400 mt-2">
            Generate a "space snapshot" for any significant date, like your birthday.
          </p>
        </header>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            required
            className="bg-gray-700 text-white p-3 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 transition-colors text-white font-bold py-3 px-6 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Capsule'}
          </button>
        </form>

        {/* Content Display Area */}
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700 min-h-[50vh] flex items-center justify-center">
          {!submittedDate && <InitialState />}
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error.message} />}
          {capsuleData && !isLoading && <CapsuleDisplay data={capsuleData} />}
        </div>
      </div>
    </div>
  );
};

// --- Child Components for different states ---

const InitialState = () => (
  <div className="text-center text-gray-400">
    <p>Select a date and click "Generate Capsule" to see your moment in space.</p>
  </div>
);

const LoadingState = () => (
  <div className="text-center text-gray-400 animate-pulse">
    <p>Generating your space capsule...</p>
    <div className="w-full h-64 bg-gray-700 rounded-lg mt-4"></div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center p-6 bg-red-900/30 border border-red-700 rounded-lg">
    <h2 className="text-xl font-bold text-red-300">Generation Failed</h2>
    <p className="text-red-400 mt-2">{message}</p>
  </div>
);

const CapsuleDisplay = ({ data }: { data: CapsuleData }) => (
  <div className="w-full bg-gray-900 rounded-lg shadow-2xl p-6 border border-gray-700">
    <header className="text-center border-b border-gray-700 pb-4 mb-4">
      <p className="text-lg text-gray-300">Your Snapshot for</p>
      <h2 className="text-3xl font-bold text-purple-400">
        {format(parseISO(data.apod.apod_date), 'MMMM d, yyyy')}
      </h2>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <img
        src={data.apod.url}
        alt={data.apod.title}
        className="rounded-md w-full h-auto object-cover aspect-square bg-gray-800"
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-semibold text-white">{data.apod.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed text-justify">
          {data.apod.explanation}
        </p>
      </div>
    </div>
  </div>
);

export default CapsulePage;
