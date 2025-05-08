
import React from "react";
import CameraPreview from "./CameraPreview";
import CameraError from "../CameraError";
import CameraLoading from "./CameraLoading";
import CaptureCanvas from "./CaptureCanvas";

interface CameraContentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
  hasError: boolean;
  hasCamera: boolean;
  errorMessage: string | null;
  errorType: string | null;
  facingMode: "user" | "environment";
  brightness: number;
  onCapture: () => void;
  switchCamera: () => void;
  increaseBrightness: () => void;
  decreaseBrightness: () => void;
  onReset: () => void;
}

const CameraContent: React.FC<CameraContentProps> = ({
  videoRef,
  canvasRef,
  isLoading,
  hasError,
  hasCamera,
  errorMessage,
  errorType,
  facingMode,
  brightness,
  onCapture,
  switchCamera,
  increaseBrightness,
  decreaseBrightness,
  onReset
}) => {
  // Show loading state
  if (isLoading) {
    return <CameraLoading loadingProgress={50} />;
  }

  // Show error or camera preview
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh]">
      {hasError || !hasCamera ? (
        <CameraError 
          onReset={onReset} 
          errorMessage={errorMessage}
          errorType={errorType}
        />
      ) : (
        <>
          <CameraPreview
            videoRef={videoRef}
            faceDetected={true}
            onCapture={onCapture}
            brightness={brightness}
            facingMode={facingMode}
            onSwitchCamera={switchCamera}
            onIncreaseBrightness={increaseBrightness}
            onDecreaseBrightness={decreaseBrightness}
            errorMessage={errorMessage}
          />
          <CaptureCanvas ref={canvasRef} />
        </>
      )}
    </div>
  );
};

export default CameraContent;
