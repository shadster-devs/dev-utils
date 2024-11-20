'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { format } from 'sql-formatter';
import {
  ClipboardIcon,
  CheckIcon,
  CodeBracketIcon,
  DocumentMagnifyingGlassIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Operation = 'format' | 'minify' | 'validate';

export function SqlTools() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<Operation>('format');

  const handleFormat = () => {
    try {
      const formatted = format(input, {
        language: 'sql',
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
      setError('');
      setCurrentOperation('format');
    } catch (err) {
      setError('Error formatting SQL: ' + (err as Error).message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      // Remove extra whitespace and format on a single line
      const minified = format(input, {
        language: 'sql',
        linesBetweenQueries: 0,
        indentStyle: 'standard'
      }).replace(/\s+/g, ' ').trim();
      setOutput(minified);
      setError('');
      setCurrentOperation('minify');
    } catch (err) {
      setError('Error minifying SQL: ' + (err as Error).message);
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      // Attempt to format to validate syntax
      format(input, { language: 'sql' });
      setOutput('✓ Valid SQL syntax');
      setError('');
      setCurrentOperation('validate');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid SQL syntax');
      }
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const useOutput = () => {
    if (output && !error) {
      setInput(output);
    }
  };

  const actions = [
    { name: 'Format', action: handleFormat, icon: CodeBracketIcon },
    { name: 'Minify', action: handleMinify, icon: ArrowsPointingInIcon },
    { name: 'Validate', action: handleValidate, icon: DocumentMagnifyingGlassIcon },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mt-1">
        <Tab.Group>
          <Tab.List className="flex mb-5 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
            {actions.map((action) => (
              <Tab
                key={action.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    'flex items-center justify-center space-x-2',
                    selected
                      ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-white shadow'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-white'
                  )
                }
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                <span>{action.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <div className="space-y-4">
            <div className="w-full">
              <textarea
                className="w-full h-64 p-4 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your SQL query here..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-500 rounded-lg">
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              </div>
            )}

            {output && !error && (
              <div className="relative">
                <pre className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto">
                  <code className="text-sm text-gray-800 dark:text-gray-200">{output}</code>
                </pre>
                <div className="absolute top-3 right-3 space-x-2">
                  <button
                    onClick={useOutput}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Use as input"
                  >
                    <ArrowsPointingInIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}
