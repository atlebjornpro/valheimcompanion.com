'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type SearchResult = {
  slug: string;
  title: string;
  description: string;
};

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const indexRequestedRef = useRef(false);
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
    if (!isOpen || indexRequestedRef.current) return;
    indexRequestedRef.current = true;

    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => setIndex(data))
      .catch((err) => {
        indexRequestedRef.current = false;
        console.error('Failed to load search index', err);
      });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return index.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, index]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(slug);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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
              {results.length === 0 && query && (
                <p className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found for &quot;{query}&quot;
                </p>
              )}

              {results.length === 0 && !query && (
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
