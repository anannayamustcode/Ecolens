"use client";

import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';

interface UrlInputProps {
  onSubmit?: (url: string) => void;
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValidUrl = validateUrl(url);
    setIsValid(isValidUrl);
    
    if (isValidUrl && onSubmit) {
      onSubmit(url);
    }
  };

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div className="w-full max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Paste product URL (Amazon, Flipkart, etc.)"
            className={`w-full pl-10 pr-4 py-2 border ${isValid ? 'border-green-300' : 'border-red-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setIsValid(true);
            }}
          />
        </div>
        {!isValid && (
          <p className="mt-1 text-sm text-red-500">Please enter a valid URL</p>
        )}
      </div>
      <button
        type="submit"
        disabled={!url.trim()}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Search
      </button>
    </form>
  );
}