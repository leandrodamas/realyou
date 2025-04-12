
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const OnboardingItem: React.FC<OnboardingItemProps> = ({
  title,
  description,
  icon: Icon,
  isActive,
  isCompleted,
  onClick
}) => (
  <div 
    className={cn(
      "border rounded-lg p-4 mb-3 transition-all cursor-pointer",
      isActive ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300",
      isCompleted && "bg-green-50 border-green-200"
    )}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className={cn(
        "rounded-full p-2 mr-3",
        isCompleted ? "bg-green-100" : isActive ? "bg-purple-100" : "bg-gray-100"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          isCompleted ? "text-green-600" : isActive ? "text-purple-600" : "text-gray-500"
        )} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {isCompleted && (
        <div className="rounded-full bg-green-100 p-1">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  </div>
);

interface OnboardingSectionProps {
  title: string;
  children: React.ReactNode;
}

export const OnboardingSection: React.FC<OnboardingSectionProps> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);
