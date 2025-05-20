
import React from "react";
import PublicToggle from "../service/PublicToggle";
import MarketingPrompt from "../service/MarketingPrompt";

interface ScheduleServiceControlsProps {
  isOwner: boolean;
  showPublicly: boolean;
  setShowPublicly: (value: boolean) => void;
  isPromptVisible: boolean;
  setIsPromptVisible: (value: boolean) => void;
}

const ScheduleServiceControls: React.FC<ScheduleServiceControlsProps> = ({
  isOwner,
  showPublicly,
  setShowPublicly,
  isPromptVisible,
  setIsPromptVisible
}) => {
  if (!isOwner) return null;
  
  return (
    <>
      <PublicToggle 
        showPublicly={showPublicly} 
        onChange={setShowPublicly} 
      />
      
      {isPromptVisible && (
        <MarketingPrompt 
          isPromptVisible={isPromptVisible} 
          onDismiss={() => setIsPromptVisible(false)} 
        />
      )}
    </>
  );
};

export default ScheduleServiceControls;
