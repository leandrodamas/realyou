
/**
 * Helper functions for video playback management
 */

export const ensureVideoPlaying = (video: HTMLVideoElement): void => {
  if (!video) return;
  
  console.log("Garantindo que o vídeo está sendo reproduzido, estado atual:", {
    readyState: video.readyState,
    paused: video.paused,
    srcObject: !!video.srcObject
  });
  
  if (video.paused && video.srcObject) {
    // Tentar reproduzir diretamente
    video.play().catch(e => {
      console.log(`Tentativa de reprodução falhou:`, e);
      
      // Se falhou, tentar criar um botão invisível para acionar o play
      createInvisiblePlayButton(video);
    });
    
    // Configurar atributos críticos novamente
    video.setAttribute("playsinline", "true");
    video.setAttribute("autoplay", "true");
    video.setAttribute("muted", "true");
    video.muted = true;
  }
};

const createInvisiblePlayButton = (video: HTMLVideoElement): void => {
  const invisibleButton = document.createElement('button');
  invisibleButton.style.position = 'fixed';
  invisibleButton.style.bottom = '0';
  invisibleButton.style.opacity = '0.01';
  invisibleButton.style.width = '100px';
  invisibleButton.style.height = '50px';
  invisibleButton.textContent = 'Iniciar vídeo';
  
  invisibleButton.onclick = () => {
    video.play().catch(() => {});
    document.body.removeChild(invisibleButton);
  };
  
  document.body.appendChild(invisibleButton);
  setTimeout(() => {
    if (document.body.contains(invisibleButton)) {
      invisibleButton.click();
      setTimeout(() => {
        if (document.body.contains(invisibleButton)) {
          document.body.removeChild(invisibleButton);
        }
      }, 1000);
    }
  }, 500);
};

export const forceVideoPlaybackAfterTimeout = (video: HTMLVideoElement): void => {
  // Garantir que o vídeo seja marcado como pronto após tempo limite
  setTimeout(() => {
    if (video.paused && video.srcObject) {
      console.log("Vídeo ainda parado após tempo limite, forçando reprodução final");
      video.play().catch(() => {
        console.log("Tentativa final de reprodução falhou, considerando como pronto mesmo assim");
      });
    }
  }, 5000);
};
