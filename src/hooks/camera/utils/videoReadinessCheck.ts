
export const waitForVideoReady = (video: HTMLVideoElement): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const maxWaitTime = 5000;
    const startTime = Date.now();
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      console.log("Video already has dimensions:", video.videoWidth, "x", video.videoHeight);
      resolve(true);
      return;
    }
    
    if (video.readyState >= 2) {
      console.log("Video has acceptable readyState:", video.readyState);
      resolve(true);
      return;
    }
    
    const checkReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log("Video is ready with dimensions:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      if (video.readyState >= 2) {
        console.log("Video ready with readyState:", video.readyState);
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime > maxWaitTime) {
        console.log("Video ready timeout exceeded, forcing ready state");
        
        try {
          video.play().catch(e => console.log("Timeout play attempt failed:", e));
        } catch (e) {
          console.log("Error in timeout play attempt:", e);
        }
        
        resolve(true);
        return;
      }
      
      setTimeout(checkReady, 200);
    };
    
    const eventHandler = () => {
      console.log("Video ready event fired");
      resolve(true);
    };
    
    video.addEventListener('loadeddata', eventHandler, { once: true });
    video.addEventListener('loadedmetadata', eventHandler, { once: true });
    video.addEventListener('canplay', eventHandler, { once: true });
    video.addEventListener('playing', eventHandler, { once: true });
    
    checkReady();
  });
};
