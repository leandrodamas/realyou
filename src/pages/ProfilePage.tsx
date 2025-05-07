
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FloatingActionButton from "@/components/profile/FloatingActionButton";

const ProfilePage: React.FC = () => {
  return (
    <div className="pb-24">
      <ProfilePageHeader />
      <div className="max-w-md mx-auto px-4">
        <ProfileHeader />
        <ProfileTabs />
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default ProfilePage;
