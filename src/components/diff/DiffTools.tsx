'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import {
  ClipboardIcon,
  CheckIcon,
  ArrowPathRoundedSquareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { diffLines, diffJson } from 'diff';
import { format as prettierFormat } from 'prettier';
import parserHtml from 'prettier/parser-html';
import parserBabel from 'prettier/parser-babel';

// Import ReactDiffViewer dynamically to avoid SSR issues
const ReactDiffViewer = dynamic(() => import('react-diff-viewer'), { ssr: false });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type DiffFormat = 'text' | 'json' | 'html';

export function DiffTools() {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffResult, setDiffResult] = useState<string>('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [currentFormat, setCurrentFormat] = useState<DiffFormat>('text');

  const formatCode = async (code: string, format: DiffFormat) => {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(JSON.parse(code), null, 2);
        case 'html':
          return prettierFormat(code, {
            parser: 'html',
            plugins: [parserHtml],
          });
        case 'text':
        default:
          return code;
      }
    } catch (err) {
      throw new Error('Invalid format');
    }
  };

  const handleCompare = async () => {
    try {
      let formattedLeft = leftInput;
      let formattedRight = rightInput;

      // Format the inputs based on the current format
      try {
        formattedLeft = await formatCode(leftInput, currentFormat);
        formattedRight = await formatCode(rightInput, currentFormat);
      } catch (err) {
        setError(`Invalid ${currentFormat.toUpperCase()} format`);
        return;
      }

      // Perform the diff based on the format
      let differences;
      if (currentFormat === 'json') {
        differences = diffJson(formattedLeft, formattedRight);
      } else {
        differences = diffLines(formattedLeft, formattedRight);
      }

      setError('');
      setDiffResult(differences.map(part => part.value).join(''));
    } catch (err) {
      setError('Error comparing inputs');
      setDiffResult('');
    }
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

  const handleSwap = () => {
    const temp = leftInput;
    setLeftInput(rightInput);
    setRightInput(temp);
  };

  return (
    <div className="space-y-4">
      <Tab.Group onChange={(index) => setCurrentFormat(['text', 'json', 'html'][index] as DiffFormat)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 p-1">
          {['Text', 'JSON', 'HTML'].map((format) => (
            <Tab
              key={format}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                )
              }
            >
              {format}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Original Text
          </label>
          <div className="relative">
            <textarea
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              className="w-full h-64 p-4 text-sm font-mono border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-colors duration-200"
              placeholder={`Enter ${currentFormat.toUpperCase()} content...`}
            />
            {leftInput && (
              <button
                onClick={() => copyToClipboard(leftInput, 'left')}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {copied === 'left' ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Text
          </label>
          <div className="relative">
            <textarea
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              className="w-full h-64 p-4 text-sm font-mono border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-colors duration-200"
              placeholder={`Enter ${currentFormat.toUpperCase()} content to compare...`}
            />
            {rightInput && (
              <button
                onClick={() => copyToClipboard(rightInput, 'right')}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {copied === 'right' ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCompare}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-2" />
          Compare
        </button>
        <button
          onClick={handleSwap}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
          Swap Sides
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Diff Result */}
      {diffResult && (
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-full">
            <div className="w-full">
              <ReactDiffViewer
                oldValue={leftInput}
                newValue={rightInput}
                splitView={true}
                useDarkTheme={document.documentElement.classList.contains('dark')}
                styles={{
                  variables: {
                    light: {
                      diffViewerBackground: '#ffffff',
                      diffViewerColor: '#212121',
                      addedBackground: '#e6ffed',
                      addedColor: '#24292e',
                      removedBackground: '#ffeef0',
                      removedColor: '#24292e',
                      wordAddedBackground: '#acf2bd',
                      wordRemovedBackground: '#fdb8c0',
                    },
                    dark: {
                      diffViewerBackground: '#1f2937',
                      diffViewerColor: '#ffffff',
                      addedBackground: '#2ea04326',
                      addedColor: '#ffffff',
                      removedBackground: '#f8514926',
                      removedColor: '#ffffff',
                      wordAddedBackground: '#2ea04359',
                      wordRemovedBackground: '#f8514959',
                    },
                  },
                  diffContainer: {
                    width: '100%',
                  },
                  content: {
                    width: '47%%',
                    maxWidth: '47%',
                    minWidth: '47%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  },
                  contentText: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  },
                  line: {
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  },
                
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
