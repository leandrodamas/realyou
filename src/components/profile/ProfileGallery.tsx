
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  { id: 1, likes: 124, comments: 23, saved: false, liked: false },
  { id: 2, likes: 89, comments: 12, saved: true, liked: false },
  { id: 3, likes: 245, comments: 42, saved: false, liked: true },
  { id: 4, likes: 56, comments: 8, saved: false, liked: false },
  { id: 5, likes: 183, comments: 31, saved: true, liked: true },
  { id: 6, likes: 77, comments: 14, saved: false, liked: false },
];

const ProfileGallery: React.FC = () => {
  const [items, setItems] = useState(posts);

  const toggleLike = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 } : item
    ));
  };

  const toggleSave = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, saved: !item.saved } : item
    ));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {items.map((post) => (
        <motion.div 
          key={post.id}
          variants={item}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="relative aspect-square bg-gray-200">
            <img
              src="/placeholder.svg"
              alt={`Post ${post.id}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:text-red-500"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart 
                    className={`h-5 w-5 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toggleSave(post.id)}
              >
                <Bookmark className={`h-5 w-5 ${post.saved ? 'fill-blue-500 text-blue-500' : ''}`} />
              </Button>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-semibold">{post.likes} likes</span>
              <span className="text-gray-500 ml-3">{post.comments} comments</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileGallery;
