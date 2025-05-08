
import React from "react";
import IntroSection from "./IntroSection";
import CapturedImageView from "./CapturedImageView";

interface IntroContainerProps {
  isCameraActive: boolean;
  capturedImage: string | null;
  onStartCamera: () => void;
  onReset: () => void;
}

const IntroContainer: React.FC<IntroContainerProps> = ({
  isCameraActive,
  capturedImage,
  onStartCamera,
  onReset
}) => {
  // If camera is not active and no captured image, show the intro section
  if (!isCameraActive && !capturedImage) {
    console.log("IntroContainer: Exibindo IntroSection");
    return <IntroSection onStartCamera={onStartCamera} />;
  }

  // If there's a captured image, show it
  if (capturedImage) {
    return <CapturedImageView imageUrl={capturedImage} onReset={onReset} />;
  }

  // This is a fallback, but it shouldn't happen with the current logic
  return null;
};

export default IntroContainer;
