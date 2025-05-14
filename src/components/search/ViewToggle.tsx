
import React from "react";
import { Button } from "@/components/ui/button";
import { Layers, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ViewToggleProps {
  view: "map" | "list";
  setView: (view: "map" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  console.log("ViewToggle: Current view:", view);
  
  const handleViewChange = (newView: "map" | "list") => {
    if (newView === view) {
      console.log(`Already in ${newView} view, no change needed`);
      return;
    }
    
    console.log(`Switching to ${newView} view`);
    
    try {
      setView(newView);
      toast.success(`Visualização alterada para ${newView === "map" ? "Mapa 3D" : "Lista"}`);
    } catch (error) {
      console.error("Error changing view:", error);
      toast.error("Erro ao mudar a visualização");
    }
  };
  
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
            onClick={() => handleViewChange("map")}
            data-testid="map-view-toggle"
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
            onClick={() => handleViewChange("list")}
            data-testid="list-view-toggle"
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
