"use client";

import { FormEvent, useState } from 'react';
import { Barcode, Camera } from 'lucide-react';

interface BarcodeInputProps {
  onSubmit?: (barcode: string) => void;
  onScanRequest?: () => void;
}

export default function BarcodeInput({ 
  onSubmit, 
  onScanRequest 
}: BarcodeInputProps) {
  const [barcode, setBarcode] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValidBarcode = validateBarcode(barcode);
    setIsValid(isValidBarcode);
    
    if (isValidBarcode && onSubmit) {
      onSubmit(barcode);
    }
  };

  const validateBarcode = (code: string) => {
    // Basic validation - at least 8 digits
    return /^\d{8,}$/.test(code);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter barcode number (8+ digits)"
          className={`w-full px-4 py-2 border ${isValid ? 'border-green-300' : 'border-red-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
          value={barcode}
          onChange={(e) => {
            setBarcode(e.target.value);
            setIsValid(true);
          }}
          inputMode="numeric"
        />
        {!isValid && (
          <p className="mt-1 text-sm text-red-500">
            Please enter a valid barcode (minimum 8 digits)
          </p>
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          type="submit"
          disabled={!barcode.trim()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Search
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-green-100 text-green-800 border border-green-300 rounded-lg hover:bg-green-200 transition flex items-center"
          onClick={onScanRequest}
        >
          <Camera size={18} className="mr-2" />
          Scan Barcode
        </button>
      </div>
    </form>
  );
}