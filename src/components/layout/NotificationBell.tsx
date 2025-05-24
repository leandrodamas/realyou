import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, isLoading, error } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    // Optionally keep popover open or close based on UX preference
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 font-medium border-b">Notificações</div>
        <ScrollArea className="h-72">
          {isLoading && <p className="p-4 text-sm text-gray-500">Carregando...</p>}
          {error && <p className="p-4 text-sm text-red-600">{error}</p>}
          {!isLoading && !error && notifications.length === 0 && (
            <p className="p-4 text-sm text-gray-500">Nenhuma notificação.</p>
          )}
          {!isLoading && !error && notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b last:border-b-0 ${notification.is_read ? 'opacity-70' : 'bg-blue-50'}`}
            >
              <p className="text-sm mb-1">{notification.message}</p>
              <div className="flex justify-between items-center">
                 <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                 </p>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs text-blue-600 hover:bg-blue-100"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Marcar como lida"
                  >
                    <Check className="h-3 w-3 mr-1" /> Lida
                  </Button>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;

