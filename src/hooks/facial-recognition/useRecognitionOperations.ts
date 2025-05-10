
import { useState, useRef, useEffect } from "react";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";
import type { MatchedPerson } from "@/components/facial-recognition/types/MatchedPersonTypes";

export const useRecognitionOperations = (onCaptureImage?: (imageData: string) => void) => {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  const {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    handleSearch,
    sendConnectionRequest,
    setNoMatchFound,
    setMatchedPerson,
    resetState
  } = useFacialRecognition();

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  // Handle image search with the provided image
  const performSearch = async (profileImage: string) => {
    if (onCaptureImage) {
      onCaptureImage(profileImage);
    }
    await handleSearch(profileImage);
  };

  return {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    showScheduleDialog,
    setShowScheduleDialog,
    handleSearch: performSearch,
    sendConnectionRequest,
    setNoMatchFound,
    setMatchedPerson,
    resetState
  };
};
