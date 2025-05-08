
import React from "react";
import { AnimatePresence } from "framer-motion";
import NoMatchFound from "../NoMatchFound";
import MatchedPersonCard from "../MatchedPersonCard";
import SearchButton from "../SearchButton";
import ScheduleDialog from "../ScheduleDialog";
import { MatchedPerson } from "../types/MatchedPersonTypes";

interface SearchResultsProps {
  capturedImage: string | null;
  matchedPerson: MatchedPerson | null;
  noMatchFound: boolean;
  connectionSent: boolean;
  isSearching: boolean;
  isRegistrationMode: boolean;
  attemptingCameraAccess: boolean;
  showScheduleDialog: boolean;
  onReset: () => void;
  onSearch: (imageData: string) => void;
  onSendConnectionRequest: () => void;
  onShowScheduleDialog: (show: boolean) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  capturedImage,
  matchedPerson,
  noMatchFound,
  connectionSent,
  isSearching,
  isRegistrationMode,
  attemptingCameraAccess,
  showScheduleDialog,
  onReset,
  onSearch,
  onSendConnectionRequest,
  onShowScheduleDialog
}) => {
  if (!capturedImage) {
    return null;
  }

  return (
    <>
      {capturedImage && !matchedPerson && !noMatchFound && !isRegistrationMode && (
        <SearchButton 
          isSearching={isSearching || attemptingCameraAccess}
          onClick={() => onSearch(capturedImage)}
        />
      )}

      {noMatchFound && (
        <NoMatchFound onReset={onReset} />
      )}

      <AnimatePresence>
        {matchedPerson && (
          <MatchedPersonCard 
            matchedPerson={matchedPerson}
            connectionSent={connectionSent}
            onShowScheduleDialog={() => onShowScheduleDialog(true)}
            onSendConnectionRequest={onSendConnectionRequest}
          />
        )}
      </AnimatePresence>
      
      {showScheduleDialog && matchedPerson && (
        <ScheduleDialog 
          showDialog={showScheduleDialog} 
          matchedPerson={matchedPerson}
          onCloseDialog={() => onShowScheduleDialog(false)}
        />
      )}
    </>
  );
};

export default SearchResults;
