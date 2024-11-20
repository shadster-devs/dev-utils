"use client";
import { Base64Tools } from '@/components/base64/Base64Tools';
import { BackButton } from '@/components/common/BackButton';

export default function Base64Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 left-4">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Base64 Tools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encode and decode Base64 strings
          </p>
        </div>
        <Base64Tools />
      </div>
    </div>
  );
}
