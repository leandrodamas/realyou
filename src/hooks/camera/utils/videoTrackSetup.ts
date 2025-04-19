
import { AdvancedMediaTrackConstraint } from '../types/cameraConstraints';

export const setupVideoTrack = async (track: MediaStreamTrack): Promise<void> => {
  try {
    await track.applyConstraints({
      advanced: [
        { autoFocus: true } as AdvancedMediaTrackConstraint,
        { exposureMode: "continuous" } as AdvancedMediaTrackConstraint
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
