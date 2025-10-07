'use client';

import { useState } from 'react';
import { useOnaceCategories } from '../hooks/useOnaceCategories';

interface OnaceSelectorProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
  className?: string;
}

export default function OnaceSelector({ selectedCode, onCodeChange, className = '' }: OnaceSelectorProps) {
  const { categories, loading, getCategoryName } = useOnaceCategories();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find(cat => cat.code === selectedCode);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400">
          Loading industries...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedCategory ? getCategoryName(selectedCode, 'english') : 'Select Industry'}
            </div>
            {selectedCategory && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getCategoryName(selectedCode, 'german')}
              </div>
            )}
            {!selectedCategory && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Choose your business sector for relevant content
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <span className="px-2 py-1 text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                {selectedCode}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <strong>ÖNACE Classification:</strong> Select your industry to filter documents and get sector-specific regulations. 
              Choose "General" to see all documents.
            </div>
          </div>
          {categories.map((category) => (
            <button
              key={category.code}
              type="button"
              onClick={() => {
                onCodeChange(category.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedCode === category.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.name_english}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.name_german}
                  </div>
                  {category.description && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {category.description}
                    </div>
                  )}
                </div>
                <div className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {category.code}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
