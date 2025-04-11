
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const BusinessCardHeader: React.FC = () => {
  return (
    <>
      <div className="h-12 bg-gradient-to-r from-purple-600 to-blue-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Informações Profissionais</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4 text-gray-500" />
          </Button>
        </CardTitle>
      </CardHeader>
    </>
  );
};

export default BusinessCardHeader;
