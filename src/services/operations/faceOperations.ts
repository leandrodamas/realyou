
import { toast } from "sonner";
import { getFacialRecognitionSDK } from "../sdk/initializeSDK";
import type { FaceMatchResult } from "../sdk/FacialRecognitionSDK";

// Função auxiliar para redimensionar imagens para melhor performance em mobile
const resizeImageForMobile = (imageData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Se não for mobile, não redimensionar
    if (!isMobile) {
      resolve(imageData);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      try {
        // Redimensionar para um tamanho razoável em dispositivos móveis
        const maxSize = 640;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageData);
          return;
        }
        
        // Aplicar correções de brilho/contraste para melhorar imagens escuras
        ctx.filter = 'brightness(1.4) contrast(1.2) saturate(1.1)';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Reset filter
        ctx.filter = 'none';
        
        resolve(canvas.toDataURL('image/jpeg', 0.9)); // Aumentar qualidade
      } catch (err) {
        console.error('Error resizing image:', err);
        resolve(imageData); // Em caso de erro, usa a imagem original
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };
    
    img.src = imageData;
  });
};

// Função para melhorar imagens com baixa iluminação
const enhanceImageBrightness = (imageData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageData);
          return;
        }
        
        // Aplicar filtros para melhorar iluminação
        ctx.filter = 'brightness(1.5) contrast(1.2) saturate(1.1)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        console.error('Error enhancing image:', err);
        resolve(imageData); // Em caso de erro, retorna a imagem original
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for enhancement'));
    };
    
    img.src = imageData;
  });
};

export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Melhorar a imagem antes de processar
    const enhancedImage = await enhanceImageBrightness(imageData);
    
    // Então redimensionar para dispositivos móveis
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Em dispositivos móveis, ajustar os parâmetros de detecção para melhor desempenho
    const confidenceThreshold = isMobile ? 0.5 : 0.6; // Redução do threshold para mobile
    
    // Step 1: Enhanced face detection with stricter confidence threshold
    const detectionResult = await sdk.detectFace(optimizedImageData);
    if (!detectionResult.success || !detectionResult.faceId) {
      console.error("Face detection failed:", detectionResult.error);
      toast.error(isMobile ? 
        "Não foi possível detectar um rosto" : 
        "Não foi possível detectar um rosto na imagem"
      );
      return null;
    }
    
    // Ajustar feedback baseado na confiança (simplificado para mobile)
    if (!isMobile) {
      if (detectionResult.confidence < confidenceThreshold) {
        toast.error("Qualidade da imagem muito baixa. Tente em um ambiente mais iluminado.");
        return null;
      } else if (detectionResult.confidence < 0.7) {
        toast.warning("Qualidade da imagem não é ideal. Tente novamente com melhor iluminação.");
      } else if (detectionResult.confidence > 0.9) {
        toast.success("Qualidade da imagem excelente!");
      }
    }
    
    // Step 2: Enhanced face matching with confidence threshold
    const matchResult = await sdk.matchFace(detectionResult.faceId);
    
    if (!matchResult.success) {
      toast.error("Erro ao procurar correspondências");
      return null;
    }
    
    // Ajustar limiar de confiança para dispositivos móveis
    const confidenceMatchThreshold = isMobile ? 0.65 : 0.75; // Reduzido para mobile
    
    // Filter matches with low confidence
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches
        .filter(match => match.confidence > confidenceMatchThreshold) // Only keep high confidence matches
        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
        .map(match => ({
          ...match,
          avatar: optimizedImageData // Usar imagem otimizada
        }));
      
      if (matchResult.matches.length > 0) {
        const bestMatch = matchResult.matches[0];
        // Reduzir feedback em dispositivos móveis para melhor desempenho
        if (!isMobile) {
          if (bestMatch.confidence > 0.9) {
            toast.success("Correspondência encontrada com alta confiança!");
          } else {
            toast.info("Possível correspondência encontrada");
          }
        }
      }
    }
    
    return matchResult;
  } catch (error) {
    console.error("Error in facial recognition process:", error);
    toast.error("Erro no processo de reconhecimento facial");
    return null;
  }
};

export const registerFaceForUser = async (imageData: string, userId: string): Promise<boolean> => {
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Melhorar a imagem antes de processar
    const enhancedImage = await enhanceImageBrightness(imageData);
    
    // Então redimensionar para dispositivos móveis
    const optimizedImageData = await resizeImageForMobile(enhancedImage);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Verificar a qualidade da imagem com limiar ajustado para mobile
    const qualityThreshold = isMobile ? 0.5 : 0.7; // Reduzido para mobile
    const detectionResult = await sdk.detectFace(optimizedImageData);
    
    if (!detectionResult.success || detectionResult.confidence < qualityThreshold) {
      if (detectionResult.confidence < qualityThreshold && detectionResult.confidence > 0.3) { // Reduzido
        // Se a qualidade estiver baixa mas aceitável, permitir o registro com aviso
        toast.warning("Qualidade da imagem não é ideal, mas tentaremos registrar");
      } else {
        toast.error("A qualidade da imagem não é boa o suficiente para registro");
        return false;
      }
    }
    
    const success = await sdk.registerFace(optimizedImageData, userId);
    if (success) {
      toast.success("Rosto registrado com sucesso!");
    } else {
      toast.error("Não foi possível registrar o rosto");
    }
    
    return success;
  } catch (error) {
    console.error("Error registering face:", error);
    toast.error("Erro ao registrar rosto");
    return false;
  }
};
