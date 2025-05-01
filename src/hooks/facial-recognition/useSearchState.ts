
import { useState, useRef } from "react";
import { FacialRecognitionState } from "./types";

export const useSearchState = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchAttemptRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);

  const resetState = () => {
    setMatchedPerson(null);
    setNoMatchFound(false);
    setConnectionSent(false);
    setHasError(false);
    setIsSearching(false);
  };

  return {
    isSearching,
    setIsSearching,
    matchedPerson,
    setMatchedPerson,
    noMatchFound,
    setNoMatchFound,
    connectionSent,
    setConnectionSent,
    hasError,
    setHasError,
    searchAttemptRef,
    isMounted,
    resetState
  };
};
