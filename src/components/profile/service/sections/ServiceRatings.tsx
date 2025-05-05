
import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ServiceRatingsProps {
  isOwner?: boolean;
}

const ServiceRatings: React.FC<ServiceRatingsProps> = ({ isOwner = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const ratings = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleGenerateReviews = () => {
    toast.success("Em breve: Gere avaliações com IA");
  };

  return (
    <div className="flex items-start">
      <MessageSquare className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Avaliações</h4>
          <Button variant="ghost" size="sm" onClick={toggleCollapse} className="text-xs">
            {isCollapsed ? "Mostrar detalhes" : "Ocultar detalhes"}
          </Button>
        </div>
        
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="mx-1 font-medium">4.9</span>
          </div>
          <span className="text-sm text-gray-500 mx-2">(132 avaliações)</span>
          <div className="flex items-center text-green-600 text-xs">
            <ThumbsUp className="h-3 w-3 mr-0.5" />
            98% recomendações
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 space-y-2">
            {ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center">
                <div className="w-10 text-xs flex items-center">
                  <span>{rating.stars}</span>
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-0.5" />
                </div>
                <div className="flex-1 mx-2">
                  <Progress value={rating.percentage} className="h-2" />
                </div>
                <div className="w-8 text-right text-xs">{rating.percentage}%</div>
              </div>
            ))}
            
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs mt-2 w-full"
                onClick={handleGenerateReviews}
              >
                <Edit className="h-3 w-3 mr-1" />
                Gerar avaliações com IA
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRatings;
