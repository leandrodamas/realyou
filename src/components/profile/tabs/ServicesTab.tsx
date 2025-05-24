import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ServiceSchedulingSection from "@/components/profile/ServiceSchedulingSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // Import toast for feedback

interface ServicesTabProps {
  isOwner: boolean;
  targetUserId: string; // Add targetUserId prop
}

const ServicesTab: React.FC<ServicesTabProps> = ({ isOwner, targetUserId }) => {

  const handleNewService = () => {
      // Logic to open a modal or navigate to a new service creation page
      toast.info("Funcionalidade de adicionar novo serviço em desenvolvimento");
  };

  return (
    <TabsContent value="services" className="px-4 pb-4 animate-fade-in">
      {isOwner && (
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-medium">Seus Serviços e Agenda</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={handleNewService} // Add onClick handler
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Serviço
          </Button>
        </div>
      )}
      {/* Pass targetUserId to ServiceSchedulingSection */}
      <ServiceSchedulingSection 
        isOwner={isOwner} 
        targetUserId={targetUserId} // Pass the ID of the profile being viewed
      />
    </TabsContent>
  );
};

export default ServicesTab;

