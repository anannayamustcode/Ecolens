"use client";

import { ChangeEvent, useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import dynamic from 'next/dynamic';

const CameraInput = dynamic(() => import('./CameraInput'), { 
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading camera...</div>
});

interface UploadInputProps {
  onUploadComplete?: (fileUrl: string) => void;
}

export default function UploadInput({ onUploadComplete }: UploadInputProps) {
  const [activeSide, setActiveSide] = useState<'front' | 'back' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File | Blob) => {
    try {
      const formData = new FormData();
      formData.append('image', file, 'product-image.jpg');

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      onUploadComplete?.(data.fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleBoxClick = (side: 'front' | 'back') => {
    setActiveSide(side);
  };

  const handleCloseCamera = () => {
    setActiveSide(null);
  };

  const handleImageCapture = async (imageUrl: string) => {
    // Convert data URL to blob
    const blob = await fetch(imageUrl).then(res => res.blob());
    await uploadFile(blob);
    handleCloseCamera();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {activeSide ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Capture {activeSide} image</h3>
            <button 
              onClick={handleCloseCamera}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <CameraInput onCapture={handleImageCapture} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            {['front', 'back'].map((side) => (
              <div 
                key={side}
                onClick={() => handleBoxClick(side as 'front' | 'back')}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-700 font-medium capitalize">{side}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">Upload a clear picture</p>
          
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Or select from files
          </button>
        </>
      )}
    </div>
  );
}
// "use client";

// import { ChangeEvent, useState, useRef } from 'react';
// import { Upload, Camera } from 'lucide-react';
// import dynamic from 'next/dynamic';

// const CameraInput = dynamic(() => import('./CameraInput'), { 
//   ssr: false,
//   loading: () => <div className="p-4 text-center">Loading camera...</div>
// });

// interface UploadInputProps {
//   onFileSelected?: (file: File) => void;
//   onCapture?: (imageUrl: string) => void;
// }

// export default function UploadInput({ onFileSelected, onCapture }: UploadInputProps) {
//   const [activeSide, setActiveSide] = useState<'front' | 'back' | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       onFileSelected?.(file);
//     }
//   };

//   const handleBoxClick = (side: 'front' | 'back') => {
//     setActiveSide(side);
//   };

//   const handleCloseCamera = () => {
//     setActiveSide(null);
//   };

//   const handleImageCapture = (imageUrl: string) => {
//     onCapture?.(imageUrl);
//     handleCloseCamera();
//   };

//   return (
//     <div className="flex flex-col items-center w-full">
//       {activeSide ? (
//         <div className="w-full">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Capture {activeSide} image</h3>
//             <button 
//               onClick={handleCloseCamera}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               &times;
//             </button>
//           </div>
//           <CameraInput onCapture={handleImageCapture} />
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-2 gap-4 w-full mb-4">
//             {['front', 'back'].map((side) => (
//               <div 
//                 key={side}
//                 onClick={() => handleBoxClick(side as 'front' | 'back')}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col items-center">
//                   <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                   <Camera className="w-8 h-8 text-gray-400 mb-2" />
//                   <span className="text-gray-700 font-medium capitalize">{side}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <p className="text-sm text-gray-500 mb-4">Upload a clear picture</p>
          
//           <input 
//             ref={fileInputRef}
//             type="file" 
//             className="hidden" 
//             onChange={handleFileChange}
//             accept="image/*"
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             Or select from files
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// // "use client";

// // import { ChangeEvent, useState, useRef } from 'react';
// // import { Upload, Camera } from 'lucide-react';
// // import dynamic from 'next/dynamic';

// // const CameraInput = dynamic(() => import('./CameraInput'), { 
// //   ssr: false,
// //   loading: () => <div className="p-4 text-center">Loading camera...</div>
// // });

// // interface UploadInputProps {
// //   onFileSelected?: (file: File) => void;
// //   onCapture?: (imageUrl: string) => void;
// // }

// // export default function UploadInput({ onFileSelected, onCapture }: UploadInputProps) {
// //   const [activeSide, setActiveSide] = useState<'front' | 'back' | null>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files.length > 0) {
// //       const file = e.target.files[0];
// //       if (onFileSelected) {
// //         onFileSelected(file);
// //       }
// //     }
// //   };

// //   const handleBoxClick = (side: 'front' | 'back') => {
// //     setActiveSide(side);
// //   };

// //   const handleCloseCamera = () => {
// //     setActiveSide(null);
// //   };

// //   return (
// //     <div className="flex flex-col items-center w-full">
// //       {activeSide ? (
// //         <div className="w-full">
// //           <div className="flex justify-between items-center mb-4">
// //             <h3 className="text-lg font-medium">Capture {activeSide} image</h3>
// //             <button 
// //               onClick={handleCloseCamera}
// //               className="text-gray-500 hover:text-gray-700"
// //             >
// //               &times;
// //             </button>
// //           </div>
// //           <CameraInput 
// //             onCapture={(imageUrl) => {
// //               onCapture?.(imageUrl);
// //               handleCloseCamera();
// //             }} 
// //           />
// //         </div>
// //       ) : (
// //         <>
// //           <div className="grid grid-cols-2 gap-4 w-full mb-4">
// //             {['front', 'back'].map((side) => (
// //               <div 
// //                 key={side}
// //                 onClick={() => handleBoxClick(side as 'front' | 'back')}
// //                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
// //               >
// //                 <div className="flex flex-col items-center">
// //                   <Upload className="w-8 h-8 text-gray-400 mb-2" />
// //                   <Camera className="w-8 h-8 text-gray-400 mb-2" />
// //                   <span className="text-gray-700 font-medium capitalize">{side}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <p className="text-sm text-gray-500 mb-4">Upload a clear picture</p>
          
// //           <input 
// //             ref={fileInputRef}
// //             type="file" 
// //             className="hidden" 
// //             onChange={handleFileChange}
// //             accept="image/*"
// //           />
// //           <button
// //             onClick={() => fileInputRef.current?.click()}
// //             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
// //           >
// //             Or select from files
// //           </button>
// //         </>
// //       )}
// //     </div>
// //   );
// // }