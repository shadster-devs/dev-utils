import { HtmlTools } from '@/components/html/HtmlTools';

export default function HtmlPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            HTML Tools
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Format, validate, and minify HTML
          </p>
        </div>
        <HtmlTools />
      </div>
    </div>
  );
}
