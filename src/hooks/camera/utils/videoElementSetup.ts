
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
  
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  
  video.load();
  setTimeout(() => {
    video.play().catch(e => console.log("Error in setupVideoElement play:", e));
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

    tryPlay();
    
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.muted = true;
    
    setTimeout(tryPlay, 300);
  }
};
