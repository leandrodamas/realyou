
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";
import { getPlatformConfigurations } from "./platformConfigurations";
import { setupVideoTrack, logTrackDetails } from "./videoTrackSetup";
import { StreamInitializerOptions } from "../types/cameraConstraints";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Initializing camera with settings:", JSON.stringify(constraints));
  
  if ((constraints.video as MediaTrackConstraints)?.deviceId) {
    console.log("Using specific deviceId for camera");
  }
  
  const attemptConfigurations = getPlatformConfigurations(constraints);
  
  try {
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      cleanupCameraStream(oldStream, videoRef.current);
    }

    // Try to get device list first
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log(`Available video devices: ${videoDevices.length}`);
      
      if (videoDevices.length > 0 && !(constraints.video as MediaTrackConstraints)?.deviceId) {
        console.log("Adding configuration with specific deviceId");
        const preferredDevice = videoDevices[0].deviceId;
        attemptConfigurations.unshift({
          audio: false,
          video: {
            deviceId: { exact: preferredDevice },
            facingMode: (constraints.video as MediaTrackConstraints)?.facingMode || 'user'
          }
        });
      }
    } catch (err) {
      console.warn("Error enumerating devices:", err);
    }

    let lastError = null;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    for (let i = 0; i < attemptConfigurations.length; i++) {
      const config = attemptConfigurations[i];
      
      try {
        console.log(`Attempt ${i + 1}/${attemptConfigurations.length} with configuration:`, JSON.stringify(config));
        
        if (isMobile && i > 0) {
          await new Promise(r => setTimeout(r, 300));
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(config);
        
        if (!mountedRef.current) {
          console.log("Component unmounted, cleaning stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        console.log(`Stream obtained successfully on attempt ${i + 1}`);
        const videoTracks = stream.getVideoTracks();
        
        if (videoTracks.length > 0) {
          logTrackDetails(videoTracks[0]);
          await setupVideoTrack(videoTracks[0]);
        }
        
        return stream;
      } catch (error) {
        console.log(`Error on attempt ${i + 1}:`, error);
        lastError = error;
        await new Promise(r => setTimeout(r, 300));
        
        if (!mountedRef.current) {
          console.log("Component unmounted during attempts");
          return null;
        }
      }
    }
    
    console.error("All attempts to access camera failed. Last error:", lastError);
    throw lastError || new Error("Failed to access camera after multiple attempts");
  } catch (error: any) {
    console.error("Error getting user media:", error);
    throw error;
  }
};
