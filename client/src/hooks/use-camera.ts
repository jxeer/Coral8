/**
 * Camera Integration Hook
 * Provides camera access for labor attestation photos and profile pictures
 * Handles image capture, compression, and upload for mobile devices
 * Essential for documenting culturally rooted labor activities
 */

import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isSupported: boolean;
  isActive: boolean;
  hasPermission: boolean;
  error: string | null;
  stream: MediaStream | null;
}

interface CameraOptions {
  width?: number;
  height?: number;
  quality?: number;
  facingMode?: 'user' | 'environment';
}

interface CapturedImage {
  blob: Blob;
  dataUrl: string;
  file: File;
}

/**
 * Custom hook for camera integration
 * @param options - Camera configuration options
 * @returns Camera state and control functions
 */
export function useCamera(options: CameraOptions = {}) {
  const {
    width = 1280,
    height = 720,
    quality = 0.8,
    facingMode = 'environment'
  } = options;

  const [state, setState] = useState<CameraState>({
    isSupported: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    isActive: false,
    hasPermission: false,
    error: null,
    stream: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Start camera stream
   */
  const startCamera = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Camera not supported on this device' }));
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: { ideal: facingMode },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState(prev => ({
        ...prev,
        isActive: true,
        hasPermission: true,
        error: null,
        stream,
      }));

      return true;
    } catch (error) {
      let errorMessage = 'Failed to access camera';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is being used by another application';
        }
      }

      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.isSupported, width, height, facingMode]);

  /**
   * Stop camera stream
   */
  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      stream: null,
    }));
  }, [state.stream]);

  /**
   * Capture photo from camera
   */
  const capturePhoto = useCallback(async (): Promise<CapturedImage | null> => {
    if (!videoRef.current || !canvasRef.current || !state.isActive) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        // Create data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Create file
        const file = new File([blob], `coral8_photo_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        resolve({ blob, dataUrl, file });
      }, 'image/jpeg', quality);
    });
  }, [state.isActive, quality]);

  /**
   * Switch camera (front/back)
   */
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    
    // Stop current camera
    stopCamera();
    
    // Start with new facing mode
    return startCamera();
  }, [facingMode, stopCamera, startCamera]);

  /**
   * Take photo and upload to server
   */
  const takePhotoAndUpload = useCallback(async (endpoint: string = '/api/upload/image') => {
    const captured = await capturePhoto();
    if (!captured) return null;

    try {
      const formData = new FormData();
      formData.append('image', captured.file);
      formData.append('type', 'labor_attestation');

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      return { ...captured, uploadResult: result };
    } catch (error) {
      console.error('Failed to upload photo:', error);
      return { ...captured, uploadError: error };
    }
  }, [capturePhoto]);

  // Cleanup on unmount
  useState(() => {
    return () => {
      stopCamera();
    };
  });

  return {
    ...state,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    takePhotoAndUpload,
  };
}

/**
 * Hook for image compression and optimization
 */
export function useImageCompression() {
  const compressImage = useCallback(async (
    file: File,
    maxWidth: number = 1024,
    maxHeight: number = 768,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  return { compressImage };
}