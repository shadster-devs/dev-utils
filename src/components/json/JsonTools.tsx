'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import {
  ClipboardIcon,
  CheckIcon,
  ArrowPathRoundedSquareIcon,
  CodeBracketIcon,
  DocumentMagnifyingGlassIcon,
  ArrowsPointingInIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

// Import ReactJson dynamically to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Operation = 'format' | 'minify' | 'validate' | 'escape' | 'unescape';

export function JsonTools() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [currentOperation, setCurrentOperation] = useState<Operation>('format');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setParsedJson(parsed);
      setError('');
      setCurrentOperation('format');
    } catch (err) {
      setError('Invalid JSON');
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setParsedJson(null);
      setError('');
      setCurrentOperation('minify');
    } catch (err) {
      setError('Invalid JSON');
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setOutput('✓ Valid JSON');
      setParsedJson(null);
      setError('');
      setCurrentOperation('validate');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid JSON');
      }
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleEscape = () => {
    setOutput(JSON.stringify(input));
    setParsedJson(null);
    setError('');
    setCurrentOperation('escape');
  };

  const handleUnescape = () => {
    try {
      const unescaped = JSON.parse(input);
      setOutput(typeof unescaped === 'string' ? unescaped : JSON.stringify(unescaped));
      setParsedJson(null);
      setError('');
      setCurrentOperation('unescape');
    } catch (err) {
      setError('Invalid escaped string');
      setOutput('');
      setParsedJson(null);
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
      setParsedJson(null);
    }
  };

  const actions = [
    { name: 'Format', action: handleFormat, icon: CodeBracketIcon },
    { name: 'Minify', action: handleMinify, icon: ArrowsPointingInIcon },
    { name: 'Validate', action: handleValidate, icon: DocumentMagnifyingGlassIcon },
    { name: 'Escape', action: handleEscape, icon: ArrowUturnRightIcon },
    { name: 'Unescape', action: handleUnescape, icon: ArrowUturnLeftIcon },
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
        </Tab.Group>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col min-h-0">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input
          </label>
          <textarea
            id="input"
            className="flex-1 w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setParsedJson(null);
            }}
            placeholder="Paste your JSON here..."
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
            ) : currentOperation === 'format' && parsedJson ? (
              <div className="p-4 h-full">
                <ReactJson
                  src={parsedJson}
                  theme={typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'twilight' : 'rjv-default'}
                  name={null}
                  collapsed={2}
                  displayDataTypes={false}
                  enableClipboard={true}
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
            ) : (
              <div className={classNames(
                'p-4 font-mono text-sm whitespace-pre-wrap',
                currentOperation === 'validate' ? 'text-green-500 dark:text-green-400' : 'text-gray-900 dark:text-white'
              )}>
                {output || 'Output will appear here...'}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
