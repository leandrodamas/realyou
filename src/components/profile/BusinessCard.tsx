
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, GraduationCap, Award } from "lucide-react";

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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <Briefcase className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">{currentPosition}</p>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>

        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-sm">{location}</p>
        </div>

        <div className="flex items-start">
          <GraduationCap className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
          <p className="text-sm">{education}</p>
        </div>

        <div>
          <div className="flex items-start mb-2">
            <Award className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
            <p className="font-medium">Skills</p>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
