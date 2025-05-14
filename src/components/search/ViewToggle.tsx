
import React from "react";
import { motion } from "framer-motion";
import { Map, List } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "map";
  setView: (view: "list" | "map") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  const handleViewChange = (newView: "list" | "map") => {
    if (newView === view) return; // Don't change if it's already the active view
    
    console.log(`Changing view from ${view} to ${newView}`);
    setView(newView);
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-medium text-gray-500">Visualização:</div>
      
      <div className="flex items-center bg-gray-100 rounded-full p-1">
        <button
          onClick={() => handleViewChange("list")}
          className={`relative px-3 py-1 rounded-full flex items-center text-xs font-medium transition-colors ${
            view === "list" ? "text-white" : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="list-view-button"
          aria-label="Visualização em lista"
        >
          {view === "list" && (
            <motion.div
              className="absolute inset-0 bg-blue-600 rounded-full"
              layoutId="viewSelection"
              initial={false}
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
          <List className="h-3 w-3 mr-1" />
          <span className="relative z-10">Lista</span>
        </button>
        
        <button
          onClick={() => handleViewChange("map")}
          className={`relative px-3 py-1 rounded-full flex items-center text-xs font-medium transition-colors ${
            view === "map" ? "text-white" : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="map-view-button"
          aria-label="Visualização em mapa"
        >
          {view === "map" && (
            <motion.div
              className="absolute inset-0 bg-blue-600 rounded-full"
              layoutId="viewSelection"
              initial={false}
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
          <Map className="h-3 w-3 mr-1" />
          <span className="relative z-10">Mapa 3D</span>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
