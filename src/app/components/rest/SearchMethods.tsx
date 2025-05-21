// // "use client";

// // import { useState } from 'react';
// // import { Camera, Upload, Barcode, Search } from 'lucide-react';
// // import UploadInput from './inputs/UploadInput';
// // import CameraInput from './inputs/CameraInput';
// // import UrlInput from './inputs/UrlInput';
// // import BarcodeInput from './inputs/BarcodeInput';

// // type InputType = 'upload' | 'camera' | 'url' | 'barcode' | null;

// // export default function SearchMethods() {
// //   const [activeInput, setActiveInput] = useState<InputType>(null);

// //   const handleInputSelection = (inputType: InputType) => {
// //     setActiveInput(inputType);
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-12">
// //       <h3 className="text-xl font-semibold text-green-700 mb-6 text-center">How would you like to search?</h3>
      
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //         <button 
// //           onClick={() => handleInputSelection('upload')}
// //           className={`flex flex-col items-center justify-center p-4 rounded-lg transition ${activeInput === 'upload' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-green-50'}`}
// //         >
// //           <Upload size={36} className="text-green-600 mb-2" />
// //           <span className="text-sm text-black font-medium">Upload Image</span>
// //         </button>
        
// //         <button 
// //           onClick={() => handleInputSelection('camera')}
// //           className={`flex flex-col items-center justify-center p-4 rounded-lg transition ${activeInput === 'camera' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-green-50'}`}
// //         >
// //           <Camera size={36} className="text-green-600 mb-2" />
// //           <span className="text-sm text-black font-medium">Use Camera</span>
// //         </button>
        
// //         <button 
// //           onClick={() => handleInputSelection('url')}
// //           className={`flex flex-col items-center justify-center p-4 rounded-lg transition ${activeInput === 'url' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-green-50'}`}
// //         >
// //           <Search size={36} className="text-green-600 mb-2" />
// //           <span className="text-sm text-black font-medium">Product URL</span>
// //         </button>
        
// //         <button 
// //           onClick={() => handleInputSelection('barcode')}
// //           className={`flex flex-col items-center justify-center p-4 rounded-lg transition ${activeInput === 'barcode' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 hover:bg-green-50'}`}
// //         >
// //           <Barcode size={36} className="text-green-600 mb-2" />
// //           <span className="text-sm text-black font-medium">Barcode</span>
// //         </button>
// //       </div>

// //       {activeInput === 'upload' && <UploadInput />}
// //       {activeInput === 'camera' && <CameraInput />}
// //       {activeInput === 'url' && <UrlInput />}
// //       {activeInput === 'barcode' && <BarcodeInput />}
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from 'react';
// import { Camera, Upload, Barcode, Search } from 'lucide-react';
// import dynamic from 'next/dynamic';

// // Dynamically import components with no SSR to avoid window undefined errors
// const UploadInput = dynamic(() => import('./inputs/UploadInput'), { ssr: false });
// const CameraInput = dynamic(() => import('./inputs/CameraInput'), { 
//   ssr: false,
//   loading: () => <div className="p-4 text-center">Loading camera...</div>
// });
// const UrlInput = dynamic(() => import('./inputs/UrlInput'), { ssr: false });
// const BarcodeInput = dynamic(() => import('./inputs/BarcodeInput'), { ssr: false });

// type InputType = 'upload' | 'camera' | 'url' | 'barcode';

// export default function SearchMethods() {
//   const [activeInput, setActiveInput] = useState<InputType | null>(null);

//   const handleInputSelection = (inputType: InputType) => {
//     setActiveInput(prev => prev === inputType ? null : inputType);
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-12">
//       <h3 className="text-xl font-semibold text-green-700 mb-6 text-center">How would you like to search?</h3>
      
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           { type: 'upload', icon: Upload, label: 'Upload Image' },
//           { type: 'camera', icon: Camera, label: 'Use Camera' },
//           { type: 'url', icon: Search, label: 'Product URL' },
//           { type: 'barcode', icon: Barcode, label: 'Barcode' },
//         ].map(({ type, icon: Icon, label }) => (
//           <button 
//             key={type}
//             onClick={() => handleInputSelection(type as InputType)}
//             className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
//               activeInput === type 
//                 ? 'bg-green-100 border-2 border-green-500' 
//                 : 'bg-gray-50 hover:bg-green-50 border-2 border-transparent'
//             }`}
//           >
//             <Icon size={36} className="text-green-600 mb-2" />
//             <span className="text-sm text-black font-medium">{label}</span>
//           </button>
//         ))}
//       </div>

//       <div className="min-h-[200px]">
//         {activeInput === 'upload' && <UploadInput />}
//         {activeInput === 'camera' && <CameraInput onCapture={(data) => console.log(data)} />}
//         {activeInput === 'url' && <UrlInput />}
//         {activeInput === 'barcode' && <BarcodeInput />}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Camera, Upload, Barcode, Search } from 'lucide-react';
import dynamic from 'next/dynamic';

const UploadInput = dynamic(() => import('./inputs/UploadInput'), { ssr: false });
const CameraInput = dynamic(() => import('./inputs/CameraInput'), { 
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading camera...</div>
});
const UrlInput = dynamic(() => import('./inputs/UrlInput'), { ssr: false });
const BarcodeInput = dynamic(() => import('./inputs/BarcodeInput'), { ssr: false });

type InputType = 'upload' | 'camera' | 'url' | 'barcode';

interface SearchMethodsProps {
  onSubmit: (method: InputType | null) => void;
}

export default function SearchMethods({ onSubmit }: SearchMethodsProps) {
  const [activeInput, setActiveInput] = useState<InputType | null>(null);

  const handleInputSelection = (inputType: InputType) => {
    const newInput = activeInput === inputType ? null : inputType;
    setActiveInput(newInput);
    onSubmit(newInput);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-12">
      <h3 className="text-xl font-semibold text-green-700 mb-6 text-center">How would you like to search?</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { type: 'upload', icon: Upload, label: 'Upload Image' },
          { type: 'camera', icon: Camera, label: 'Use Camera' },
          { type: 'url', icon: Search, label: 'Product URL' },
          { type: 'barcode', icon: Barcode, label: 'Barcode' },
        ].map(({ type, icon: Icon, label }) => (
          <button 
            key={type}
            onClick={() => handleInputSelection(type as InputType)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
              activeInput === type 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-gray-50 hover:bg-green-50 border-2 border-transparent'
            }`}
          >
            <Icon size={36} className="text-green-600 mb-2" />
            <span className="text-sm text-black font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeInput === 'upload' && <UploadInput />}
        {activeInput === 'camera' && <CameraInput onCapture={() => {}} />}
        {activeInput === 'url' && <UrlInput />}
        {activeInput === 'barcode' && <BarcodeInput />}
      </div>
    </div>
  );
}