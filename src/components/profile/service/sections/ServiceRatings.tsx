
import React, { useState } from "react";
import { Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ServiceRatingsProps {
  totalRatings?: number;
  averageRating?: number;
}

const ServiceRatings: React.FC<ServiceRatingsProps> = ({
  totalRatings = 132,
  averageRating = 4.9
}) => {
  const [showReviews, setShowReviews] = useState(false);

  const ratingStats = {
    "5": 87,
    "4": 10,
    "3": 2,
    "2": 1,
    "1": 0,
  };

  const reviews = [
    { name: "Marcela S.", rating: 5, comment: "Excelente profissional! Super recomendo.", date: "há 2 dias" },
    { name: "João P.", rating: 4, comment: "Ótimo serviço, pontual e eficiente.", date: "há 1 semana" },
    { name: "Ana C.", rating: 5, comment: "Incrível! Resolveu meu problema rapidamente.", date: "há 3 semanas" },
  ];

  const toggleReviews = () => setShowReviews(!showReviews);

  return (
    <div className="flex items-start">
      <Users className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
      <div>
        <h4 className="font-medium">Avaliações</h4>
        <div className="flex items-center mt-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <span className="text-sm ml-2">{averageRating} ({totalRatings} avaliações)</span>
        </div>
        
        {!showReviews ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-purple-600 -ml-2" 
            onClick={toggleReviews}
          >
            Ver avaliações
          </Button>
        ) : (
          <div className="animate-fade-in">
            <div className="space-y-1 mb-2">
              {Object.entries(ratingStats).map(([rating, percentage]) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="w-4 text-xs text-right">{rating}</div>
                  <Progress value={percentage} className="h-1.5" />
                  <div className="text-xs text-gray-500 w-6">{percentage}%</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mt-3">
              {reviews.map((review, index) => (
                <div key={index} className="border-t pt-2 border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{review.name}</span>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mt-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-2.5 w-2.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-600 -ml-2 mt-2" 
              onClick={toggleReviews}
            >
              Esconder avaliações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRatings;
