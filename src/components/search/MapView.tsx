
import React from "react";
import { Professional } from "@/types/Professional";
import ThreeDMap from "./ThreeDMap";
import LoadingView from "./map3d/LoadingView";
import EmptyStateView from "./map3d/EmptyStateView";
import { use3DMap } from "./map3d/use3DMap";

interface MapViewProps {
  professionals: Professional[];
}

const MapView: React.FC<MapViewProps> = ({ professionals }) => {
  const { isLoading, handleBecomeProfessional } = use3DMap(professionals);

  if (isLoading) {
    return <LoadingView />;
  }

  if (!professionals || professionals.length === 0) {
    console.log("Nenhum profissional encontrado, exibindo EmptyStateView");
    return <EmptyStateView onBecomeProfessional={handleBecomeProfessional} />;
  }

  return <ThreeDMap professionals={professionals} />;
};

export default MapView;
