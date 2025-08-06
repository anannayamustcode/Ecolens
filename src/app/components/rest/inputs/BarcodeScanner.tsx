'use client';

import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const initScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const selectedDeviceId = devices[0]?.deviceId;

        if (selectedDeviceId && videoRef.current) {
          controlsRef.current = await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error, controls) => {
              if (result) {
                onDetected(result.getText());
                controls.stop(); // ✅ Properly stops camera stream
              }
            }
          );
        }
      } catch (err) {
        console.error("Camera initialization failed:", err);
      }
    };

    initScanner();

    return () => {
      controlsRef.current?.stop(); // ✅ Clean up camera stream
    };
  }, [onDetected]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      muted
    />
  );
}
    