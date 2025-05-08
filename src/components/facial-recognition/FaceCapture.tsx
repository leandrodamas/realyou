
import React from "react";
import FaceCaptureCamera from "./FaceCaptureCamera";
import SearchResults from "./components/SearchResults";
import FaceCaptureHeader from "./components/FaceCaptureHeader";
import { useFaceCaptureState } from "@/hooks/facial-recognition/useFaceCaptureState";

interface FaceCaptureProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
  isRegistrationMode?: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({
  onCaptureImage,
  capturedImage: externalCapturedImage,
  setCapturedImage: setExternalCapturedImage,
  isCameraActive: externalIsCameraActive,
  setIsCameraActive: setExternalIsCameraActive,
  isRegistrationMode = false,
}) => {
  const {
    isCameraActive,
    capturedImage,
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
  } = useFaceCaptureState({
    onCaptureImage,
    capturedImage: externalCapturedImage,
    setCapturedImage: setExternalCapturedImage,
    isCameraActive: externalIsCameraActive,
    setIsCameraActive: setExternalIsCameraActive,
  });

  return (
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full">
        <FaceCaptureHeader isRegistrationMode={isRegistrationMode} />
        
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          capturedImage={capturedImage}
          onStartCamera={handleStartCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        <SearchResults 
          capturedImage={capturedImage}
          matchedPerson={matchedPerson}
          noMatchFound={noMatchFound}
          connectionSent={connectionSent}
          isSearching={isSearching}
          isRegistrationMode={isRegistrationMode}
          attemptingCameraAccess={attemptingCameraAccess}
          showScheduleDialog={showScheduleDialog}
          onReset={handleReset}
          onSearch={handleSearch}
          onSendConnectionRequest={sendConnectionRequest}
          onShowScheduleDialog={setShowScheduleDialog}
        />
      </div>
    </div>
  );
};

export default FaceCapture;
