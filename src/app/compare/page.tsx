// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, MapPin, Link, BarChart3 } from "lucide-react";

// interface SimilarityScores {
//   clarity: number;
//   design: number;
//   color: number;
//   pattern: number;
//   texture: number;
//   overall: number;
// }

// interface ComparisonData {
//   userImagePath: string;
//   uploadedImagePath: string;
//   similarityScores: SimilarityScores;
// }

// const Page = () => {
//   const [originalImage, setOriginalImage] = useState<string | null>(null);
//   const [comparisonImage, setComparisonImage] = useState<string | null>(null);
//   const [similarityScores, setSimilarityScores] = useState<SimilarityScores | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isComparing, setIsComparing] = useState(false);
//   const [hasComparisonImage, setHasComparisonImage] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [comparisonMode, setComparisonMode] = useState<'image' | 'url' | 'barcode'>('image');
//   const [urlInput, setUrlInput] = useState('');
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [isProcessingUrl, setIsProcessingUrl] = useState(false);
//   const [isProcessingBarcode, setIsProcessingBarcode] = useState(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchOriginalImage();
//   }, []);

//   const fetchOriginalImage = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await axios.get("http://localhost:5000/api/compare");
//       const { userImagePath, uploadedImagePath } = response.data;
//       setOriginalImage(userImagePath || uploadedImagePath);
//     } catch (error) {
//       console.error("Error fetching original image:", error);
//       setError("Failed to load original image. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const requestLocationAccess = async (type: 'original' | 'comparison') => {
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by this browser.');
//       return;
//     }

//     try {
//       const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });

//       const { latitude, longitude } = position.coords;
//       alert(`Location accessed for ${type} image: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      
//       // You can store this location data or send it to your backend
//       console.log(`${type} location:`, { latitude, longitude });
      
