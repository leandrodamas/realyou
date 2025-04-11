
import React, { useState } from "react";
import { 
  Settings, Shield, Bell, Trophy, Eye, Image, ChevronRight,
  Moon, Sun, Languages, LogOut, Lock, Users, UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Define the friend categories for visibility settings
const friendCategories = [
  { id: "close-friends", name: "Close Friends", count: 12 },
  { id: "family", name: "Family", count: 8 },
  { id: "coworkers", name: "Coworkers", count: 15 },
  { id: "college", name: "College", count: 23 },
];

// Define the achievement categories
const achievementCategories = [
  { id: "connections", name: "Connections", public: true },
  { id: "content", name: "Content Creation", public: true },
  { id: "skills", name: "Skills Verification", public: false },
  { id: "activity", name: "Activity Streaks", public: true },
  { id: "exclusives", name: "Exclusive Badges", public: false },
];

const SettingsPage: React.FC = () => {
  // State for various settings
  const [darkMode, setDarkMode] = useState(false);
  const [storyVisibility, setStoryVisibility] = useState("friends");
  const [photoPrivacy, setPhotoPrivacy] = useState(["close-friends", "family"]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [faceRecPrivacy, setFaceRecPrivacy] = useState("friends-only");
  const [selectedAchievements, setSelectedAchievements] = useState(
    achievementCategories.filter(cat => cat.public).map(cat => cat.id)
  );

  // Function to handle saving settings
  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  // Function to handle checkbox changes for photo privacy
  const handlePhotoPrivacyChange = (categoryId: string) => {
    setPhotoPrivacy(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Function to handle checkbox changes for achievement visibility
  const handleAchievementChange = (categoryId: string) => {
    setSelectedAchievements(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
        <Link to="/profile" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5 text-gray-500 rotate-180" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Settings</h1>
        </Link>
        <Button variant="ghost" onClick={() => handleSaveSettings("All")} size="sm">
          Save All
        </Button>
      </header>

      <div className="container max-w-md mx-auto p-4">
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Privacy Section */}
          <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Privacy</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="profile-visibility">
                <AccordionTrigger className="py-3">Profile Visibility</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="profile-public" />
                      <Label htmlFor="profile-public">Public (Anyone can see)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends" id="profile-friends" />
                      <Label htmlFor="profile-friends">Friends Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="profile-private" />
                      <Label htmlFor="profile-private">Private (Only you)</Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={() => handleSaveSettings("Profile Visibility")} size="sm" className="mt-3">Save</Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="face-recognition">
                <AccordionTrigger className="py-3">Face Recognition Privacy</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={faceRecPrivacy} onValueChange={setFaceRecPrivacy} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anyone" id="face-anyone" />
                      <Label htmlFor="face-anyone">Anyone can recognize me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends-only" id="face-friends" />
                      <Label htmlFor="face-friends">Only my friends can recognize me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled" id="face-disabled" />
                      <Label htmlFor="face-disabled">Disable face recognition</Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={() => handleSaveSettings("Face Recognition")} size="sm" className="mt-3">Save</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.section>

          {/* Story Visibility */}
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

          {/* Photos and Media */}
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

          {/* Achievement Settings */}
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

          {/* Notifications */}
          <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Enable All Notifications</span>
              <Switch 
                id="enable-notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            {notificationsEnabled && (
              <div className="space-y-4">
                <ToggleGroup type="multiple" className="justify-start flex-wrap gap-2">
                  <ToggleGroupItem value="messages">Messages</ToggleGroupItem>
                  <ToggleGroupItem value="mentions">Mentions</ToggleGroupItem>
                  <ToggleGroupItem value="friend-requests">Friend Requests</ToggleGroupItem>
                  <ToggleGroupItem value="comments">Comments</ToggleGroupItem>
                  <ToggleGroupItem value="likes">Likes</ToggleGroupItem>
                </ToggleGroup>
                
                <Button onClick={() => handleSaveSettings("Notifications")} size="sm">Save Preferences</Button>
              </div>
            )}
          </motion.section>

          {/* Theme Toggle */}
          <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? 
                  <Moon className="h-5 w-5 text-indigo-600" /> :
                  <Sun className="h-5 w-5 text-amber-500" />
                }
                <h2 className="text-lg font-semibold">Theme</h2>
              </div>
              <Switch 
                checked={darkMode}
                onCheckedChange={() => {
                  setDarkMode(!darkMode);
                  toast.success(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
                }}
              />
            </div>
          </motion.section>

          {/* Logout Button */}
          <motion.div variants={fadeIn}>
            <Button variant="destructive" className="w-full" onClick={() => toast.info("Logged out successfully")}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
