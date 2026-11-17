'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type SearchResult = {
  slug: string;
  title: string;
  description: string;
};

type IndexStatus = 'idle' | 'loading' | 'ready' | 'error';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchResult[]>([]);
  const [indexStatus, setIndexStatus] = useState<IndexStatus>('idle');
  const [requestAttempt, setRequestAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const indexLoadedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Keyboard shortcut (Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen || indexLoadedRef.current) return;

    const controller = new AbortController();
    setIndexStatus('loading');

    async function loadIndex() {
      try {
        const response = await fetch('/search-index.json', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Search index request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Search index response was not an array');
        }

        setIndex(data as SearchResult[]);
        indexLoadedRef.current = true;
        setIndexStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to load search index', error);
        setIndexStatus('error');
      }
    }

    void loadIndex();
    return () => controller.abort();
  }, [isOpen, requestAttempt]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query || indexStatus !== 'ready') return [];
    const lowerQuery = query.toLowerCase();
    return index.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, index, indexStatus]);

  const retryIndex = useCallback(() => {
    setRequestAttempt((attempt) => attempt + 1);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(slug);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 w-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="">Search...</span>
        <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400"
                placeholder="Search documentation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {indexStatus === 'loading' && (
                <p className="px-4 py-8 text-center text-sm text-gray-500" role="status">
                  Loading search…
                </p>
              )}

              {indexStatus === 'error' && (
                <div className="px-4 py-8 text-center text-sm text-gray-500" role="alert">
                  <p>Search could not be loaded.</p>
                  <button
                    type="button"
                    className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    onClick={retryIndex}
                  >
                    Try again
                  </button>
                </div>
              )}

              {indexStatus === 'ready' && results.length === 0 && query && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found for &quot;{query}&quot;
                </p>
              )}

              {indexStatus === 'ready' && results.length === 0 && !query && (
                 <p className="px-4 py-8 text-center text-sm text-gray-500">
                  Type to search...
                </p>
              )}

              {results.map((result) => (
                <div
                  key={result.slug}
                  onClick={() => handleSelect(result.slug)}
                  className="mx-2 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {result.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
