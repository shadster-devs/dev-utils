'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import {
  ClipboardIcon,
  CheckIcon,
  ArrowPathRoundedSquareIcon,
  CodeBracketIcon,
  DocumentMagnifyingGlassIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import prettier from 'prettier/standalone';
import htmlParser from 'prettier/parser-html';

// Ensure Prism is loaded
if (typeof window !== 'undefined') {
  require('prismjs');
}

// Simple HTML minification function
const minifyHTML = (html: string): string => {
  return html
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/^\s+|\s+$/g, ''); // Trim start and end
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Operation = 'format' | 'minify' | 'validate';

export function HtmlTools() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<Operation>('format');
  const [highlightedOutput, setHighlightedOutput] = useState('');

  useEffect(() => {
    if (output && !error && currentOperation !== 'validate') {
      try {
        // Simple HTML escaping for safety
        const escaped = output
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');

        setHighlightedOutput(escaped);
      } catch (err) {
        console.error('Highlighting error:', err);
        setHighlightedOutput(output);
      }
    }
  }, [output, error, currentOperation]);

  const handleFormat = async () => {
    try {
      const formatted = await prettier.format(input, {
        parser: 'html',
        plugins: [htmlParser],
        printWidth: 80,
      });
      setOutput(formatted);
      setError('');
      setCurrentOperation('format');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid HTML');
      }
      setOutput('');
    }
  };

  const handleMinify = async () => {
    try {
      const minified = minifyHTML(input);
      setOutput(minified);
      setError('');
      setCurrentOperation('minify');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid HTML');
      }
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      const errors = Array.from(doc.querySelectorAll('parsererror'));
      
      if (errors.length > 0) {
        throw new Error(errors[0].textContent || 'Invalid HTML');
      }
      
      setOutput('✓ Valid HTML');
      setError('');
      setCurrentOperation('validate');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid HTML');
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
            placeholder="Paste your HTML here..."
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
            ) : currentOperation === 'validate' ? (
              <div className="p-4 text-green-500 dark:text-green-400">{output}</div>
            ) : (
              <div className="p-4">
                {output ? (
                  <pre className="font-mono text-sm">
                    <code
                      className="language-markup"
                      dangerouslySetInnerHTML={{ __html: highlightedOutput }}
                    />
                  </pre>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    Output will appear here...
                  </div>
                )}
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
