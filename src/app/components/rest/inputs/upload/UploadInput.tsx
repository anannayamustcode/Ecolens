// src\app\components\rest\inputs\upload\UploadInput.tsx

"use client";

import { ChangeEvent, useState, useRef } from "react";
import { Upload, Camera, X, Check } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CameraInput = dynamic(() => import("../CameraInput"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading camera...</div>,
});

interface UploadInputProps {
  onComplete?: (images: { front?: string; back?: string }) => void;
  uploadEndpoint?: 1 | 2 | 3; // New prop to determine which endpoint to use
}

export default function UploadInput({ onComplete, uploadEndpoint = 1 }: UploadInputProps) {
    console.log('UploadInput received uploadEndpoint:', uploadEndpoint); // Add this line
  const router = useRouter();
  const [activeSide, setActiveSide] = useState<"front" | "back" | null>(null);
  const [images, setImages] = useState<{ front?: string; back?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to get the correct upload URL based on uploadEndpoint prop
  const getUploadUrl = () => {
    switch (uploadEndpoint) {
      case 1:
        return "http://localhost:5000/upload";
      case 2:
        return "http://localhost:5000/upload-product1";
      case 3:
        return "http://localhost:5000/upload-product2";
      default:
        return "http://localhost:5000/upload";
    }
  };

  // Function to get folder name for dashboard redirect
  const getFolderName = () => {
    switch (uploadEndpoint) {
      case 1:
        return "uploads";
      case 2:
        return "upload-product1";
      case 3:
        return "upload-product2";
      default:
        return "uploads";
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeSide) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [activeSide]: imageUrl }));
      setActiveSide(null);
    }
  };

  const handleBoxClick = (side: "front" | "back") => {
    setActiveSide(side);
  };

  const handleCloseCamera = () => {
    setActiveSide(null);
  };

  const handleImageCapture = (imageUrl: string) => {
    if (activeSide) {
      setImages((prev) => ({ ...prev, [activeSide]: imageUrl }));
      setActiveSide(null);
    }
  };

  const removeImage = (side: "front" | "back") => {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[side];
      return newImages;
    });
  };

  const submitImages = async () => {
    if (Object.keys(images).length === 0) return;

    setIsSubmitting(true);

    try {
      const uploadedUrls: { front?: string; back?: string } = {};
      const uploadUrl = getUploadUrl(); // Get the correct upload URL

      console.log(`Starting image upload process to ${uploadUrl}...`);

      // Upload each image to the backend
      for (const [side, imageUrl] of Object.entries(images)) {
        console.log(`Processing ${side} image...`);
        
        let blob;
        if (imageUrl.startsWith('data:')) {
          console.log('Converting data URL to blob...');
          const res = await fetch(imageUrl);
          blob = await res.blob();
        } else {
          console.log('Getting blob from file URL...');
          const response = await fetch(imageUrl);
          blob = await response.blob();
        }

        const formData = new FormData();
        formData.append("image", blob, `${side}-image.jpg`);
        formData.append("packaging_type", selectedPackaging);

        console.log(`Uploading to ${uploadUrl}...`);
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        console.log('Upload response status:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Upload failed with details:', errorData);
          throw new Error(`Upload failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log('Upload successful, response:', data);
        uploadedUrls[side as "front" | "back"] = data.fileUrl;
      }

      console.log('All images uploaded, getting eco-score...');
      const ecoScoreResponse = await fetch("http://localhost:5000/api/get-eco-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: "Uploaded Product",
          packaging_type: selectedPackaging,
        }),
      });

      console.log('Eco-score response status:', ecoScoreResponse.status);
      
      if (!ecoScoreResponse.ok) {
        const errorData = await ecoScoreResponse.json().catch(() => ({}));
        console.error('Eco-score fetch failed with details:', errorData);
        throw new Error("Failed to get eco-score");
      }

      const ecoScoreData = await ecoScoreResponse.json();
      console.log('Eco-score data received:', ecoScoreData);

      onComplete?.(uploadedUrls);

      console.log('Redirecting to dashboard with:', {
        front: uploadedUrls.front,
        back: uploadedUrls.back,
        ecoScoreData,
        folder: getFolderName()
      });
      
      // Include folder information in the redirect
      router.push(`/dashboard?front=${uploadedUrls.front}&back=${uploadedUrls.back}&folder=${getFolderName()}`);
    } catch (error) {
      console.error("Upload failed:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Display which endpoint is being used (for debugging/info) */}
      <div className="mb-2 text-xs text-gray-500">
        Upload destination: {getFolderName()} (Endpoint {uploadEndpoint})
      </div>
      
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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload File Instead
          </button>
        </div>
      ) : (
        <>
          {/* Dropdown */}
          
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            {["front", "back"].map((side) => (
              <div
                key={side}
                onClick={() =>
                  !images[side as "front" | "back"] &&
                  handleBoxClick(side as "front" | "back")
                }
                className={`border-2 ${
                  images[side as "front" | "back"]
                    ? "border-solid border-green-500"
                    : "border-dashed border-gray-300"
                } rounded-lg p-4 flex flex-col items-center justify-center ${
                  !images[side as "front" | "back"]
                    ? "cursor-pointer hover:bg-gray-50"
                    : ""
                } transition-colors relative`}
              >
                {images[side as "front" | "back"] ? (
                  <>
                    <img
                      src={images[side as "front" | "back"]}
                      alt={`${side} view`}
                      className="w-full h-48 object-contain rounded-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(side as "front" | "back");
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-700 font-medium capitalize">
                      {side}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Upload clear pictures of front and back
          </p>

          {Object.keys(images).length > 0 && (
            <button
              onClick={submitImages}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Submit Images
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// "use client";

// import { ChangeEvent, useState, useRef } from "react";
// import { Upload, Camera, X, Check } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";

// const CameraInput = dynamic(() => import("../CameraInput"), {
//   ssr: false,
//   loading: () => <div className="p-4 text-center">Loading camera...</div>,
// });

// interface UploadInputProps {
//   onComplete?: (images: { front?: string; back?: string }) => void;
// }

// export default function UploadInput({ onComplete }: UploadInputProps) {
//   const router = useRouter();
//   const [activeSide, setActiveSide] = useState<"front" | "back" | null>(null);
//   const [images, setImages] = useState<{ front?: string; back?: string }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // When upload is complete:
//   // const uploadedUrl = `http://localhost:5000/uploads/${filename}`;
//   // localStorage.setItem("lastUploadedImage", uploadedUrl);

//   const packagingOptions = [
//     "Plastic Bottle",
//     "Glass Bottle",
//     "Plastic Tube",
//     "Metal Can",
//     "Flexible Pouch",
//     "Pump Dispenser Bottle",
//     "Spray Bottle",
//     "Solid Stick Container",
//     "Single-use Sachet",
//     "Tetra Pak Carton",
//     "Dropper Bottle",
//     "Blister Pack (Pills/Tablets)",
//     "Cardboard Box",
//     "Metal Tin",
//     "Roll-on Applicator",
//     "Foam Dispenser",
//     "Glass Ampoule",
//     "Medical Vial",
//     "Plastic Canister",
//     "Refill Cartridge",
//   ];
//   const [selectedPackaging, setSelectedPackaging] = useState<string>("");

//   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0 && activeSide) {
//       const file = e.target.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setImages((prev) => ({ ...prev, [activeSide]: imageUrl }));
//       setActiveSide(null);
//     }
//   };

//   const handleBoxClick = (side: "front" | "back") => {
//     setActiveSide(side);
//   };

//   const handleCloseCamera = () => {
//     setActiveSide(null);
//   };

//   const handleImageCapture = (imageUrl: string) => {
//     if (activeSide) {
//       setImages((prev) => ({ ...prev, [activeSide]: imageUrl }));
//       setActiveSide(null);
//     }
//   };

//   const removeImage = (side: "front" | "back") => {
//     setImages((prev) => {
//       const newImages = { ...prev };
//       delete newImages[side];
//       return newImages;
//     });
//   };

// //   const submitImages = async () => {
// //     if (Object.keys(images).length === 0) return;

// //     setIsSubmitting(true);

// //     try {
// //       const uploadedUrls: { front?: string; back?: string } = {};

// //       for (const [side, imageUrl] of Object.entries(images)) {
// //         const blob = await fetch(imageUrl).then((res) => res.blob());
// //         const file = new File([blob], `${side}-image.jpg`, {
// //           type: "image/jpeg",
// //         });
// //         const formData = new FormData();
// //         formData.append("image", file);
// // //old
// //       //   const res = await fetch("http://localhost:5000/upload", {
// //       //     method: "POST",
// //       //     body: formData,
// //       //   });
// //       //   const data = await res.json();
// //       //   uploadedUrls[side as "front" | "back"] = data.fileUrl;
// //       // }
// // const res = await fetch("http://localhost:5000/upload", {
// //   method: "POST",
// //   body: formData,
// // });
// // const data = await res.json();

// // // ✅ Store EcoScore data from backend
// // uploadedUrls[side as "front" | "back"] = data.fileUrl;

// // // If EcoScore data present, keep it for dashboard
// // if (data.ecoScoreData) {
// //   localStorage.setItem("ecoScoreData", JSON.stringify(data.ecoScoreData));
// // }
// //       }
// //       onComplete?.(uploadedUrls);
// //       //TO PASS-VIA QUERY PARAMS
// //       const query = new URLSearchParams();

// //       if (uploadedUrls.front) query.append("front", uploadedUrls.front);
// //       if (uploadedUrls.back) query.append("back", uploadedUrls.back);

// //       router.push(`/dashboard?${query.toString()}`);
// // //old

// //       // router.push("/dashboard");

// //       // Save image URLs too
// // localStorage.setItem("uploadedImages", JSON.stringify(uploadedUrls));

// // router.push("/dashboard");

// //     } catch (error) {
// //       console.error("Upload failed:", error);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
// const submitImages = async () => {
//   if (Object.keys(images).length === 0) return;

//   setIsSubmitting(true);

//   try {
//     const uploadedUrls: { front?: string; back?: string } = {};

//     console.log('Starting image upload process...'); // Debug log

//     // Upload each image to the backend
//     for (const [side, imageUrl] of Object.entries(images)) {
//       console.log(`Processing ${side} image...`); // Debug log
      
//       let blob;
//       if (imageUrl.startsWith('data:')) {
//         console.log('Converting data URL to blob...'); // Debug log
//         const res = await fetch(imageUrl);
//         blob = await res.blob();
//       } else {
//         console.log('Getting blob from file URL...'); // Debug log
//         const response = await fetch(imageUrl);
//         blob = await response.blob();
//       }

//       const formData = new FormData();
//       formData.append("image", blob, `${side}-image.jpg`);
//       formData.append("packaging_type", selectedPackaging);

//       console.log('Uploading to backend...'); // Debug log
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       console.log('Upload response status:', res.status); // Debug log
      
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         console.error('Upload failed with details:', errorData); // Error log
//         throw new Error(`Upload failed with status ${res.status}`);
//       }

//       const data = await res.json();
//       console.log('Upload successful, response:', data); // Debug log
//       uploadedUrls[side as "front" | "back"] = data.fileUrl;
//     }

//     console.log('All images uploaded, getting eco-score...'); // Debug log
//     const ecoScoreResponse = await fetch("http://localhost:5000/api/get-eco-score", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         product_name: "Uploaded Product",
//         packaging_type: selectedPackaging,
//       }),
//     });

//     console.log('Eco-score response status:', ecoScoreResponse.status); // Debug log
    
//     if (!ecoScoreResponse.ok) {
//       const errorData = await ecoScoreResponse.json().catch(() => ({}));
//       console.error('Eco-score fetch failed with details:', errorData); // Error log
//       throw new Error("Failed to get eco-score");
//     }

//     const ecoScoreData = await ecoScoreResponse.json();
//     console.log('Eco-score data received:', ecoScoreData); // Debug log

//     onComplete?.(uploadedUrls);

//     console.log('Redirecting to dashboard with:', { // Debug log
//       front: uploadedUrls.front,
//       back: uploadedUrls.back,
//       ecoScoreData
//     });
    
//     router.push(`/dashboard?front=${uploadedUrls.front}&back=${uploadedUrls.back}`);
//   } catch (error) {
//     console.error("Upload failed:", error);
//     // You might want to show an error message to the user here
//   } finally {
//     setIsSubmitting(false);
//   }
// };
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
//           <input
//             ref={fileInputRef}
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//             accept="image/*"
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Upload File Instead
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Dropdown */}
//           <div className="w-full mb-4 text-gray-500">
//             <label
//               htmlFor="packaging-select"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Select Packaging Type
//             </label>
//             <select
//               id="packaging-select"
//               value={selectedPackaging}
//               onChange={(e) => setSelectedPackaging(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" disabled>
//                 Select an option
//               </option>
//               {packagingOptions.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4 w-full mb-4">
//             {["front", "back"].map((side) => (
//               <div
//                 key={side}
//                 onClick={() =>
//                   !images[side as "front" | "back"] &&
//                   handleBoxClick(side as "front" | "back")
//                 }
//                 className={`border-2 ${
//                   images[side as "front" | "back"]
//                     ? "border-solid border-green-500"
//                     : "border-dashed border-gray-300"
//                 } rounded-lg p-4 flex flex-col items-center justify-center ${
//                   !images[side as "front" | "back"]
//                     ? "cursor-pointer hover:bg-gray-50"
//                     : ""
//                 } transition-colors relative`}
//               >
//                 {images[side as "front" | "back"] ? (
//                   <>
//                     <img
//                       src={images[side as "front" | "back"]}
//                       alt={`${side} view`}
//                       className="w-full h-48 object-contain rounded-md"
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeImage(side as "front" | "back");
//                       }}
//                       className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                     >
//                       <X size={16} />
//                     </button>
//                   </>
//                 ) : (
//                   <div className="flex flex-col items-center">
//                     <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                     <Camera className="w-8 h-8 text-gray-400 mb-2" />
//                     <span className="text-gray-700 font-medium capitalize">
//                       {side}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <p className="text-sm text-gray-500 mb-4">
//             Upload clear pictures of front and back
//           </p>

//           {Object.keys(images).length > 0 && (
//             <button
//               onClick={submitImages}
//               disabled={isSubmitting}
//               className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 ${
//                 isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Check size={20} />
//                   Submit Images
//                 </>
//               )}
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // "use client";

// // import { ChangeEvent, useState, useRef } from 'react';
// // import { Upload, Camera, X, Check } from 'lucide-react';
// // import dynamic from 'next/dynamic';
// // import { useRouter } from 'next/navigation'; // Add this import

// // const CameraInput = dynamic(() => import('./CameraInput'), {
// //   ssr: false,
// //   loading: () => <div className="p-4 text-center">Loading camera...</div>
// // });

// // interface UploadInputProps {
// //   onComplete?: (images: { front?: string, back?: string }) => void;
// // }

// // export default function UploadInput({ onComplete }: UploadInputProps) {
// //   const router = useRouter(); // Initialize the router
// //   const [activeSide, setActiveSide] = useState<'front' | 'back' | null>(null);
// //   const [images, setImages] = useState<{ front?: string, back?: string }>({});
// //   const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files.length > 0 && activeSide) {
// //       const file = e.target.files[0];
// //       const imageUrl = URL.createObjectURL(file);
// //       setImages(prev => ({ ...prev, [activeSide]: imageUrl }));
// //       setActiveSide(null);
// //     }
// //   };

// //   const handleBoxClick = (side: 'front' | 'back') => {
// //     setActiveSide(side);
// //   };

// //   const handleCloseCamera = () => {
// //     setActiveSide(null);
// //   };

// //   // const handleImageCapture = (imageUrl: string) => {
// //   //   if (activeSide) {
// //   //     setImages(prev => ({ ...prev, [activeSide]: imageUrl }));
// //   //     setActiveSide(null);
// //   //   }
// //   // };
// // const handleImageCapture = (imageUrl: string) => {
// //   if (activeSide) {
// //     setImages(prev => ({ ...prev, [activeSide]: imageUrl }));
// //     setActiveSide(null); // This will unmount the CameraInput component
// //   }
// // };
// //   const removeImage = (side: 'front' | 'back') => {
// //     setImages(prev => {
// //       const newImages = { ...prev };
// //       delete newImages[side];
// //       return newImages;
// //     });
// //   };

// //   const submitImages = async () => {
// //     if (Object.keys(images).length === 0) return;

// //     setIsSubmitting(true); // Start loading

// //     try {
// //       const uploadedUrls: { front?: string, back?: string } = {};

// //       for (const [side, imageUrl] of Object.entries(images)) {
// //         if (imageUrl.startsWith('blob:')) {
// //           // For file uploads
// //           const response = await fetch(imageUrl);
// //           const blob = await response.blob();
// //           const file = new File([blob], `${side}-image.jpg`, { type: 'image/jpeg' });
// //           const formData = new FormData();
// //           formData.append('image', file);

// //           const res = await fetch('http://localhost:5000/upload', {
// //             method: 'POST',
// //             body: formData,
// //           });
// //           const data = await res.json();
// //           uploadedUrls[side as 'front' | 'back'] = data.fileUrl;
// //         } else {
// //           // For camera captures (already data URLs)
// //           const blob = await fetch(imageUrl).then(res => res.blob());
// //           const formData = new FormData();
// //           formData.append('image', blob, `${side}-image.jpg`);

// //           const res = await fetch('http://localhost:5000/upload', {
// //             method: 'POST',
// //             body: formData,
// //           });
// //           const data = await res.json();
// //           uploadedUrls[side as 'front' | 'back'] = data.fileUrl;
// //         }
// //       }

// //       onComplete?.(uploadedUrls);

// //       // Redirect to dashboard after successful upload
// //       router.push('/dashboard');
// //     } catch (error) {
// //       console.error('Upload failed:', error);
// //       // Handle error (you might want to show an error message)
// //     } finally {
// //       setIsSubmitting(false);
// //     }
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
// //           <CameraInput onCapture={handleImageCapture} />
// //           <input
// //             ref={fileInputRef}
// //             type="file"
// //             className="hidden"
// //             onChange={handleFileChange}
// //             accept="image/*"
// //           />
// //           <button
// //             onClick={() => fileInputRef.current?.click()}
// //             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             Upload File Instead
// //           </button>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="grid grid-cols-2 gap-4 w-full mb-4">
// //             {['front', 'back'].map((side) => (
// //               <div
// //                 key={side}
// //                 onClick={() => !images[side as 'front' | 'back'] && handleBoxClick(side as 'front' | 'back')}
// //                 className={`border-2 ${images[side as 'front' | 'back'] ? 'border-solid border-green-500' : 'border-dashed border-gray-300'} rounded-lg p-4 flex flex-col items-center justify-center ${!images[side as 'front' | 'back'] ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors relative`}
// //               >
// //                 {images[side as 'front' | 'back'] ? (
// //                   <>
// //                     <img
// //                       src={images[side as 'front' | 'back']}
// //                       alt={`${side} view`}
// //                       className="w-full h-48 object-contain rounded-md"
// //                     />
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         removeImage(side as 'front' | 'back');
// //                       }}
// //                       className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
// //                     >
// //                       <X size={16} />
// //                     </button>
// //                   </>
// //                 ) : (
// //                   <div className="flex flex-col items-center">
// //                     <Upload className="w-8 h-8 text-gray-400 mb-2" />
// //                     <Camera className="w-8 h-8 text-gray-400 mb-2" />
// //                     <span className="text-gray-700 font-medium capitalize">{side}</span>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //           <p className="text-sm text-gray-500 mb-4">Upload clear pictures of front and back</p>

// //           {Object.keys(images).length > 0 && (
// //             <button
// //               onClick={submitImages}
// //               disabled={isSubmitting}
// //               className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 ${
// //                 isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
// //               }`}
// //             >
// //               {isSubmitting ? (
// //                 <>
// //                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Processing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Check size={20} />
// //                   Submit Images
// //                 </>
// //               )}
// //             </button>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }
