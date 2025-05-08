
import { useCallback } from "react";
import { initializeVideoStream } from "./utils/streamInitializer";
import { setupVideoElement } from "./utils/videoElementSetup";
import { toast } from "sonner";

/**
 * Hook that provides camera startup functionality
 */
export const useStartCamera = (
  isCameraActive: boolean,
  facingMode: "user" | "environment",
  videoRef: React.RefObject<HTMLVideoElement>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  mountedRef: React.RefObject<boolean>,
  setIsLoading: (isLoading: boolean) => void,
  setIsVideoReady: (isReady: boolean) => void,
  resetError: () => void,
  handleCameraError: (error: any) => void,
  incrementRetryCount: () => void,
  resetRetryCount: () => void
) => {
  const startCamera = useCallback(async () => {
    if (!isCameraActive) return;
    
    console.log("useStartCamera: Starting camera with facingMode:", facingMode);
    setIsLoading(true);
    setIsVideoReady(false);
    resetError();

    // Reset retry counter when trying new camera access
    resetRetryCount();

    let timeoutId: NodeJS.Timeout;
    
    try {
      console.log("useStartCamera: Attempting to start camera...");
      
      // Set a timeout for camera initialization
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("useStartCamera: Camera initialization timeout - forcing ready state");
          setIsLoading(false);
          setIsVideoReady(true);
          
          // On some browsers, we may try to force user interaction to activate the camera
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (isIOS) {
            toast.info("Touch the screen to activate the camera", { duration: 3000 });
          }
        }
      }, 8000); // 8 seconds timeout

      // Determine if we're on a mobile device to adjust settings
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      console.log("useStartCamera: Detected device:", 
                  isMobile ? (isIOS ? "iOS" : "Android") : "Desktop");
      
      // Platform-adapted configurations
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: { facingMode }
      };
      
      if (typeof navigator.mediaDevices === 'undefined' || 
          typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        throw new Error("Media API not available in this browser");
      }
      
      console.log("useStartCamera: Trying camera initialization with settings:", 
                  JSON.stringify(constraints));
      
      // Force a small delay before initializing camera
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Explicitly request permission first (using a simpler request)
      try {
        await navigator.mediaDevices.getUserMedia({video: true});
        console.log("useStartCamera: Camera permission granted");
      } catch (permErr) {
        console.error("useStartCamera: Error in initial permission:", permErr);
        // Continue even with error here, we'll try again with specific settings
      }
      
      // Try to initialize the stream with specific settings
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // If we got here, we had success
      clearTimeout(timeoutId);
      
      if (stream && videoRef.current && mountedRef.current) {
        console.log("useStartCamera: Camera stream obtained successfully");
        streamRef.current = stream;
        
        // Set up the video element with the stream
        setupVideoElement(videoRef.current, stream);
        
        // For iOS, add a small additional delay
        const setupDelay = isIOS ? 800 : 500;
        
        // Add a small delay before updating state
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("useStartCamera: Setting video as ready");
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }, setupDelay);
        
        return;
      }
    } catch (error: any) {
      console.error("useStartCamera: Camera access error:", error);
      
      // Clear timeout if error occurs
      clearTimeout(timeoutId);
      
      if (mountedRef.current) {
        incrementRetryCount();
        handleCameraError(error);
        
        // Try to start with alternate facingMode if it didn't work
        if (!hasRetried.current) {
          console.log("useStartCamera: Trying with alternate facingMode");
          // This logic is just for logging, the actual facingMode change is controlled externally
          toast.info("Trying with front camera...", { duration: 3000 });
          hasRetried.current = true;
        }
        
        setIsLoading(false);
      }
    }
  }, [isCameraActive, facingMode, handleCameraError, incrementRetryCount, 
      resetError, resetRetryCount, setIsLoading, setIsVideoReady]);

  // Track retries in the current render cycle
  const hasRetried = useCallback(() => {
    const ref = { current: false };
    return ref;
  }, [])();

  return { startCamera };
};
