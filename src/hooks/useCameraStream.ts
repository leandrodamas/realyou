
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface CameraStreamState {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLoading: boolean;
  hasCamera: boolean;
  hasError: boolean;
  errorMessage: string | null;
  facingMode: "user" | "environment";
  switchCamera: () => void;
  faceDetected: boolean;
  isVideoReady: boolean;
}

export const useCameraStream = (isCameraActive: boolean = true): CameraStreamState => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [faceDetected, setFaceDetected] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mountedRef = useRef<boolean>(true);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check camera availability on component mount
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);

  // Cleanup function to stop camera stream
  const stopVideoStream = () => {
    if (streamRef.current) {
      console.log("Stopping camera stream");
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Initialize camera when active
  useEffect(() => {
    mountedRef.current = true;
    
    const startCamera = async () => {
      if (!isCameraActive) {
        stopVideoStream();
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      setIsVideoReady(false);
      
      try {
        // Stop any existing stream
        stopVideoStream();
        
        // For mobile Safari fixes
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        console.log("Requesting camera access with mode:", facingMode);
        
        // Request camera access
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!mountedRef.current) {
          // Component unmounted during camera initialization
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = stream;
        
        if (videoRef.current && mountedRef.current) {
          const videoElement = videoRef.current;
          videoElement.srcObject = stream;
          
          // Force video element attributes
          videoElement.muted = true;
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          
          // Start video and wait for it to be ready
          try {
            await videoElement.play();
            console.log("Video playback started");
          } catch (playError) {
            console.error("Error playing video:", playError);
            
            // Try again with a delay (helps with iOS Safari)
            setTimeout(async () => {
              if (videoRef.current && mountedRef.current) {
                try {
                  await videoRef.current.play();
                  console.log("Video playback started on retry");
                } catch (retryError) {
                  console.error("Error playing video on retry:", retryError);
                }
              }
            }, 500);
          }
          
          // Events to detect when video is ready
          const handleVideoReady = () => {
            if (mountedRef.current) {
              console.log("Video is ready");
              setIsVideoReady(true);
              setIsLoading(false);
            }
          };
          
          videoElement.addEventListener('loadeddata', handleVideoReady);
          videoElement.addEventListener('loadedmetadata', handleVideoReady);
          videoElement.addEventListener('canplay', handleVideoReady);
          
          // Fallback in case events don't fire
          setTimeout(() => {
            if (mountedRef.current && !isVideoReady) {
              console.log("Forcing video ready state after timeout");
              setIsVideoReady(true);
              setIsLoading(false);
            }
          }, 2000);
          
          // Simple face detection simulation (for demo purposes)
          detectionIntervalRef.current = setInterval(() => {
            if (mountedRef.current && videoRef.current && videoRef.current.readyState >= 2) {
              // Simulate face detection (randomly for demo)
              const detected = Math.random() > 0.3;
              setFaceDetected(detected);
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Camera access error:", error);
        if (mountedRef.current) {
          setHasError(true);
          setErrorMessage("Erro ao acessar câmera. Verifique as permissões.");
          setIsLoading(false);
          toast.error("Erro ao acessar câmera");
        }
      }
    };

    startCamera();
    
    // Clean up on unmount or when isCameraActive changes
    return () => {
      mountedRef.current = false;
      stopVideoStream();
    };
  }, [isCameraActive, facingMode]);
  
  // Handle visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isCameraActive) {
        if (videoRef.current && videoRef.current.paused && streamRef.current) {
          console.log("Document visible, resuming video");
          videoRef.current.play().catch(err => 
            console.error("Error resuming video on visibility change:", err)
          );
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCameraActive]);

  const switchCamera = () => {
    if (!isLoading) {
      setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    }
  };

  return {
    videoRef,
    isLoading,
    hasCamera,
    hasError,
    errorMessage,
    facingMode,
    switchCamera,
    faceDetected,
    isVideoReady
  };
};
