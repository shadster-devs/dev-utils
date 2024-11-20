'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      <ArrowLeftIcon className="h-5 w-5 mr-2" />
      Back to Home
    </Link>
  );
}
