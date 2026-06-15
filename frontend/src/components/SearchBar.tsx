import React, { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  const handleClear = useCallback(() => {
    setValue('');
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-gray-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