//     } catch (error) {
//       console.error('Error getting location:', error);
//       alert('Failed to access location. Please check your browser permissions.');
//     }
//   };

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setError("Please select a valid image file.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image size should be less than 5MB.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append('image', file);

//       const response = await axios.post("http://localhost:5000/api/upload-comparison", formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setComparisonImage(response.data.imagePath);
//       setHasComparisonImage(true);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setError("Failed to upload image. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleUrlSubmit = async () => {
//     if (!urlInput.trim()) {
//       setError("Please enter a valid URL.");
//       return;
//     }

//     setIsProcessingUrl(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/upload-url", {
//         url: urlInput.trim()
//       });

//       setComparisonImage(response.data.imagePath);
//       setHasComparisonImage(true);
//     } catch (error) {
//       console.error("Error processing URL:", error);
//       setError("Failed to process URL. Please try again.");
//     } finally {
//       setIsProcessingUrl(false);
//     }
//   };

//   const handleBarcodeSubmit = async () => {
//     if (!barcodeInput.trim()) {
//       setError("Please enter a valid barcode.");
//       return;
//     }

//     if (!/^\d{8,}$/.test(barcodeInput.trim())) {
//       setError("Please enter a valid barcode (8+ digits).");
//       return;
//     }

//     setIsProcessingBarcode(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/upload-barcode", {
//         barcode: barcodeInput.trim()
//       });

//       setComparisonImage(response.data.imagePath);
//       setHasComparisonImage(true);
//     } catch (error) {
//       console.error("Error processing barcode:", error);
//       setError("Failed to process barcode. Please try again.");
//     } finally {
//       setIsProcessingBarcode(false);
//     }
//   };

//   const compareImages = async () => {
//     if (!originalImage || !comparisonImage) {
//       setError("Both images are required for comparison.");
//       return;
//     }

//     setIsComparing(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/compare-images", {
//         originalImage,
//         comparisonImage
//       });

//       setSimilarityScores(response.data.similarityScores);
//     } catch (error) {
//       console.error("Error comparing images:", error);
//       setError("Failed to compare images. Please try again.");
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   const resetComparison = () => {
//     setComparisonImage(null);
//     setSimilarityScores(null);
//     setHasComparisonImage(false);
//     setError(null);
//     setUrlInput('');
//     setBarcodeInput('');
//     setComparisonMode('image');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const getSimilarityColor = (score: number) => {
//     if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
//     if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
//     return "text-red-600 bg-red-50 border-red-200";
//   };

//   const getSimilarityIcon = (score: number) => {
//     if (score >= 70) return <CheckCircle className="w-5 h-5 text-green-500" />;
//     return <AlertCircle className="w-5 h-5 text-amber-500" />;
//   };

//   const renderComparisonUpload = () => {
//     if (comparisonImage) {
//       return (
//         <div className="relative group">
//           <img
//             src={`http://localhost:5000/uploads/${comparisonImage}`}
//             alt="Comparison"
//             className="w-full h-80 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
//           />
//         </div>
//       );
//     }

//     return (
//       <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
//         {/* Mode Selection */}
//         <div className="flex justify-center mb-6">
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setComparisonMode('image')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 comparisonMode === 'image'
//                   ? 'bg-white text-indigo-600 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Upload className="w-4 h-4 inline mr-2" />
//               Image
//             </button>
//             <button
//               onClick={() => setComparisonMode('url')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 comparisonMode === 'url'
//                   ? 'bg-white text-indigo-600 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Link className="w-4 h-4 inline mr-2" />
//               URL
//             </button>
//             <button
//               onClick={() => setComparisonMode('barcode')}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 comparisonMode === 'barcode'
//                   ? 'bg-white text-indigo-600 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <BarChart3 className="w-4 h-4 inline mr-2" />
//               Barcode
//             </button>
//           </div>
//         </div>

//         {/* Upload Interface Based on Mode */}
//         {comparisonMode === 'image' && (
//           <div className="flex flex-col items-center justify-center h-full">
//             <Upload className="w-12 h-12 text-gray-400 mb-4" />
//             <p className="text-gray-600 font-medium mb-2">Upload an image to compare</p>
//             <p className="text-gray-500 text-sm mb-4">PNG, JPG, WEBP up to 5MB</p>
//             <label className="cursor-pointer">
//               <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 Choose File
//               </span>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         )}

//         {comparisonMode === 'url' && (
//           <div className="flex flex-col items-center justify-center h-full">
//             <Link className="w-12 h-12 text-gray-400 mb-4" />
//             <p className="text-gray-600 font-medium mb-4">Enter image URL</p>
//             <div className="w-full max-w-sm">
//               <input
//                 type="url"
//                 value={urlInput}
//                 onChange={(e) => setUrlInput(e.target.value)}
//                 placeholder="https://example.com/image.jpg"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
//               />
//               <button
//                 onClick={handleUrlSubmit}
//                 disabled={isProcessingUrl || !urlInput.trim()}
//                 className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//               >
//                 {isProcessingUrl ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Link className="w-4 h-4" />
//                     Process URL
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {comparisonMode === 'barcode' && (
//           <div className="flex flex-col items-center justify-center h-full">
//             <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
//             <p className="text-gray-600 font-medium mb-4">Enter barcode number</p>
//             <div className="w-full max-w-sm">
//               <input
//                 type="text"
//                 value={barcodeInput}
//                 onChange={(e) => setBarcodeInput(e.target.value.replace(/\D/g, ''))}
//                 placeholder="123456789012"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
//               />
//               <button
//                 onClick={handleBarcodeSubmit}
//                 disabled={isProcessingBarcode || !barcodeInput.trim()}
//                 className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//               >
//                 {isProcessingBarcode ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <BarChart3 className="w-4 h-4" />
//                     Process Barcode
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading your image...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-center">
//             <h1 className="text-2xl font-bold text-gray-900">Image Comparison</h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Images Section */}
//         <div className="grid lg:grid-cols-2 gap-8 mb-8">
//           {/* Original Image */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 Original Image
//               </h2>
//               <button
//                 onClick={() => requestLocationAccess('original')}
//                 className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
//               >
//                 <MapPin className="w-4 h-4" />
//                 Location
//               </button>
//             </div>
//             <div className="p-6">
//               {originalImage ? (
//                 <div className="relative group">
//                   <img
//                     src={`http://localhost:5000/uploads/${originalImage}`}
//                     alt="Original"
//                     className="w-full h-80 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
//                     onError={(e) => {
//                       console.error('Failed to load image:', e.target.src);
//                       e.target.style.display = 'none';
//                       e.target.nextElementSibling.style.display = 'flex';
//                     }}
//                     onLoad={() => console.log('Image loaded successfully:', originalImage)}
//                   />
//                   <div className="hidden w-full h-80 bg-red-50 border border-red-200 rounded-lg items-center justify-center">
//                     <p className="text-red-600">Failed to load image</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <p className="text-gray-500">No image found</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Comparison Image */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                 Comparison Image
//               </h2>
//               <button
//                 onClick={() => requestLocationAccess('comparison')}
//                 className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
//               >
//                 <MapPin className="w-4 h-4" />
//                 Location
//               </button>
//             </div>
//             <div className="p-6">
//               {renderComparisonUpload()}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-4 justify-center mb-8">
//           {hasComparisonImage && (
//             <button
//               onClick={compareImages}
//               disabled={isComparing}
//               className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold"
//             >
//               {isComparing ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Comparing...
//                 </>
//               ) : (
//                 <>
//                   <Camera className="w-5 h-5" />
//                   Compare Images
//                 </>
//               )}
//             </button>
//           )}

//           {hasComparisonImage && (
//             <button
//               onClick={resetComparison}
//               className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-semibold"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Reset
//             </button>
//           )}

//           {isUploading && (
//             <div className="flex items-center gap-2 text-indigo-600">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
//               <span className="font-medium">Uploading...</span>
//             </div>
//           )}
//         </div>

//         {/* Similarity Scores */}
//         {similarityScores && (
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Similarity Analysis</h3>
//               <p className="text-gray-600">Detailed comparison metrics between your images</p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               {Object.entries(similarityScores).map(([key, value]) => (
//                 <div
//                   key={key}
//                   className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${getSimilarityColor(value)}`}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-lg font-semibold capitalize">
//                       {key === 'overall' ? 'Overall Match' : key}
//                     </p>
//                     {getSimilarityIcon(value)}
//                   </div>
//                   <div className="flex items-end gap-1">
//                     <p className="text-3xl font-bold">{value}</p>
//                     <p className="text-lg font-medium pb-1">%</p>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
//                     <div
//                       className={`h-2 rounded-full transition-all duration-500 ${
//                         value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${value}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Overall Assessment */}
//             <div className="mt-8 p-6 bg-gray-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-900 mb-2">Assessment Summary</h4>
//               <p className="text-gray-700">
//                 {similarityScores.overall >= 80 ? (
//                   "Excellent match! The images are very similar across most metrics."
//                 ) : similarityScores.overall >= 60 ? (
//                   "Good similarity with some noticeable differences in certain aspects."
//                 ) : (
//                   "Limited similarity detected. The images have significant differences."
//                 )}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Camera, Upload, RefreshCw, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

interface SimilarityScores {
  clarity: number;
  design: number;
  color: number;
  pattern: number;
  texture: number;
  overall: number;
}

interface ComparisonData {
  userImagePath: string;
  uploadedImagePath: string;
  similarityScores: SimilarityScores;
}

const Page = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [comparisonImage, setComparisonImage] = useState<string | null>(null);
  const [similarityScores, setSimilarityScores] = useState<SimilarityScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [hasComparisonImage, setHasComparisonImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOriginalImage();
  }, []);

  const fetchOriginalImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/compare");
      const { userImagePath, uploadedImagePath } = response.data;
      setOriginalImage(userImagePath || uploadedImagePath);
    } catch (error) {
      console.error("Error fetching original image:", error);
      setError("Failed to load original image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post("http://localhost:5000/api/upload-comparison", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setComparisonImage(response.data.imagePath);
      setHasComparisonImage(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const compareImages = async () => {
    if (!originalImage || !comparisonImage) {
      setError("Both images are required for comparison.");
      return;
    }

    setIsComparing(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/compare-images", {
        originalImage,
        comparisonImage
      });

      setSimilarityScores(response.data.similarityScores);
    } catch (error) {
      console.error("Error comparing images:", error);
      setError("Failed to compare images. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  const resetComparison = () => {
    setComparisonImage(null);
    setSimilarityScores(null);
    setHasComparisonImage(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getSimilarityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-amber-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Image Comparison</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Images Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Original Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Original Image
              </h2>
            </div>
            <div className="p-6">
              {originalImage ? (
                <div className="relative group">
                  <img
                    src={`http://localhost:5000/uploads/${originalImage}`}
                    alt="Original"
                    className="w-full h-80 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
                  />
                
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No image found</p>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Comparison Image
              </h2>
            </div>
            <div className="p-6">
              {comparisonImage ? (
                <div className="relative group">
                  <img
                    src={`http://localhost:5000/uploads/${comparisonImage}`}
                    alt="Comparison"
                    className="w-full h-80 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"></div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-gray-600 font-medium mb-2">Upload an image to compare</p>
                    <p className="text-gray-500 text-sm mb-4">PNG, JPG, WEBP up to 5MB</p>
                    <label className="cursor-pointer">
                      <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Choose File
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {hasComparisonImage && (
            <button
              onClick={compareImages}
              disabled={isComparing}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold"
            >
              {isComparing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Comparing...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Compare Images
                </>
              )}
            </button>
          )}

          {hasComparisonImage && (
            <button
              onClick={resetComparison}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-semibold"
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          )}

          {isUploading && (
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span className="font-medium">Uploading...</span>
            </div>
          )}
        </div>

        {/* Similarity Scores */}
        {similarityScores && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Similarity Analysis</h3>
              <p className="text-gray-600">Detailed comparison metrics between your images</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(similarityScores).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${getSimilarityColor(value)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-semibold capitalize">
                      {key === 'overall' ? 'Overall Match' : key}
                    </p>
                    {getSimilarityIcon(value)}
                  </div>
                  <div className="flex items-end gap-1">
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="text-lg font-medium pb-1">%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Assessment */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Assessment Summary</h4>
              <p className="text-gray-700">
                {similarityScores.overall >= 80 ? (
                  "Excellent match! The images are very similar across most metrics."
                ) : similarityScores.overall >= 60 ? (
                  "Good similarity with some noticeable differences in certain aspects."
                ) : (
                  "Limited similarity detected. The images have significant differences."
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;


// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const Page = () => {
//   const [userImage, setUserImage] = useState<string | null>(null);
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [similarityScores, setSimilarityScores] = useState<any>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchComparisonData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/compare");
//         const { userImagePath, uploadedImagePath, similarityScores } = response.data;
//         setUserImage(userImagePath);
//         setUploadedImage(uploadedImagePath);
//         setSimilarityScores(similarityScores);
//       } catch (error) {
//         console.error("Error fetching comparison data:", error);
//       }
//     };

//     fetchComparisonData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 flex flex-col items-center">
//       <h1 className="text-4xl font-extrabold text-gray-800 mb-8 underline decoration-pink-500">Comparison Results</h1>

//       <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 bg-white shadow-lg p-6 rounded-xl">
//         <div className="flex flex-col items-center gap-4">
//           <h2 className="text-xl font-semibold text-gray-700">Uploaded Outfit</h2>
//           {uploadedImage ? (
//             <img src={`http://localhost:5000/uploads/${uploadedImage}`} alt="Uploaded" className="w-72 h-96 object-cover rounded-lg border border-gray-300" />
//           ) : (
//             <p className="text-gray-500">Loading image...</p>
//           )}
//         </div>

//         <div className="w-px h-64 bg-gray-300 hidden md:block" />

//         <div className="flex flex-col items-center gap-4">
//           <h2 className="text-xl font-semibold text-gray-700">Your Captured Image</h2>
//           {userImage ? (
//             <img src={`http://localhost:5000/uploads/${userImage}`} alt="User" className="w-72 h-96 object-cover rounded-lg border border-gray-300" />
//           ) : (
//             <p className="text-gray-500">Loading image...</p>
//           )}
//         </div>
//       </div>

//       {similarityScores && (
//         <div className="mt-10 w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
//           <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Similarity Metrics</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
//             <div className="bg-blue-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Clarity</p>
//               <p className="text-2xl font-bold text-blue-600">{similarityScores.clarity}%</p>
//             </div>
//             <div className="bg-green-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Design</p>
//               <p className="text-2xl font-bold text-green-600">{similarityScores.design}%</p>
//             </div>
//             <div className="bg-purple-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Color</p>
//               <p className="text-2xl font-bold text-purple-600">{similarityScores.color}%</p>
//             </div>
//             <div className="bg-pink-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Pattern</p>
//               <p className="text-2xl font-bold text-pink-600">{similarityScores.pattern}%</p>
//             </div>
//             <div className="bg-yellow-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Texture</p>
//               <p className="text-2xl font-bold text-yellow-600">{similarityScores.texture}%</p>
//             </div>
//             <div className="bg-red-50 rounded-lg p-4">
//               <p className="text-lg font-medium">Overall Similarity</p>
//               <p className="text-2xl font-bold text-red-600">{similarityScores.overall}%</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <button
//         onClick={() => router.push("/capture")}
//         className="mt-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition duration-300 shadow-md"
//       >
//         Try Again
//       </button>
//     </div>
//   );
// };

// export default Page;



// "use client";

// import React from 'react';

// const Compare = ()  =>{

//     return (
//         <div className='flex'>
//             {/* Left column */}
//             <div className="w-1/2 bg-green-100 border-r  p-4">
//                 <h2 className="text-xl font-semibold text-black">Left Column</h2>
//                 <p className='text-black'>This is the left side content.</p>

//             </div>

//             {/* Right column */}
//             <div className="w-1/2 bg-green-100 border-r  p-4">
//                 <h2 className="text-xl font-semibold text-black">Right Column</h2>
//                 <p className='text-black'>This is the right side content.</p>

//             </div>
//         </div>
//     )

// }

// export default Compare;