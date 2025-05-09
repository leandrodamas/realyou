
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
      
      for (const device of videoDevices) {
        console.log(`Device: ${device.deviceId.substring(0, 8)}... - ${device.label || 'No label'}`);
      }
      
      // Prioritize rear camera on mobile
      if (videoDevices.length > 0) {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const facingMode = (constraints.video as MediaTrackConstraints)?.facingMode || 'user';
        
        if (isMobile && facingMode === 'environment') {
          // Try to identify rear camera
          const rearCameraKeywords = ['back', 'rear', 'environment', '0'];
          const potentialRearCamera = videoDevices.find(device => 
            device.label && rearCameraKeywords.some(keyword => 
              device.label.toLowerCase().includes(keyword)
            )
          );
          
          if (potentialRearCamera) {
            console.log("Found potential rear camera:", potentialRearCamera.label);
            attemptConfigurations.unshift({
              audio: false,
              video: {
                deviceId: { exact: potentialRearCamera.deviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            });
          }
        }
        
        // Always add a configuration with the first available device as fallback
        const preferredDevice = videoDevices[0].deviceId;
        attemptConfigurations.unshift({
          audio: false,
          video: {
            deviceId: { exact: preferredDevice },
            width: { ideal: 1280 },
            height: { ideal: 720 }
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
        
        // Set default camera permissions
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
