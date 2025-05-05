
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

export const useChatUsers = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      if (!user) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // In a real app, you would fetch actual chat users and messages from Supabase
        // For now, we'll use placeholder data but with real authentication
        const demoUsers: ChatUser[] = [
          {
            id: "1",
            name: "John Doe",
            lastMessage: "Hey, are you available for a meeting tomorrow?",
            time: "12:30 PM",
            unreadCount: 3,
            avatar: "/placeholder.svg",
            isOnline: true,
          },
          {
            id: "2",
            name: "Maria Silva",
            lastMessage: "I've sent you the files",
            time: "10:45 AM",
            unreadCount: 0,
            avatar: "/placeholder.svg",
            isOnline: true,
          },
          {
            id: "3",
            name: "Alex Johnson",
            lastMessage: "Thanks for your help!",
            time: "Yesterday",
            unreadCount: 0,
            avatar: "/placeholder.svg",
            isOnline: false,
          },
          {
            id: "4",
            name: "Sarah Parker",
            lastMessage: "Let's catch up soon",
            time: "Yesterday",
            unreadCount: 1,
            avatar: "/placeholder.svg",
            isOnline: false,
          },
        ];

        setUsers(demoUsers);
      } catch (error) {
        console.error("Error loading chat users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [user]);

  return { users, isLoading };
};
