
/**
 * Core video element setup functionality
 */

export const setupVideoElement = (
  video: HTMLVideoElement, 
  stream: MediaStream
): void => {
  try {
    console.log("Configurando elemento de vídeo com stream");
    
    // Limpeza completa de qualquer stream anterior
    if (video.srcObject) {
      try {
        video.pause();
        video.srcObject = null;
        video.load();
      } catch (e) {
        console.error("Erro ao limpar vídeo:", e);
      }
    }
    
    // Força o vídeo a parar completamente qualquer atividade anterior
    video.pause();
    
    // Configurar todos os atributos críticos para compatibilidade cross-browser
    video.srcObject = stream;
    video.style.width = "100%";
    video.style.height = "100%";
    video.setAttribute("playsinline", "true");
    video.setAttribute("muted", "true");
    video.setAttribute("autoplay", "true");
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    
    // Para iOS, configurar manualmente mais propriedades
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIOS) {
      video.setAttribute("webkit-playsinline", "true");
    }
    
    // Garantir que o vídeo seja carregado
    video.load();
    
    // Tentar reproduzir o vídeo imediatamente
    startVideoPlayback(video);
    
  } catch (error) {
    console.error("Erro ao configurar elemento de vídeo:", error);
  }
};

const startVideoPlayback = (video: HTMLVideoElement): void => {
  video.play().then(() => {
    console.log("Vídeo iniciado com sucesso");
  }).catch(e => {
    console.warn("Erro ao iniciar vídeo na primeira tentativa:", e);
    
    // Se falhar no play inicial, tentar criar um manipulador de eventos para o próximo toque
    const handleUserInteraction = () => {
      video.play().catch(err => console.log("Erro ao reproduzir vídeo após interação:", err));
      ['touchend', 'click', 'keydown'].forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
    
    // Adicionar ouvintes para qualquer interação do usuário
    ['touchend', 'click', 'keydown'].forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });
    
    // Tentar novamente após um breve atraso
    setTimeout(() => {
      attemptVideoPlayback(video, 12);
    }, 800);
  });
};

const attemptVideoPlayback = (video: HTMLVideoElement, attempts: number = 5): void => {
  if (attempts <= 0) {
    console.log("Número máximo de tentativas de reprodução atingido");
    return;
  }
  
  if (video.paused && video.srcObject) {
    console.log(`Tentativa ${5-attempts+1} de iniciar vídeo`);
    video.play().then(() => {
      console.log(`Vídeo iniciado com sucesso na tentativa ${5-attempts+1}`);
    }).catch(e => {
      console.warn(`Erro na tentativa ${5-attempts+1}:`, e);
      setTimeout(() => attemptVideoPlayback(video, attempts - 1), 800);
    });
  }
};
