
import React from "react";
import { Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PrivacySectionProps {
  profileVisibility: string;
  setProfileVisibility: React.Dispatch<React.SetStateAction<string>>;
  faceRecPrivacy: string;
  setFaceRecPrivacy: React.Dispatch<React.SetStateAction<string>>;
  handleSaveSettings: (section: string) => void;
  fadeIn: any;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({
  profileVisibility,
  setProfileVisibility,
  faceRecPrivacy,
  setFaceRecPrivacy,
  handleSaveSettings,
  fadeIn
}) => {
  return (
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
  );
};

export default PrivacySection;
