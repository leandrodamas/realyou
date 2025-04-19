
import { AdvancedMediaTrackConstraint } from '../types/cameraConstraints';

export const setupVideoTrack = async (track: MediaStreamTrack): Promise<void> => {
  try {
    // Use type assertion to tell TypeScript this is valid
    await track.applyConstraints({
      advanced: [
        { autoFocus: true } as unknown as MediaTrackConstraintSet,
        { exposureMode: "continuous" } as unknown as MediaTrackConstraintSet
      ]
    });
  } catch (e) {
    console.log("Advanced constraints not supported:", e);
  }
};

export const logTrackDetails = (track: MediaStreamTrack): void => {
  console.log("Video track details:", {
    label: track.label,
    id: track.id,
    enabled: track.enabled,
    readyState: track.readyState
  });
};
