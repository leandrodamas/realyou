
import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Post {
  id: number;
  username: string;
  profilePic: string;
  image: string;
  caption: string;
  likes: number;
  timestamp: string;
}

const Feed: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      username: "johndoe",
      profilePic: "/placeholder.svg",
      image: "/placeholder.svg",
      caption: "Beautiful day at the beach! 🌊☀️ #summer #beach",
      likes: 256,
      timestamp: "2h ago"
    },
    {
      id: 2,
      username: "mariasilva",
      profilePic: "/placeholder.svg",
      image: "/placeholder.svg",
      caption: "Just finished this amazing project! #coding #development",
      likes: 128,
      timestamp: "4h ago"
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border-b border-gray-200">
          {/* Post header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <img src={post.profilePic} alt={post.username} />
              </Avatar>
              <span className="font-medium">{post.username}</span>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
          </div>

          {/* Post image */}
          <div className="aspect-square w-full">
            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
          </div>

          {/* Post actions */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Heart className="h-6 w-6" />
                <MessageCircle className="h-6 w-6" />
                <Send className="h-6 w-6" />
              </div>
              <div>
                <Bookmark className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <span className="font-semibold">{post.likes} likes</span>
            </div>
            <div className="mt-1">
              <span className="font-semibold">{post.username}</span>{" "}
              <span>{post.caption}</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-500 text-sm">{post.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
