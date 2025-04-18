
import React from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface AchievementCategory {
  id: string;
  name: string;
  public: boolean;
}

interface AchievementsSectionProps {
  achievementCategories: AchievementCategory[];
  selectedAchievements: string[];
  handleAchievementChange: (categoryId: string) => void;
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievementCategories,
  selectedAchievements,
  handleAchievementChange,
  handleSaveSettings,
  fadeIn
}) => {
  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Achievements</h2>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Show my achievements publicly</span>
          <Switch id="show-achievements" defaultChecked />
        </div>
        
        <p className="text-xs text-gray-500">Choose which achievement categories to display on your profile</p>
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            Select Achievement Categories
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Manage Achievement Visibility</DrawerTitle>
            <DrawerDescription>
              Select which achievement categories will be visible on your profile
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {achievementCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`achievement-${category.id}`}
                  checked={selectedAchievements.includes(category.id)}
                  onCheckedChange={() => handleAchievementChange(category.id)}
                />
                <label
                  htmlFor={`achievement-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
            
            <Button size="sm" className="w-full mt-4" onClick={() => {
              handleSaveSettings("Achievement Visibility");
            }}>Save Changes</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </motion.section>
  );
};

export default AchievementsSection;
