
import { toast } from "sonner";

export const resizeImageForMobile = (imageData: string): Promise<string> => {
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
        
        ctx.filter = 'brightness(1.4) contrast(1.2) saturate(1.1)';
        ctx.drawImage(img, 0, 0, width, height);
        ctx.filter = 'none';
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        console.error('Error resizing image:', err);
        resolve(imageData);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };
    
    img.src = imageData;
  });
};

export const enhanceImageBrightness = (imageData: string): Promise<string> => {
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
        
        ctx.filter = 'brightness(1.5) contrast(1.2) saturate(1.1)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        console.error('Error enhancing image:', err);
        resolve(imageData);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for enhancement'));
    };
    
    img.src = imageData;
  });
};
