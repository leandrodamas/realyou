
import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkItem as WorkItemType } from "../types/gallery";

interface WorkItemProps {
  item: WorkItemType;
}

export const WorkItem: React.FC<WorkItemProps> = ({ item }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative aspect-square bg-gray-100">
        <img
          src={item.image_path}
          alt={item.title || "Trabalho"}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-3">
        {item.title && (
          <h3 className="font-medium mb-1">{item.title}</h3>
        )}
        {item.description && (
          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
