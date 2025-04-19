
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
  
  // Set all important attributes
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  
  // Also set attributes directly to ensure better browser compatibility
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  
  // Force load and play with a small delay for better compatibility
  video.load();
  setTimeout(() => {
    video.play().catch(e => {
      console.log("Error in setupVideoElement play:", e);
      // Retry play after a short delay
      setTimeout(() => {
        video.play().catch(e2 => console.log("Second play attempt failed:", e2));
      }, 500);
    });
  }, 100);
};

export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Ensuring video is playing, current state:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    const tryPlay = () => {
      video.play().catch(e => {
        console.log("Play failed in ensureVideoPlaying:", e);
      });
    };

    // Try multiple times with increasing delays
    tryPlay();
    
    // Set all critical attributes
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.muted = true;
    
    setTimeout(tryPlay, 300);
    setTimeout(tryPlay, 1000);
  }
};
