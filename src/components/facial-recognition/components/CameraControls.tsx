
import React from "react";
import { Button } from "@/components/ui/button";
import { FlipHorizontal, SunMedium } from "lucide-react";

interface CameraControlsProps {
  onSwitchCamera: () => void;
  onIncreaseBrightness: () => void;
  onDecreaseBrightness: () => void;
  brightness: number;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onSwitchCamera,
  onIncreaseBrightness,
  onDecreaseBrightness,
  brightness
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full bg-black/50 hover:bg-black/70"
        onClick={onSwitchCamera}
      >
        <FlipHorizontal className="h-4 w-4 text-white" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full bg-yellow-500/70 hover:bg-yellow-500/90"
        onClick={onIncreaseBrightness}
      >
        <SunMedium className="h-4 w-4 text-white" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full bg-gray-700/70 hover:bg-gray-700/90"
        onClick={onDecreaseBrightness}
      >
        <SunMedium className="h-4 w-4 text-white opacity-70" />
      </Button>

      <div className="bg-black/30 rounded-md px-2 py-1 text-xs text-white mt-1">
        <div className="h-1 bg-gray-600 rounded-full w-8">
          <div 
            className="h-1 bg-yellow-400 rounded-full" 
            style={{width: `${(brightness / 2.5) * 100}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CameraControls;
