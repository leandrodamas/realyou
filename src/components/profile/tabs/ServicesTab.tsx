
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ServiceSchedulingSection from "@/components/profile/ServiceSchedulingSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ServicesTabProps {
  isOwner: boolean;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ isOwner }) => {
  return (
    <TabsContent value="services" className="px-4 pb-4 animate-fade-in">
      {isOwner && (
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-medium">Seus Serviços</h3>
          <Button variant="outline" size="sm" className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            Novo Serviço
          </Button>
        </div>
      )}
      <ServiceSchedulingSection isOwner={isOwner} />
    </TabsContent>
  );
};

export default ServicesTab;
