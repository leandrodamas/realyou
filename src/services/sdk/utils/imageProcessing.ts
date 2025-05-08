
/**
 * Utility for local face detection in images
 */
export const localDetectFace = async (imageData: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Implementação simplificada de detecção
    // Em produção, isso usaria biblioteca real de ML
    const img = new Image();
    img.onload = () => {
      // Verificar se a imagem tem tamanho mínimo para conter um rosto
      if (img.width < 100 || img.height < 100) {
        resolve(false);
        return;
      }
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = imageData;
  });
};
