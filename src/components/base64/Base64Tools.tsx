import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  ClipboardIcon,
  CheckIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Base64Tools is a React component that provides a user interface for encoding and decoding Base64 strings.
 * 
 * The component maintains several state variables:
 * - `input`: Stores the text to be encoded or the Base64 string to be decoded.
 * - `output`: Holds the result of the encoding or decoding operation.
 * - `error`: Contains any error message resulting from invalid input or failed operations.
 * - `copied`: Boolean indicating whether the output has been copied to the clipboard.
 * 
 * The component provides the following functionalities:
 * - Encode text to Base64 or decode a Base64 string based on the tab selection.
 * - Copy the output to the clipboard.
 * - Use the output as the new input for further operations.
 * 
 * It renders a user interface with input and output text areas, tabs for toggling modes,
 * and buttons for executing actions like encoding/decoding, copying, and reusing output.
 */
export function Base64Tools() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setOutput(btoa(input));
      setError('');
    } catch (err) {
      setError('Invalid input for Base64 encoding');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
      setError('');
    } catch (err) {
      setError('Invalid Base64 string');
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
      setOutput('');
    }
  };

  const actions = [
    { name: 'Encode', icon: ArrowUturnRightIcon, action: encode },
    { name: 'Decode', icon: ArrowUturnLeftIcon, action: decode },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col min-h-0">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input
          </label>
          <textarea
            id="input"
            className="flex-1 w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                encode();
              }
            }}
            placeholder="Enter text to encode/decode"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
            </label>
            <div className="flex space-x-2">
              {output && !error && (
                <button
                  onClick={useOutput}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  title="Use output as input"
                >
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                  <span className="ml-2">Use Output</span>
                </button>
              )}
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
            {error ? (
              <div className="p-4 text-red-500 dark:text-red-400">{error}</div>
            ) : (
              <div className="p-4 font-mono text-sm whitespace-pre-wrap">
                {output || <span className="text-gray-500 dark:text-gray-400">Output will appear here...</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
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
        </Tab.Group>
      </div>
    </div>
  );
}
