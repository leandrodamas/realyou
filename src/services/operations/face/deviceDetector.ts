
/**
 * Detects if current device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Gets appropriate confidence threshold based on device type
 */
export const getDeviceConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.5 : 0.6;
};

/**
 * Gets match confidence threshold based on device type
 */
export const getMatchConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.65 : 0.75;
};
