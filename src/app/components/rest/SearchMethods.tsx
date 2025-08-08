"use client";

import { useState } from "react";
import { Upload, Barcode, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const UploadInput = dynamic(() => import("./inputs/UploadInput"), {
  ssr: false,
});
const UrlInput = dynamic(() => import("./inputs/UrlInput"), { ssr: false });
const BarcodeInput = dynamic(() => import("./inputs/BarcodeInput"), {
  ssr: false,
});
type InputType = "upload" | "url" | "barcode";

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
     
      <h3 className="text-xl font-semibold text-green-700 mb-6 text-center">
        How would you like to search?
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { type: "upload", icon: Upload, label: "Upload Image" },
          { type: "url", icon: Search, label: "Product URL" },
          { type: "barcode", icon: Barcode, label: "Barcode" },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleInputSelection(type as InputType)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
              activeInput === type
                ? "bg-green-100 border-2 border-green-500"
                : "bg-gray-50 hover:bg-green-50 border-2 border-transparent"
            }`}
          >
            <Icon size={36} className="text-green-600 mb-2" />
            <span className="text-sm text-black font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[200px] mb-10">
        {activeInput === "upload" && <UploadInput />}
        {activeInput === "url" && <UrlInput />}
        {activeInput === "barcode" && <BarcodeInput />}
      </div>

      {/* ✅ Button layout - not absolute */}
      <div className="flex justify-between items-start px-2">
        {/* Left: EcoScore */}
        <Link href="/dashboard">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
          Get EcoScore
        </button>
        </Link>
        

        {/* Right: Recyclable, Non-Recyclable, Compare */}
        <div className="flex flex-col items-end space-y-2">
          {/* <Link href="/recyclable">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
              Recyclable
            </button>
          </Link> */}

          {/* <Link href="/non_recyclable">
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer">
              Non-Recyclable
            </button>
          </Link> */}
        </div>
        
      </div>
      {/* <div>
        <button className="text-black">press</button>
      </div> */}
    </div>
  );

  // return (
  //   <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-12">
  //     <h3 className="text-xl font-semibold text-green-700 mb-6 text-center">
  //       How would you like to search?
  //     </h3>

  //     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
  //       {[
  //         { type: "upload", icon: Upload, label: "Upload Image" },
  //         { type: "url", icon: Search, label: "Product URL" },
  //         { type: "barcode", icon: Barcode, label: "Barcode" },
  //       ].map(({ type, icon: Icon, label }) => (
  //         <button
  //           key={type}
  //           onClick={() => handleInputSelection(type as InputType)}
  //           className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
  //             activeInput === type
  //               ? "bg-green-100 border-2 border-green-500"
  //               : "bg-gray-50 hover:bg-green-50 border-2 border-transparent"
  //           }`}
  //         >
  //           <Icon size={36} className="text-green-600 mb-2" />
  //           <span className="text-sm text-black font-medium">{label}</span>
  //         </button>
  //       ))}
  //     </div>

  //     <div className="min-h-[200px]">
  //       {activeInput === "upload" && <UploadInput />}
  //       {activeInput === "url" && <UrlInput />}
  //       {activeInput === "barcode" && <BarcodeInput />}
  //     </div>

  //     <div className=" flex relative w-full min-h-fit pt-5">
  //       {/* Bottom-left EcoScore */}
  //       <div className="absolute bottom-4 left-4">
  //         <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
  //           Get EcoScore
  //         </button>
  //       </div>

  //       {/* Bottom-right: Recyclable, Non-Recyclable, Compare */}
  //       <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
  //         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  //           Recyclable
  //         </button>
  //         <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  //           Non-Recyclable
  //         </button>
  //         <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
  //           Compare
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}

// 'use client';

// import { useState } from 'react';
// import { Camera, Upload, Barcode, Search } from 'lucide-react';
// import dynamic from 'next/dynamic';

// const UploadInput = dynamic(() => import('./inputs/UploadInput'), { ssr: false });
// const CameraInput = dynamic(() => import('./inputs/CameraInput'), {
//   ssr: false,
//   loading: () => <div className="p-4 text-center">Loading camera...</div>
// });
// const UrlInput = dynamic(() => import('./inputs/UrlInput'), { ssr: false });
// const BarcodeInput = dynamic(() => import('./inputs/BarcodeInput'), { ssr: false });

// type InputType = 'upload' | 'camera' | 'url' | 'barcode';

// interface SearchMethodsProps {
//   onSubmit: (method: InputType | null) => void;
// }

// export default function SearchMethods({ onSubmit }: SearchMethodsProps) {
//   const [activeInput, setActiveInput] = useState<InputType | null>(null);

//   const handleInputSelection = (inputType: InputType) => {
//     const newInput = activeInput === inputType ? null : inputType;
//     setActiveInput(newInput);
//     onSubmit(newInput);
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
//         {activeInput === 'upload' && <UploadInput/>}
//         {activeInput === 'camera' && <CameraInput onCapture={() => {}} />}
//         {activeInput === 'url' && <UrlInput/>}
//         {activeInput === 'barcode' && <BarcodeInput/>}
//       </div>
//     </div>
//   );
// }
