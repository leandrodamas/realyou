
import { useCameraHandler } from "./useCameraHandler";
import { useRecognitionOperations } from "./useRecognitionOperations";
import type { UseFaceCaptureStateProps, FaceCaptureState } from "./types/faceCaptureTypes";

export const useFaceCaptureState = ({
  onCaptureImage,
  capturedImage,
  setCapturedImage,
  isCameraActive,
  setIsCameraActive
}: UseFaceCaptureStateProps): FaceCaptureState => {
  // Camera handling logic
  const {
    isCameraActive: isActive,
    capturedImage: image,
    attemptingCameraAccess,
    handleStartCamera,
    handleCapture,
    handleReset,
  } = useCameraHandler(
    isCameraActive,
    setIsCameraActive,
    capturedImage,
    setCapturedImage
  );

  // Recognition operations logic
  const {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    showScheduleDialog,
    setShowScheduleDialog,
    handleSearch,
    sendConnectionRequest,
    setNoMatchFound
  } = useRecognitionOperations(onCaptureImage);

  return {
    isCameraActive: isActive,
    capturedImage: image,
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    showScheduleDialog,
    attemptingCameraAccess,
    handleStartCamera,
    handleCapture,
    handleReset,
    handleSearch,
    sendConnectionRequest,
    setShowScheduleDialog,
    setNoMatchFound
  };
};
