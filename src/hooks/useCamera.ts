
import { useRef, useState, useEffect } from "react";

interface UseCameraOptions {
  videoConstraints?: MediaTrackConstraints;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  photo: string | null;
  isLoading: boolean;
  error: string | null;
  takePhoto: () => void;
  resetPhoto: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = (options?: UseCameraOptions): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultConstraints: MediaTrackConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user"
  };
  
  const videoConstraints = options?.videoConstraints || defaultConstraints;

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Camera access denied or not available");
      console.error("Camera error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);
  };

  const resetPhoto = () => {
    setPhoto(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    photo,
    isLoading,
    error,
    takePhoto,
    resetPhoto,
    startCamera,
    stopCamera
  };
};
