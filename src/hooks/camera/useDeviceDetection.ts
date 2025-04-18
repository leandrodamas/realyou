
import { useState, useEffect } from "react";

export const useDeviceDetection = () => {
  const [hasCamera, setHasCamera] = useState<boolean>(true);

  const checkCameraAvailability = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return false;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
      return videoDevices.length > 0;
    } catch (err) {
      console.error("Error checking camera availability:", err);
      setHasCamera(false);
      return false;
    }
  };

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  return { hasCamera, checkCameraAvailability };
};
