
import { useCallback } from 'react';

export const useVideoFrameAnalysis = () => {
  const analyzeVideoFrame = useCallback((video: HTMLVideoElement): ImageData | null => {
    try {
      // Check if video is ready for analysis
      if (!video.videoWidth || !video.videoHeight) {
        console.log("Video dimensions not available yet");
        return null;
      }
      
      if (video.readyState < 2) {
        console.log("Video not ready for analysis, readyState:", video.readyState);
        return null;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequency: true }) as CanvasRenderingContext2D;
      if (!context) return null;

      // Enlarge the analyzed area for better face detection
      const width = Math.min(video.videoWidth, 240); // Was 200
      const height = Math.min(video.videoHeight, 180); // Was 150
      const centerX = (video.videoWidth - width) / 2;
      const centerY = (video.videoHeight - height) / 2;
      
      canvas.width = width;
      canvas.height = height;
      
      context.drawImage(
        video,
        centerX, centerY, width, height,
        0, 0, width, height
      );
      
      // Analyze a larger region in the center (was 0.3/0.2/0.4/0.6)
      return context.getImageData(
        Math.floor(width * 0.25),
        Math.floor(height * 0.15),
        Math.floor(width * 0.5),
        Math.floor(height * 0.7)
      );
    } catch (e) {
      console.error("Error analyzing video frame:", e);
      return null;
    }
  }, []);

  return { analyzeVideoFrame };
};
