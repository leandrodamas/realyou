
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, GraduationCap, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BusinessCardProps {
  currentPosition: string;
  company: string;
  location: string;
  education: string;
  skills: string[];
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  currentPosition,
  company,
  location,
  education,
  skills,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="h-12 bg-gradient-to-r from-purple-600 to-blue-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Professional Information</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div 
            className="flex items-start"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">{currentPosition}</p>
              <p className="text-sm text-gray-500">{company}</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm">{location}</p>
          </motion.div>

          <motion.div 
            className="flex items-start"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm">{education}</p>
          </motion.div>

          <div>
            <div className="flex items-start mb-3">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <p className="font-medium">Skills</p>
            </div>
            <div className="flex flex-wrap gap-2 ml-12">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer transition-colors">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
