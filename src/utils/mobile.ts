
/**
 * Centralized mobile utilities for device detection and optimizations
 */

// Basic mobile device detection
export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Check if device is iOS
export const isIOSDevice = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Check if device is Android
export const isAndroidDevice = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

// Get device type for more specific targeting
export const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  if (isIOSDevice()) return 'ios';
  if (isAndroidDevice()) return 'android';
  return 'desktop';
};

// Get device confidence threshold based on device type
export const getDeviceConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.5 : 0.6;
};

// Get match confidence threshold based on device type
export const getMatchConfidenceThreshold = (): number => {
  return isMobileDevice() ? 0.65 : 0.75;
};

// Get optimal camera settings for the current device
export const getOptimalCameraSettings = () => {
  const deviceType = getDeviceType();
  
  const baseSettings = {
    audio: false,
    video: {
      facingMode: 'user',
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 }
    }
  };
  
  if (deviceType === 'ios') {
    return {
      ...baseSettings,
      video: {
        ...baseSettings.video,
        width: { ideal: 640, max: 1280 },
        height: { ideal: 480, max: 720 }
      }
    };
  } else if (deviceType === 'android') {
    const isFirefox = /Firefox/i.test(navigator.userAgent);
    return {
      ...baseSettings,
      video: {
        ...baseSettings.video,
        width: { ideal: isFirefox ? 320 : 640, max: isFirefox ? 640 : 1280 },
        height: { ideal: isFirefox ? 240 : 480, max: isFirefox ? 480 : 720 }
      }
    };
  }
  
  return baseSettings;
};

// Apply mobile-specific DOM adjustments
export const applyMobileOptimizations = (): void => {
  if (isMobileDevice()) {
    document.documentElement.classList.add('mobile');
    
    // Handle viewport for iOS Safari to prevent zooming
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
    
    // Handle safe area for notched phones
    document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
  }
};

// Enhanced mobile hook with breakpoint
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = React.useState<boolean>(isMobileDevice());
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile,
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
    deviceType: getDeviceType()
  };
};
