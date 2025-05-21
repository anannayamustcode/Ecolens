// "use client";

// import { useState, useRef, useEffect } from 'react';
// import { Camera, Loader2 } from 'lucide-react';

// interface CameraInputProps {
//   onCapture?: (imageData: string) => void;
// }

// export default function CameraInput({ onCapture }: CameraInputProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCameraSupported, setIsCameraSupported] = useState(true);

//   // Check if camera is supported
//   useEffect(() => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setIsCameraSupported(false);
//       setError('Camera access is not supported in your browser');
//     }
//   }, []);

//   const startCamera = async () => {
//     if (!isCameraSupported) return;

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // First try with preferred constraints
//       const constraints = { 
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: 'environment' // Prefer rear camera
//         },
//         audio: false
//       };
      
//       const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current?.play().catch(err => {
//             setError('Could not play video stream');
//             console.error('Video play error:', err);
//           });
//         };
//       }
//       setStream(mediaStream);
//     } catch (err) {
//       console.error('Camera error (primary):', err);
      
//       // Try fallback constraints if first attempt fails
//       try {
//         const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
//           video: true, // Most permissive constraint
//           audio: false 
//         });
        
//         if (videoRef.current) {
//           videoRef.current.srcObject = fallbackStream;
//           videoRef.current.play();
//         }
//         setStream(fallbackStream);
//       } catch (fallbackErr) {
//         console.error('Camera error (fallback):', fallbackErr);
//         setError('Could not access camera. Please check permissions and try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

// const captureImage = async () => {
//   if (!videoRef.current || !stream) return;

//   const canvas = document.createElement('canvas');
//   canvas.width = videoRef.current.videoWidth;
//   canvas.height = videoRef.current.videoHeight;
//   const ctx = canvas.getContext('2d');

//   if (ctx) {
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;

//       const formData = new FormData();
//       formData.append('image', blob, 'captured-image.jpg');

//       try {
//         const res = await fetch('http://localhost:5000/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         const data = await res.json();
//         console.log('Uploaded image URL:', data.fileUrl);

//         // Optional: Pass the uploaded image URL to parent
//         onCapture?.(data.fileUrl);
//       } catch (err) {
//         console.error('Upload failed:', err);
//       }
//     }, 'image/jpeg', 0.8);
//   }
// };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-4">
//       {error ? (
//         <div className="w-full max-w-lg p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600 text-center">{error}</p>
//           {!isCameraSupported && (
//             <p className="text-sm text-red-500 mt-2">
//               Try using a modern browser like Chrome, Firefox, or Edge.
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="w-full max-w-lg h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
//           {isLoading ? (
//             <div className="w-full h-full flex flex-col items-center justify-center gap-2">
//               <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
//               <p className="text-sm text-gray-600">Accessing camera...</p>
//             </div>
//           ) : stream ? (
//             <video 
//               ref={videoRef} 
//               autoPlay 
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center gap-2">
//               <Camera className="w-12 h-12 text-gray-400" />
//               <p className="text-sm text-gray-500">Camera is off</p>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex gap-3">
//         {!stream ? (
//           <button
//             onClick={startCamera}
//             disabled={!isCameraSupported || isLoading}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Starting...
//               </>
//             ) : (
//               'Start Camera'
//             )}
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={captureImage}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Take Photo
//             </button>
//             <button
//               onClick={stopCamera}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//             >
//               Stop Camera
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface CameraInputProps {
  onCapture?: (imageUrl: string) => void;
}

export default function CameraInput({ onCapture }: CameraInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  useEffect(() => {
    // Check camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false);
      setError('Camera access is not supported in your browser');
      return;
    }

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    if (!isCameraSupported) return;

    setIsLoading(true);
    setError(null);

    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => console.log('Video playback started'))
            .catch(err => {
              setError('Could not play video stream');
              console.error('Video play error:', err);
            });
        };
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please check permissions and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      onCapture?.(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="w-full max-w-lg p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
          {!isCameraSupported && (
            <p className="text-sm text-red-500 mt-2">
              Try using a modern browser like Chrome, Firefox, or Edge.
            </p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <p className="text-sm text-gray-600">Accessing camera...</p>
            </div>
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Camera className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-500">Camera is off</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!stream ? (
          <button
            onClick={startCamera}
            disabled={!isCameraSupported || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              'Start Camera'
            )}
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Take Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
}