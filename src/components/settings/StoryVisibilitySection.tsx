
import React from "react";
import { Eye, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FriendCategory {
  id: string;
  name: string;
  count: number;
}

interface StoryVisibilitySectionProps {
  storyVisibility: string;
  setStoryVisibility: React.Dispatch<React.SetStateAction<string>>;
  friendCategories: FriendCategory[];
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const StoryVisibilitySection: React.FC<StoryVisibilitySectionProps> = ({
  storyVisibility,
  setStoryVisibility,
  friendCategories,
  handleSaveSettings,
  fadeIn
}) => {
  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Eye className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Story Visibility</h2>
      </div>

      <RadioGroup value={storyVisibility} onValueChange={setStoryVisibility} className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="story-public" />
          <Label htmlFor="story-public">Everyone</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="friends" id="story-friends" />
          <Label htmlFor="story-friends">Friends Only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="story-custom" />
          <Label htmlFor="story-custom">Custom</Label>
        </div>
      </RadioGroup>

      {storyVisibility === "custom" && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-3">Manage Custom List</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Customize Story Viewers</SheetTitle>
              <SheetDescription>
                Select which friend groups can see your stories.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {friendCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.count} people</p>
                    </div>
                  </div>
                  <Switch id={`enable-${category.id}`} />
                </div>
              ))}
              <Button className="w-full mt-4" onClick={() => {
                toast.success("Custom story visibility updated");
              }}>Save Changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Separator className="my-4" />
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Story Duration</span>
        <span className="text-sm font-medium text-purple-600">24 hours</span>
      </div>
      <Slider 
        defaultValue={[24]} 
        max={48} 
        step={6}
        className="mb-4"
      />

      <Button onClick={() => handleSaveSettings("Story Visibility")} className="w-full">Save Settings</Button>
    </motion.section>
  );
};

export default StoryVisibilitySection;
