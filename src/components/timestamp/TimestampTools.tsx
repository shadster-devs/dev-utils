import { useState, useEffect } from 'react';
import {
  ClipboardIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export function TimestampTools() {
  const [date, setDate] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [timestampMs, setTimestampMs] = useState('');
  const [localTimeStr, setLocalTimeStr] = useState('');
  const [utcTimeStr, setUtcTimeStr] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Update all time values when date changes
  useEffect(() => {
    if (date) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const ts = Math.floor(dateObj.getTime() / 1000);
          const tsMs = dateObj.getTime();
          setTimestamp(ts.toString());
          setTimestampMs(tsMs.toString());
          setLocalTimeStr(dateObj.toLocaleString());
          setUtcTimeStr(dateObj.toUTCString());
          setError('');
        }
      } catch (err) {
        setError('Invalid date format');
      }
    }
  }, [date]);

  // Update all time values when timestamp changes
  useEffect(() => {
    if (timestamp && !date) {
      try {
        const timestampNum = parseInt(timestamp, 10);
        if (!isNaN(timestampNum)) {
          const dateObj = new Date(timestampNum * 1000);
          setDate(dateObj.toISOString().slice(0, 16));
          setTimestampMs((timestampNum * 1000).toString());
          setLocalTimeStr(dateObj.toLocaleString());
          setUtcTimeStr(dateObj.toUTCString());
          setError('');
        }
      } catch (err) {
        setError('Invalid timestamp');
      }
    }
  }, [timestamp]);

  // Update all time values when millisecond timestamp changes
  useEffect(() => {
    if (timestampMs && !date && !timestamp) {
      try {
        const timestampMsNum = parseInt(timestampMs, 10);
        if (!isNaN(timestampMsNum)) {
          const dateObj = new Date(timestampMsNum);
          setDate(dateObj.toISOString().slice(0, 16));
          setTimestamp(Math.floor(timestampMsNum / 1000).toString());
          setLocalTimeStr(dateObj.toLocaleString());
          setUtcTimeStr(dateObj.toUTCString());
          setError('');
        }
      } catch (err) {
        setError('Invalid millisecond timestamp');
      }
    }
  }, [timestampMs]);

  const useCurrentTime = () => {
    const now = new Date();
    setDate(now.toISOString().slice(0, 16));
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
    setTimestampMs(now.getTime().toString());
    setLocalTimeStr(now.toLocaleString());
    setUtcTimeStr(now.toUTCString());
    setError('');
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-end items-center mb-10">
        <button
          onClick={useCurrentTime}
          className="inline-flex items-center px-4 py-2.5 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <ClockIcon className="h-5 w-5 mr-2" />
          Use Current Time
        </button>
      </div>

      <div className="space-y-8">
        {/* Date Input */}
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Date and Time
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTimestamp('');
                setTimestampMs('');
              }}
              className="flex-1 block w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-colors duration-200"
            />
            {date && (
              <button
                onClick={() => copyToClipboard(date, 'date')}
                className="inline-flex items-center px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {copied === 'date' ? (
                  <CheckIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Formatted Time Display */}
        {(localTimeStr || utcTimeStr) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Local Time
              </label>
              <div className="text-lg font-mono">{localTimeStr}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                UTC Time
              </label>
              <div className="text-lg font-mono">{utcTimeStr}</div>
            </div>
          </div>
        )}

        {/* Timestamp Inputs */}
        <div className="space-y-4">
          {/* Unix Timestamp (seconds) */}
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Unix Timestamp (seconds)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => {
                  setTimestamp(e.target.value);
                  setDate('');
                  setTimestampMs('');
                }}
                placeholder="Enter Unix timestamp in seconds"
                className="flex-1 block w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-colors duration-200"
              />
              {timestamp && (
                <button
                  onClick={() => copyToClipboard(timestamp, 'timestamp')}
                  className="inline-flex items-center px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {copied === 'timestamp' ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Unix Timestamp (milliseconds) */}
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Unix Timestamp (milliseconds)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={timestampMs}
                onChange={(e) => {
                  setTimestampMs(e.target.value);
                  setDate('');
                  setTimestamp('');
                }}
                placeholder="Enter Unix timestamp in milliseconds"
                className="flex-1 block w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-colors duration-200"
              />
              {timestampMs && (
                <button
                  onClick={() => copyToClipboard(timestampMs, 'timestampMs')}
                  className="inline-flex items-center px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {copied === 'timestampMs' ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
