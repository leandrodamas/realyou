
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings, ChevronRight } from "lucide-react";

interface StepContentProps {
  step: number;
  username: string;
  setUsername: (username: string) => void;
  capturedImage: string | null;
  handleStartCamera: () => void;
  handleCapture: () => void;
  handleReset: () => void;
  isCameraActive: boolean;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  username,
  setUsername,
  capturedImage,
  handleStartCamera,
  handleCapture,
  handleReset,
  isCameraActive,
}) => {
  return (
    <>
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Add Your Face</h2>
            <p className="text-gray-600 mb-6">
              Your face is your unique identifier on RealYou. Be yourself, be genuine.
            </p>
          </div>
          {/* FaceCapture component is imported from facial-recognition/FaceCapture */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
              <FaceCapture />
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Create Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Tell us a bit about yourself so others can recognize you
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-8 flex items-center justify-center">
              {capturedImage && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100">
                  <img 
                    src={capturedImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
            <p className="text-gray-600 mb-6">
              Control who can find you using face recognition
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Allow Friends to Find Me</h3>
                  <p className="text-sm text-gray-500">People you know can find you by your face</p>
                </div>
                <div className="form-control">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Allow Friend Requests by Face</h3>
                  <p className="text-sm text-gray-500">Let others send you requests by scanning your face</p>
                </div>
                <div className="form-control">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Advanced Privacy</h3>
                  <p className="text-sm text-gray-500">More control over your facial data</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default StepContent;
