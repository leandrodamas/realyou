
interface PlatformConfig {
  audio: false;
  video: MediaTrackConstraints | boolean;
}

const createIOSConfig = (facingMode: string = 'user'): PlatformConfig => ({
  audio: false,
  video: {
    facingMode,
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 }
  }
});

const createAndroidConfig = (facingMode: string = 'user', isFirefox: boolean = false): PlatformConfig => ({
  audio: false,
  video: {
    facingMode,
    width: { ideal: isFirefox ? 320 : 640, max: isFirefox ? 640 : 1280 },
    height: { ideal: isFirefox ? 240 : 480, max: isFirefox ? 480 : 720 }
  }
});

export const getPlatformConfigurations = (baseConstraints: MediaStreamConstraints): PlatformConfig[] => {
  const facingMode = typeof baseConstraints.video === 'object' && baseConstraints.video !== null 
    ? (baseConstraints.video as MediaTrackConstraints).facingMode as string || 'user'
    : 'user';
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isFirefox = /Firefox/i.test(navigator.userAgent);
  
  const configs: PlatformConfig[] = [
    // Base config
    baseConstraints as PlatformConfig,
    
    // Basic config with facingMode
    {
      audio: false,
      video: { facingMode }
    },
    
    // Medium resolution
    {
      audio: false,
      video: {
        facingMode,
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    },
    
    // Low resolution
    {
      audio: false,
      video: {
        facingMode,
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    },
    
    // Fallback configs
    { audio: false, video: {} },
    { audio: false, video: true }
  ];

  if (isIOS) {
    configs.unshift(createIOSConfig(facingMode as string));
  } else if (isAndroid) {
    configs.unshift(createAndroidConfig(facingMode as string, isFirefox));
    if (isFirefox) {
      configs.unshift(createAndroidConfig(facingMode as string, true));
    }
  }

  return configs;
};
