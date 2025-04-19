
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

    // Request the stream with a shorter timeout
    const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
    
    const timeoutPromise = new Promise<MediaStream>((_, reject) => {
      setTimeout(() => reject(new Error("Camera access timeout")), 10000);
    });
    
    const stream = await Promise.race([streamPromise, timeoutPromise]);
    console.log("Camera stream obtained successfully");
    
    if (!mountedRef.current) {
      console.log("Component unmounted, cleaning up stream");
      stream.getTracks().forEach(track => track.stop());
      return null;
    }
    
    return stream;
  } catch (error) {
    console.error("Error getting user media:", error);
    throw error;
  }
};
