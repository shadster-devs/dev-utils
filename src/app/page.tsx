import Link from 'next/link';

interface UtilityCard {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const utilities: UtilityCard[] = [
  {
    title: 'JSON Tools',
    description: 'Format, validate, escape/unescape, and minify JSON',
    href: '/json',
    icon: '{ }',
  },
  // {
  //   title: 'HTML Tools',
  //   description: 'Format, validate, escape/unescape, and minify HTML',
  //   href: '/html',
  //   icon: '</>'
  // },
  {
    title: 'Base64',
    description: 'Encode and decode Base64 strings',
    href: '/base64',
    icon: '64'
  },
  {
    title: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and human-readable dates',
    href: '/timestamp',
    icon: '⏰'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Developer Utils
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Simple, fast, and free developer tools for everyday use
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {utilities.map((utility) => (
              <Link
                key={utility.href}
                href={utility.href}
                className="relative group rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{utility.icon}</span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {utility.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                    {utility.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
