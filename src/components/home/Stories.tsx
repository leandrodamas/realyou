
import React from "react";
import { Avatar } from "@/components/ui/avatar";

interface Story {
  id: number;
  username: string;
  profilePic: string;
  viewed: boolean;
}

const Stories: React.FC = () => {
  const stories: Story[] = [
    { id: 1, username: "You", profilePic: "/placeholder.svg", viewed: false },
    { id: 2, username: "John", profilePic: "/placeholder.svg", viewed: false },
    { id: 3, username: "Maria", profilePic: "/placeholder.svg", viewed: true },
    { id: 4, username: "Alex", profilePic: "/placeholder.svg", viewed: false },
    { id: 5, username: "Sarah", profilePic: "/placeholder.svg", viewed: true },
    { id: 6, username: "Robert", profilePic: "/placeholder.svg", viewed: false },
  ];

  return (
    <div className="relative overflow-x-auto py-4">
      <div className="flex space-x-4 px-4">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center">
            <div
              className={`${
                story.id === 1
                  ? "p-0.5 border border-dashed border-whatsapp rounded-full"
                  : story.viewed
                  ? "p-0.5 border border-gray-300 rounded-full"
                  : "p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full"
              }`}
            >
              <Avatar className="w-16 h-16 border-2 border-white">
                <img
                  src={story.profilePic}
                  alt={story.username}
                  className="object-cover"
                />
              </Avatar>
              {story.id === 1 && (
                <div className="absolute bottom-0 right-0 bg-whatsapp rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-xs mt-1">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
