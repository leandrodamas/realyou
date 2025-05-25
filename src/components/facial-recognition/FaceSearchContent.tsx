
import React from "react";
import { Loader2 } from "lucide-react";
import FaceCapture from "./FaceCapture";
import MatchedPersonCard from "./MatchedPersonCard";
import NoMatchFound from "./NoMatchFound";
import { MatchedPerson } from "./types/MatchedPersonTypes";

interface FaceSearchContentProps {
  isSearching: boolean;
  matchedPerson: MatchedPerson | null;
  noMatchFound: boolean;
  connectionSent: boolean;
  onCaptureComplete: (imageData: string) => void;
  onSendConnectionRequest: () => void;
  onShowScheduleDialog: () => void;
  onReset: () => void;
}

const FaceSearchContent: React.FC<FaceSearchContentProps> = ({
  isSearching,
  matchedPerson,
  noMatchFound,
  connectionSent,
  onCaptureComplete,
  onSendConnectionRequest,
  onShowScheduleDialog,
  onReset,
}) => {
  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
      <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
        {!matchedPerson && !noMatchFound && !isSearching && (
          <FaceCapture onCaptureComplete={onCaptureComplete} />
        )}

        {isSearching && (
          <div className="flex flex-col items-center justify-center p-10 h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600">Buscando correspondência...</p>
          </div>
        )}

        {matchedPerson && !isSearching && (
          <MatchedPersonCard
            matchedPerson={matchedPerson}
            connectionSent={connectionSent}
            onSendConnectionRequest={onSendConnectionRequest}
            onShowScheduleDialog={onShowScheduleDialog}
          />
        )}

        {noMatchFound && !isSearching && (
          <NoMatchFound onReset={onReset} />
        )}
      </div>
    </div>
  );
};

export default FaceSearchContent;
