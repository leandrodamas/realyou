
import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  progress: number;
  pointsEarned: number;
  totalPoints: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  progress, 
  pointsEarned, 
  totalPoints 
}) => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">Progresso do Perfil</h2>
        <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
          <span>{pointsEarned} pontos</span>
        </Badge>
      </div>
      
      <div className="mb-2">
        <Progress
          value={progress}
          className={cn(
            "h-2",
            progress < 30 ? "bg-red-100" : 
            progress < 70 ? "bg-amber-100" : 
            "bg-green-100"
          )}
          indicatorClassName={cn(
            progress < 30 ? "bg-red-500" : 
            progress < 70 ? "bg-amber-500" : 
            "bg-green-500"
          )}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Iniciante</span>
        <span>Completo</span>
      </div>
      
      <div className="mt-2 text-sm text-center">
        <span className="font-medium">{pointsEarned}</span> de <span className="font-medium">{totalPoints}</span> pontos • <span className="font-medium">{progress}%</span> completo
      </div>
    </div>
  );
};

export default OnboardingProgress;
