'use client';

import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

// Define the structure of the APOD data we expect from the API
interface ApodData {
  title: string;
  url: string;
  explanation: string;
  mood: string;
  color_palette: string[];
  apod_date: string;
}

// Define the structure for API errors
interface ApiError {
  message: string;
}

const MoodPage = () => {
  const [date, setDate] = useState(new Date());
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApodData = async () => {
      setIsLoading(true);
      setError(null);

      const formattedDate = format(date, 'yyyy-MM-dd');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/mood/${formattedDate}`;

      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch data');
        }

        // The data is nested in a 'data' property
        setApodData(result.data);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        setApodData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApodData();
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    // Prevent selecting future dates
    if (newDate <= new Date()) {
      setDate(newDate);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800 rounded-lg animate-pulse">
          <div className="w-full h-96 bg-gray-700 rounded-lg mb-6"></div>
          <div className="w-3/4 h-8 bg-gray-700 rounded mb-4"></div>
          <div className="w-1/2 h-6 bg-gray-700 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error</h2>
          <p className="text-red-400">{error}</p>
          <p className="text-gray-400 mt-4">This may be because the data for the selected date is not yet available or is not an image.</p>
        </div>
      );
    }

    if (apodData) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="w-full">
            <img
              src={apodData.url}
              alt={apodData.title}
              className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-square"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm text-gray-400">{format(new Date(apodData.apod_date), 'MMMM d, yyyy')}</span>
            <h1 className="text-4xl font-bold text-white">{apodData.title}</h1>

            <div className="flex items-center gap-4 my-2">
              <span className="text-lg font-semibold text-gray-300">Mood:</span>
              <span className="px-4 py-1 bg-purple-600 text-white text-sm font-bold rounded-full capitalize">
                {apodData.mood}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold text-gray-300">Color Palette:</span>
              <div className="flex gap-2 h-10">
                {apodData.color_palette.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mt-4">
              {apodData.explanation}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">APOD Mood Visualizer</h1>
            <p className="text-gray-400">The cosmos through color and emotion.</p>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => handleDateChange(subDays(date, 1))} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">-</button>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            />
             <button onClick={() => handleDateChange(new Date())} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">Today</button>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 sm:p-8 rounded-xl shadow-lg border border-gray-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
