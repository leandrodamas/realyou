
export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const getDeviceConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.5 : 0.6;
};

export const getMatchConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.65 : 0.75;
};
