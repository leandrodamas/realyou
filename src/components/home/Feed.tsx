
import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Smile } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface Post {
  id: number;
  username: string;
  profilePic: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  saved: boolean;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "johndoe",
      profilePic: "/placeholder.svg",
      image: "/placeholder.svg",
      caption: "Beautiful day at the beach! 🌊☀️ #summer #beach",
      likes: 256,
      comments: 42,
      timestamp: "2h ago",
      liked: false,
      saved: false
    },
    {
      id: 2,
      username: "mariasilva",
      profilePic: "/placeholder.svg",
      image: "/placeholder.svg",
      caption: "Just finished this amazing project! #coding #development",
      likes: 128,
      comments: 24,
      timestamp: "4h ago",
      liked: true,
      saved: false
    }
  ]);

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { 
        ...post, 
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1 
      } : post
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } }
  };

  return (
    <motion.div 
      className="space-y-6 pb-20 mt-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div 
          key={post.id} 
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-4"
          variants={item}
        >
          {/* Post header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9 border border-gray-200">
                <img src={post.profilePic} alt={post.username} className="object-cover" />
              </Avatar>
              <div>
                <span className="font-medium text-sm">{post.username}</span>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Post image */}
          <div className="aspect-square w-full relative">
            <motion.img 
              src={post.image} 
              alt="Post" 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              whileTap={{ scale: 0.9 }}
            >
              <motion.button
                onClick={() => toggleLike(post.id)}
                whileTap={{ scale: 1.5 }}
                className="focus:outline-none"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className={`text-white ${post.liked ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Heart className="h-20 w-20 drop-shadow-lg" fill={post.liked ? "#ef4444" : "none"} />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>

          {/* Post actions */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart 
                    className={`h-6 w-6 ${post.liked ? "text-red-500 fill-red-500" : "text-gray-700"}`} 
                  />
                </motion.button>
                <motion.button whileTap={{ scale: 0.8 }}>
                  <MessageCircle className="h-6 w-6 text-gray-700" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.8 }}>
                  <Send className="h-6 w-6 text-gray-700" />
                </motion.button>
              </div>
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleSave(post.id)}
              >
                <Bookmark 
                  className={`h-6 w-6 ${post.saved ? "text-amber-500 fill-amber-500" : "text-gray-700"}`} 
                />
              </motion.button>
            </div>
            
            <div className="mt-3">
              <span className="font-semibold">{post.likes.toLocaleString()} likes</span>
            </div>
            
            <div className="mt-1">
              <span className="font-semibold">{post.username}</span>{" "}
              <span className="text-sm">{post.caption}</span>
            </div>
            
            <button className="mt-1 text-gray-500 text-sm">
              View all {post.comments} comments
            </button>
            
            <div className="mt-3 flex items-center border-t pt-3">
              <Smile className="h-5 w-5 text-gray-500 mr-2" />
              <Input 
                className="bg-transparent border-none text-sm p-0 h-auto focus-visible:ring-0" 
                placeholder="Add a comment..."
              />
              <button className="text-blue-500 font-medium text-sm ml-auto">Post</button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Feed;
