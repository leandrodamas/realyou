
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Initializing camera with constraints:", JSON.stringify(constraints));
  
  try {
    // First, clean up any previous stream
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      oldStream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    // Request the stream with a shorter timeout (10 seconds instead of 15)
    const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
    
    // Create a timeout to ensure we don't get stuck waiting
    const timeoutPromise = new Promise<MediaStream>((_, reject) => {
      setTimeout(() => reject(new Error("Camera access timeout")), 10000);
    });
    
    // Use Promise.race to avoid getting stuck if permission isn't granted
    const stream = await Promise.race([streamPromise, timeoutPromise]);
    console.log("Camera stream obtained successfully");
    
    if (!mountedRef.current) {
      console.log("Component unmounted, cleaning up stream");
      stream.getTracks().forEach(track => track.stop());
      return null;
    }
    
    if (videoRef.current && mountedRef.current) {
      const video = videoRef.current;
      
      // Make sure the video element is clean before setting a new stream
      if (video.srcObject) {
        video.srcObject = null;
        video.load();
      }
      
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      
      // Force loading
      video.load();
      
      // Multiple play attempts with different approaches
      const attemptPlay = async () => {
        try {
          console.log("First play attempt");
          await video.play();
          console.log("First play succeeded");
        } catch (e1) {
          console.warn("First play failed:", e1);
          
          // Try again after a delay
          setTimeout(async () => {
            try {
              if (video && mountedRef.current) {
                console.log("Second play attempt");
                await video.play();
                console.log("Second play succeeded");
              }
            } catch (e2) {
              console.warn("Second play failed:", e2);
              
              // Last attempt with different approach
              setTimeout(() => {
                if (video && mountedRef.current) {
                  console.log("Third play attempt (manual)");
                  // This bypasses some browser restrictions by using a user event simulation approach
                  video.setAttribute("playsinline", "");
                  video.setAttribute("autoplay", "");
                  video.setAttribute("muted", "");
                  video.muted = true;
                  video.play().catch(e => console.warn("Final play attempt failed:", e));
                }
              }, 500);
            }
          }, 500);
        }
      };
      
      await attemptPlay();
      
      // Log video status after play attempts
      console.log("Video status after play attempts:", {
        readyState: video.readyState,
        paused: video.paused,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      });
    }
    
    return stream;
  } catch (error) {
    console.error("Error getting user media:", error);
    throw error;
  }
};

export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  if (video.srcObject) {
    video.srcObject = null;
    video.load();
  }
  
  video.srcObject = stream;
  video.style.width = "100%";
  video.style.height = "100%";
  
  // Ensure video is properly configured for autoplay
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  
  // Force loading and playing
  video.load();
  setTimeout(() => {
    video.play().catch(e => console.log("Error in setupVideoElement play:", e));
  }, 100);
};

export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const maxWaitTime = 5000; // Reduced from 8 seconds to 5 seconds
    const startTime = Date.now();
    
    // Check if video is already ready
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Video already has dimensions:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    // Check if video is in an acceptable playback state
    if (video.readyState >= 2) {
      console.log("Video has acceptable readyState:", video.readyState);
      resolve(true);
      return;
    }
    
    const checkReady = () => {
      // Check if we have dimensions
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log("Video is ready with dimensions:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      // Check readyState
      if (video.readyState >= 2) {
        console.log("Video ready with readyState:", video.readyState);
        resolve(true);
        return;
      }
      
      // Check timeout
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Video ready timeout exceeded, forcing ready state");
        
        // Force play one last time
        try {
          video.play().catch(e => console.log("Timeout play attempt failed:", e));
        } catch (e) {
          console.log("Error in timeout play attempt:", e);
        }
        
        resolve(true);
        return;
      }
      
      // Check again soon
      setTimeout(checkReady, 200);
    };
    
    // Register event listeners
    const eventHandler = () => {
      console.log("Video ready event fired");
      resolve(true);
    };
    
    video.addEventListener('loadeddata', eventHandler, { once: true });
    video.addEventListener('loadedmetadata', eventHandler, { once: true });
    video.addEventListener('canplay', eventHandler, { once: true });
    video.addEventListener('playing', eventHandler, { once: true });
    
    // Start periodic checking
    checkReady();
  });
};

// Function to try multiple approaches to start video
export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Ensuring video is playing, current state:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    // Try multiple play methods
    const tryPlay = () => {
      video.play().catch(e => {
        console.log("Play failed in ensureVideoPlaying:", e);
      });
    };

    tryPlay();
    
    // Set important attributes
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.muted = true;
    
    // Try again after a small delay
    setTimeout(tryPlay, 300);
  }
}
