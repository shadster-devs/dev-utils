import { Metadata } from 'next';
import { SqlTools } from '@/components/sql/SqlTools';
import { BackButton } from '@/components/common/BackButton';

export const metadata: Metadata = {
  title: 'SQL Formatter and Validator - Developer Utils',
  description: 'Format and validate SQL queries with syntax highlighting. Free online SQL beautifier and minifier.',
  keywords: 'sql formatter, sql validator, sql beautifier, sql minifier, sql tools',
};

export default function SqlPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 left-4">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SQL Tools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Format and validate SQL queries with syntax highlighting
          </p>
        </div>
        <SqlTools />
      </div>
    </div>
  );
}
