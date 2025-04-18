
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
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
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

export const detectAndMatchFace = async (imageData: string): Promise<FaceMatchResult | null> => {
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Redimensionar imagem para dispositivos móveis para melhorar performance
    const optimizedImageData = await resizeImageForMobile(imageData);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Em dispositivos móveis, ajustar os parâmetros de detecção para melhor desempenho
    const confidenceThreshold = isMobile ? 0.55 : 0.6;
    
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
    const confidenceMatchThreshold = isMobile ? 0.7 : 0.75;
    
    // Filter matches with low confidence
    if (matchResult.matches.length > 0) {
      matchResult.matches = matchResult.matches
        .filter(match => match.confidence > confidenceMatchThreshold) // Only keep high confidence matches
        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
        .map(match => ({
          ...match,
          avatar: imageData
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
    
    // Otimizar imagem para dispositivos móveis
    const optimizedImageData = await resizeImageForMobile(imageData);
    
    const sdk = await getFacialRecognitionSDK();
    
    // Verificar a qualidade da imagem com limiar ajustado para mobile
    const qualityThreshold = isMobile ? 0.6 : 0.7;
    const detectionResult = await sdk.detectFace(optimizedImageData);
    
    if (!detectionResult.success || detectionResult.confidence < qualityThreshold) {
      if (detectionResult.confidence < qualityThreshold && detectionResult.confidence > 0.4) {
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
