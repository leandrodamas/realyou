
import { useCallback } from 'react';

export const useBrightnessAnalysis = () => {
  const analyzeBrightness = useCallback((centerRegion: ImageData) => {
    const data = centerRegion.data;
    let totalBrightness = 0;
    let faceColorVariation = 0;
    let prevPixel = 0;
    
    // Calculate average brightness and color variation - improved sensitivity
    for (let i = 0; i < data.length; i += 8) { // Sample more pixels (was 16)
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      totalBrightness += brightness;
      
      if (i > 0) {
        faceColorVariation += Math.abs(prevPixel - brightness);
      }
      prevPixel = brightness;
    }
    
    const avgBrightness = totalBrightness / (data.length / 8);
    const normalizedVariation = faceColorVariation / (data.length / 8);
    
    return {
      avgBrightness,
      normalizedVariation,
      // Lower threshold for brightness detection to detect faces in darker environments
      brightnessFactor: avgBrightness > 5 && avgBrightness < 250,
      // Lower threshold for variation to detect more subtle facial features
      variationFactor: normalizedVariation > 1.2
    };
  }, []);

  return { analyzeBrightness };
};
