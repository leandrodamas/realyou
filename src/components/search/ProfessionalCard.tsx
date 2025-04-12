
import React from "react";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Calendar, Award, BadgeCheck, Zap, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Professional {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  available: string;
  image: string;
  coordinates?: [number, number];
}

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const { id, name, title, rating, reviews, price, distance, available, image } = professional;
  
  // Determine if professional is available today for urgent booking
  const availableToday = available === "Hoje";
  
  // Determine if this is a top-rated professional
  const isTopRated = rating >= 4.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex">
          {/* Professional image */}
          <div className="w-28 min-w-[7rem] h-full">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Professional info */}
          <div className="p-3 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-gray-600">{title}</p>
              </div>
              
              {isTopRated && (
                <Badge variant="outline" size="sm" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Award className="h-3 w-3 mr-1 text-yellow-500" />
                  Top Pro
                </Badge>
              )}
            </div>
            
            {/* Ratings and stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{rating}</span>
                <span className="ml-1">({reviews})</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{distance} km</span>
              </div>
            </div>
            
            {/* Price and availability */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                {availableToday ? (
                  <Badge variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Disponível hoje
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {available}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Valor</p>
                <p className="font-semibold text-purple-700">R${price}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Clock className="h-3.5 w-3.5 mr-1" />
                Ver agenda
              </Button>
              <Link to={`/profile?id=${id}`} className="flex-1">
                <Button size="sm" className="w-full text-xs bg-purple-600 hover:bg-purple-700">
                  <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                  Ver perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dynamic price indicator */}
        {availableToday && (
          <div className="px-3 py-1.5 bg-purple-50 border-t border-purple-100 flex items-center justify-between text-xs">
            <div className="flex items-center text-purple-700">
              <Clock3 className="h-3 w-3 mr-1" />
              <span>Agendamento urgente disponível</span>
            </div>
            <Badge size="sm" className="bg-purple-100 text-purple-700 border-0">
              +15%
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfessionalCard;
