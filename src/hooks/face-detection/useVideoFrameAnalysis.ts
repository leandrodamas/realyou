
import { useCallback } from 'react';

export const useVideoFrameAnalysis = () => {
  const analyzeVideoFrame = useCallback((video: HTMLVideoElement): ImageData | null => {
    try {
      const canvas = document.createElement('canvas');
      // Explicitly type the context as CanvasRenderingContext2D
      const context = canvas.getContext('2d', { willReadFrequency: true }) as CanvasRenderingContext2D;
      if (!context) return null;

      const width = Math.min(video.videoWidth, 200);
      const height = Math.min(video.videoHeight, 150);
      const centerX = (video.videoWidth - width) / 2;
      const centerY = (video.videoHeight - height) / 2;
      
      canvas.width = width;
      canvas.height = height;
      
      context.drawImage(
        video,
        centerX, centerY, width, height,
        0, 0, width, height
      );
      
      return context.getImageData(
        Math.floor(width * 0.3),
        Math.floor(height * 0.2),
        Math.floor(width * 0.4),
        Math.floor(height * 0.6)
      );
    } catch (e) {
      console.error("Error analyzing video frame:", e);
      return null;
    }
  }, []);

  return { analyzeVideoFrame };
};
