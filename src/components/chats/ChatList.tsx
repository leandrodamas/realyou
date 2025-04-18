
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

interface ChatListProps {
  onChatSelect?: (id: number, name: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const chats: Chat[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, are you available for a meeting tomorrow?",
      time: "12:30 PM",
      unreadCount: 3,
      avatar: "/placeholder.svg",
      isOnline: true,
    },
    {
      id: 2,
      name: "Maria Silva",
      lastMessage: "I've sent you the files",
      time: "10:45 AM",
      unreadCount: 0,
      avatar: "/placeholder.svg",
      isOnline: true,
    },
    {
      id: 3,
      name: "Alex Johnson",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
      unreadCount: 0,
      avatar: "/placeholder.svg",
      isOnline: false,
    },
    {
      id: 4,
      name: "Sarah Parker",
      lastMessage: "Let's catch up soon",
      time: "Yesterday",
      unreadCount: 1,
      avatar: "/placeholder.svg",
      isOnline: false,
    },
  ];

  const handleVideoCall = (id: number, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Iniciando chamada de vídeo com usuário ${id}`);
    // Aqui implementaríamos a lógica de chamada de vídeo
  };

  const handleChatClick = (id: number, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onChatSelect) {
      onChatSelect(id, name);
    }
  };

  return (
    <div className="divide-y">
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
          onClick={(e) => handleChatClick(chat.id, chat.name, e)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <img src={chat.avatar} alt={chat.name} className="object-cover" />
            </Avatar>
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{chat.name}</h3>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-600 truncate max-w-[200px]">{chat.lastMessage}</p>
              <div className="flex items-center space-x-2">
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    {chat.unreadCount}
                  </span>
                )}
                {chat.isOnline && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-green-500 h-8 w-8" 
                    onClick={(e) => handleVideoCall(chat.id, chat.name, e)}
                  >
                    <Video className="h-4 w-4" />
                    <span className="sr-only">Chamada de vídeo com {chat.name}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
