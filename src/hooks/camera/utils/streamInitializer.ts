
import { RefObject } from "react";
import { cleanupCameraStream } from "../../utils/cameraUtils";

export const initializeVideoStream = async (
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
  mountedRef: RefObject<boolean>
): Promise<MediaStream | null> => {
  console.log("Inicializando câmera com configurações:", JSON.stringify(constraints));
  
  // Define configurações para tentativas múltiplas
  const attemptConfigurations = [
    // Configuração 1: configurações fornecidas pelo usuário
    constraints,
    
    // Configuração 2: configurações simplificadas
    {
      audio: false,
      video: true
    },
    
    // Configuração 3: configuração básica com facingMode
    {
      audio: false,
      video: {
        facingMode: (constraints.video as any)?.facingMode || 'user'
      }
    },
    
    // Configuração 4: resolução baixa para dispositivos com limitações
    {
      audio: false,
      video: {
        facingMode: (constraints.video as any)?.facingMode || 'user',
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    },
    
    // Configuração 5: apenas especificação de dispositivo
    {
      audio: false,
      video: {}
    },
    
    // Configuração 6: última tentativa - configurações mínimas
    {
      video: true
    }
  ];
  
  try {
    // Primeiro, limpar qualquer stream anterior
    if (videoRef.current && videoRef.current.srcObject) {
      const oldStream = videoRef.current.srcObject as MediaStream;
      cleanupCameraStream(oldStream, videoRef.current);
    }

    // Detectar o tipo de dispositivo para configurações específicas
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    if (isIOS) {
      // iOS necessita de configurações específicas
      attemptConfigurations.unshift({
        audio: false,
        video: {
          facingMode: (constraints.video as any)?.facingMode || 'user',
          width: { ideal: 320, max: 640 },
          height: { ideal: 240, max: 480 }
        }
      });
    } else if (isAndroid) {
      // Android necessita de configurações específicas
      attemptConfigurations.unshift({
        audio: false,
        video: {
          facingMode: (constraints.video as any)?.facingMode || 'user'
        }
      });
    }
    
    // Tentar cada configuração até uma funcionar
    let lastError = null;
    for (let i = 0; i < attemptConfigurations.length; i++) {
      const config = attemptConfigurations[i];
      
      try {
        console.log(`Tentativa ${i + 1}/${attemptConfigurations.length} com configuração:`, JSON.stringify(config));
        
        const stream = await navigator.mediaDevices.getUserMedia(config);
        
        if (!mountedRef.current) {
          console.log("Componente desmontado, limpando stream");
          stream.getTracks().forEach(track => track.stop());
          return null;
        }
        
        console.log(`Stream obtido com sucesso na tentativa ${i + 1}`);
        
        // For iOS, add an extra debugging step
        if (isIOS) {
          const tracks = stream.getVideoTracks();
          console.log(`iOS camera tracks:`, tracks.length, tracks.map(t => t.label));
          
          // Force a small delay to let iOS camera initialize properly
          await new Promise(r => setTimeout(r, 500));
        }
        
        return stream;
      } catch (error) {
        console.log(`Erro na tentativa ${i + 1}:`, error);
        lastError = error;
        
        // Wait a moment before trying the next configuration
        await new Promise(r => setTimeout(r, 300));
        
        // Check if component is still mounted
        if (!mountedRef.current) {
          console.log("Componente desmontado durante tentativas");
          return null;
        }
      }
    }
    
    // Se chegou até aqui, todas as tentativas falharam
    console.error("Todas as tentativas de acessar a câmera falharam. Último erro:", lastError);
    throw lastError || new Error("Failed to access camera after multiple attempts");
  } catch (error: any) {
    console.error("Erro ao obter mídia do usuário:", error);
    
    // Relançar o erro com mais informações
    throw error;
  }
};
