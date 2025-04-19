
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

    // Try to access the camera with a shorter timeout
    const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
    
    // Add a timeout to avoid hanging indefinitely
    const timeoutPromise = new Promise<MediaStream>((_, reject) => {
      setTimeout(() => reject(new Error("Camera access timeout")), 8000);
    });
    
    // Race between actual camera access and timeout
    const stream = await Promise.race([streamPromise, timeoutPromise]);
    
    // If component unmounted during the process, clean up the stream
    if (!mountedRef.current) {
      console.log("Component unmounted, cleaning up stream");
      stream.getTracks().forEach(track => track.stop());
      return null;
    }
    
    // Try lower resolution if not specified in constraints
    if (!constraints.video || typeof constraints.video === 'boolean') {
      const tracks = stream.getVideoTracks();
      if (tracks.length > 0) {
        try {
          // Try to set lower resolution constraints for better compatibility
          await tracks[0].applyConstraints({
            width: { ideal: 640 },
            height: { ideal: 480 }
          });
        } catch (e) {
          console.warn("Could not apply lower resolution constraints:", e);
        }
      }
    }
    
    console.log("Camera stream obtained successfully");
    return stream;
  } catch (error: any) {
    console.error("Error getting user media:", error);
    
    // Provide more descriptive error message based on the error type
    let errorMessage = error.message || "Unknown error";
    
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorMessage = "Camera is already in use by another application. Please close other apps using the camera.";
    } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorMessage = "Camera permission denied. Please grant camera permission in your browser settings.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No camera found on this device.";
    } else if (error.message && error.message.includes("timeout")) {
      errorMessage = "Camera access timed out. Please try again.";
    }
    
    // Rethrow with more descriptive message
    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name || "CameraError";
    throw enhancedError;
  }
};
