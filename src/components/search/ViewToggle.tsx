
import React from "react";
import { Button } from "@/components/ui/button";
import { Layers, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "map" | "list";
  setView: (view: "map" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  console.log("ViewToggle: Current view:", view);
  
  return (
    <div className="bg-white border-b">
      <div className="flex justify-center p-2">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full",
              view === "map" && "bg-white shadow-sm"
            )}
            onClick={() => {
              console.log("Switching to map view");
              setView("map");
            }}
          >
            <Layers className="h-4 w-4 mr-1" />
            Mapa 3D
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full",
              view === "list" && "bg-white shadow-sm"
            )}
            onClick={() => {
              console.log("Switching to list view");
              setView("list");
            }}
          >
            <Users className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
