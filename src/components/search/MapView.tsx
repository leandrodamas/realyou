
import React from "react";
import { Professional } from "@/types/Professional";
import ThreeDMap from "./ThreeDMap";

interface MapViewProps {
  professionals: Professional[];
  isLoading: boolean;
}

const MapView: React.FC<MapViewProps> = ({ professionals, isLoading }) => {
  // Log when map view is rendered
  React.useEffect(() => {
    console.log("MapView rendered with professionals:", professionals.length);
  }, [professionals]);

  return (
    <div className="relative h-[calc(100vh-180px)] mt-2 overflow-hidden" data-testid="map-view">
      <ThreeDMap professionals={professionals} />
    </div>
  );
};

export default MapView;
