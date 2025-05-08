
/**
 * Video element setup functionality refactored into smaller modules
 */
import { forceVideoPlaybackAfterTimeout, ensureVideoPlaying } from './videoPlaybackHelpers';
import { setupVideoElement } from './videoElementCore';
import { waitForVideoReady } from './videoReadinessCheck';

// Re-export the functions from their respective modules
export { setupVideoElement, ensureVideoPlaying, waitForVideoReady };

// Export any additional required functions
export const initializeVideoPlayback = (video: HTMLVideoElement, stream: MediaStream): void => {
  setupVideoElement(video, stream);
  forceVideoPlaybackAfterTimeout(video);
};
