
export const cleanupCameraStream = (stream: MediaStream | null, videoElement: HTMLVideoElement | null) => {
  if (stream) {
    try {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.log("Error stopping individual track:", err);
        }
      });
    } catch (err) {
      console.log("Error stopping tracks:", err);
    }
  }
  
  if (videoElement) {
    try {
      videoElement.srcObject = null;
      videoElement.load();
    } catch (err) {
      console.log("Error clearing video srcObject:", err);
    }
  }
};
