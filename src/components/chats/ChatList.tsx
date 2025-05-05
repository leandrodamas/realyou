
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatUsers, ChatUser } from "@/hooks/useChatUsers";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
  onChatSelect?: (id: string, name: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { users, isLoading } = useChatUsers();

  const handleVideoCall = (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Iniciando chamada de vídeo com usuário ${id}`);
    // Aqui implementaríamos a lógica de chamada de vídeo
  };

  const handleChatClick = (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onChatSelect) {
      onChatSelect(id, name);
    }
  };

  if (isLoading) {
    return (
      <div className="divide-y">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center p-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="mt-1">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Nenhuma conversa encontrada</p>
        <p className="text-sm text-gray-400 mt-1">Conecte-se com profissionais para iniciar conversas</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {users.map((chat) => (
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
