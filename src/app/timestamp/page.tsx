"use client";

import { Metadata } from 'next';
import { TimestampTools } from '@/components/timestamp/TimestampTools';
import { BackButton } from '@/components/common/BackButton';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter - Developer Utils',
  description: 'Convert between Unix timestamps and human-readable dates. Free online timestamp converter with UTC and local time support.',
  keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp',
};

export default function TimestampPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 left-4">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Timestamp Tools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Convert between dates and Unix timestamps
          </p>
        </div>
        <TimestampTools />
      </div>
    </div>
  );
}
