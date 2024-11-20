import { Metadata } from 'next';
import { JsonTools } from '@/components/json/JsonTools';
import { BackButton } from '@/components/common/BackButton';

export const metadata: Metadata = {
  title: 'JSON Formatter and Validator - Developer Utils',
  description: 'Format, validate, escape/unescape, and minify JSON. Free online JSON beautifier and validator.',
  keywords: 'json formatter, json validator, json beautifier, json minifier, json tools',
};

export default function JsonPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 left-4">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            JSON Tools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Format, validate, escape/unescape, and minify JSON
          </p>
        </div>
        <JsonTools />
      </div>
    </div>
  );
}
