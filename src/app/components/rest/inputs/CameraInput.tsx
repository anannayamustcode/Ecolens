"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface CameraInputProps {
  onCapture?: (imageData: string) => void;
}

export default function CameraInput({ onCapture }: CameraInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      if (onCapture) {
        onCapture(imageData);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="w-full max-w-lg h-64 bg-gray-100 rounded-lg overflow-hidden border border-green-300 relative">
          {stream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={64} className="text-green-500 opacity-50" />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex space-x-4">
        {!stream ? (
          <button
            onClick={startCamera}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Take Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
}