
import React from "react";
import { Image, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

interface FriendCategory {
  id: string;
  name: string;
  count: number;
}

interface PhotosAndMediaSectionProps {
  photoPrivacy: string[];
  friendCategories: FriendCategory[];
  handlePhotoPrivacyChange: (categoryId: string) => void;
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const PhotosAndMediaSection: React.FC<PhotosAndMediaSectionProps> = ({
  photoPrivacy,
  friendCategories,
  handlePhotoPrivacyChange,
  handleSaveSettings,
  fadeIn
}) => {
  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Image className="h-5 w-5 text-pink-600" />
        <h2 className="text-lg font-semibold">Photos & Media</h2>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Who Can See My Photos</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Select Friend Groups</h4>
            <p className="text-sm text-gray-500">Choose which friend categories can view your photos</p>
            
            {friendCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`photo-${category.id}`}
                  checked={photoPrivacy.includes(category.id)}
                  onCheckedChange={() => handlePhotoPrivacyChange(category.id)}
                />
                <label
                  htmlFor={`photo-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name} ({category.count})
                </label>
              </div>
            ))}
            
            <Button size="sm" className="w-full mt-2" onClick={() => {
              handleSaveSettings("Photo Privacy");
            }}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center justify-between mt-4 mb-2">
        <span className="text-sm font-medium">Download Original Photos</span>
        <Switch id="download-originals" />
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium">Save to Photo Library</span>
        <Switch id="save-to-library" />
      </div>
    </motion.section>
  );
};

export default PhotosAndMediaSection;
