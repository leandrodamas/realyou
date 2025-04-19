
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Initializing camera with constraints:", JSON.stringify(constraints));
  
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  console.log("Camera stream obtained successfully");
  
  if (!mountedRef.current) {
    console.log("Component unmounted, cleaning up stream");
    stream.getTracks().forEach(track => track.stop());
    return null;
  }
  
  if (videoRef.current && mountedRef.current) {
    const video = videoRef.current;
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    
    try {
      await video.play();
      console.log("Video playback started successfully");
    } catch (error) {
      console.error("Error during video play:", error);
      throw error;
    }
  }
  
  return stream;
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
};

export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const maxWaitTime = 3000;
    const startTime = Date.now();
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Video already has dimensions:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    const checkReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0 || video.readyState >= 2) {
        console.log("Video is ready with dimensions:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Video ready timeout exceeded, forcing ready state");
        resolve(true);
        return;
      }
      
      setTimeout(checkReady, 100);
    };
    
    video.addEventListener('loadeddata', () => resolve(true), { once: true });
    video.addEventListener('loadedmetadata', () => resolve(true), { once: true });
    video.addEventListener('canplay', () => resolve(true), { once: true });
    
    checkReady();
  });
};
