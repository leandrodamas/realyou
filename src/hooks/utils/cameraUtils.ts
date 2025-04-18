
export const cleanupCameraStream = (stream: MediaStream | null, videoElement: HTMLVideoElement | null) => {
  if (stream) {
    try {
      console.log("Cleaning up camera stream tracks");
      stream.getTracks().forEach(track => {
        try {
          console.log(`Stopping track: ${track.kind}, enabled: ${track.enabled}, state: ${track.readyState}`);
          track.stop();
        } catch (err) {
          console.error("Error stopping individual track:", err);
        }
      });
    } catch (err) {
      console.error("Error stopping tracks:", err);
    }
  }
  
  if (videoElement) {
    try {
      console.log("Cleaning up video element");
      videoElement.pause();
      videoElement.srcObject = null;
      videoElement.load();
    } catch (err) {
      console.error("Error clearing video srcObject:", err);
    }
  }
};

export const getDeviceInfo = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    return {
      hasCamera: videoDevices.length > 0,
      devices: videoDevices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${videoDevices.indexOf(device) + 1}`
      }))
    };
  } catch (err) {
    console.error("Error getting device info:", err);
    return {
      hasCamera: false,
      devices: []
    };
  }
};
