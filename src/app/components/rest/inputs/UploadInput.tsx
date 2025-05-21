// "use client";

// import { ChangeEvent, useState } from 'react';
// import { Upload } from 'lucide-react';

// interface UploadInputProps {
//   onFileSelected?: (file: File) => void;
// }

// export default function UploadInput({ onFileSelected }: UploadInputProps) {
//   const [fileSelected, setFileSelected] = useState(false);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFileSelected(true);
//       if (onFileSelected) {
//         onFileSelected(e.target.files[0]);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <label className="w-full max-w-lg flex flex-col items-center px-4 py-6 bg-green-50 text-green-700 rounded-lg shadow-lg tracking-wide border border-green-300 cursor-pointer hover:bg-green-100">
//         <Upload className="w-8 h-8" />
//         <span className="mt-2 text-base">{fileSelected ? 'File selected' : 'Select a product image'}</span>
//         <input type='file' className="hidden" onChange={handleFileChange} />
//       </label>
//     </div>
//   );
// }

"use client";

import { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface UploadInputProps {
  onFileSelected?: (file: File) => void;
}

export default function UploadInput({ onFileSelected }: UploadInputProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="w-full max-w-lg flex flex-col items-center px-4 py-6 bg-green-50 text-green-700 rounded-lg shadow-lg tracking-wide border border-green-300 cursor-pointer hover:bg-green-100 transition-colors">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-base">Select a product image</span>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">
        Supports JPG, PNG, or WEBP (max 5MB)
      </p>
    </div>
  );
}