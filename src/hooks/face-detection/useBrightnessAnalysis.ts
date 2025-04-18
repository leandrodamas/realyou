
import { useCallback } from 'react';

export const useBrightnessAnalysis = () => {
  const analyzeBrightness = useCallback((centerRegion: ImageData) => {
    const data = centerRegion.data;
    let totalBrightness = 0;
    let faceColorVariation = 0;
    let prevPixel = 0;
    
    // Calculate average brightness and color variation - simplified
    for (let i = 0; i < data.length; i += 16) {
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      totalBrightness += brightness;
      
      if (i > 0) {
        faceColorVariation += Math.abs(prevPixel - brightness);
      }
      prevPixel = brightness;
    }
    
    const avgBrightness = totalBrightness / (data.length / 16);
    const normalizedVariation = faceColorVariation / (data.length / 16);
    
    return {
      avgBrightness,
      normalizedVariation,
      brightnessFactor: avgBrightness > 10 && avgBrightness < 245,
      variationFactor: normalizedVariation > 1.5
    };
  }, []);

  return { analyzeBrightness };
};
