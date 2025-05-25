
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ServiceSchedulingSection from "@/components/profile/ServiceSchedulingSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ServicesTabProps {
  isOwner: boolean;
  targetUserId: string;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ isOwner, targetUserId }) => {
  const handleNewService = () => {
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
            onClick={handleNewService}
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Serviço
          </Button>
        </div>
      )}
      {/* ServiceSchedulingSection doesn't need targetUserId prop according to its interface */}
      <ServiceSchedulingSection isOwner={isOwner} />
    </TabsContent>
  );
};

export default ServicesTab;
