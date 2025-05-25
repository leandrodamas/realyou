
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

// Define a more specific notification type structure
export interface Notification {
  id: string;
  user_id: string; // The user receiving the notification
  type: 'connection_request' | 'new_message' | 'scheduling_request' | 'other';
  message: string; // Pre-formatted message for display
  related_user_id?: string; // e.g., sender of message or connection request
  related_entity_id?: string; // e.g., chat_id, appointment_id
  created_at: string;
  is_read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Helper to get sender name (replace with actual logic if needed)
async function getSenderName(userId?: string): Promise<string> {
  if (!userId) return 'Alguém';
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    if (error || !data) return 'Alguém';
    return data.full_name || 'Alguém';
  } catch {
    return 'Alguém';
  }
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        // Cast data to Notification[] since we know the structure matches
        const typedNotifications = data.map(notification => ({
          ...notification,
          type: notification.type as 'connection_request' | 'new_message' | 'scheduling_request' | 'other'
        }));
        setNotifications(typedNotifications);
        setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError('Falha ao carregar notificações.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to real-time changes for different notification types
  useEffect(() => {
    if (!user) return;

    const handleNewNotification = async (payload: any) => {
      console.log('New notification payload:', payload);
      const newNotification = payload.new as Notification;

      // Ensure notification is for the current user (double check filter)
      if (newNotification.user_id !== user.id) {
          console.warn("Received notification for wrong user:", newNotification);
          return;
      }

      // Generate user-friendly message based on type
      let displayMessage = newNotification.message || 'Você tem uma nova notificação!';

      try {
          if (newNotification.type === 'connection_request') {
            const senderName = await getSenderName(newNotification.related_user_id);
            displayMessage = `${senderName} enviou uma solicitação de conexão.`;
          } else if (newNotification.type === 'new_message') {
            const senderName = await getSenderName(newNotification.related_user_id);
            displayMessage = `Nova mensagem de ${senderName}.`;
          } else if (newNotification.type === 'scheduling_request') {
            const senderName = await getSenderName(newNotification.related_user_id);
            displayMessage = `${senderName} solicitou um agendamento.`;
          }
      } catch (e) {
          console.error("Error processing notification details:", e);
      }

      // Update state
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + (newNotification.is_read ? 0 : 1)); // Only increment if unread

      // Show toast only for unread notifications
      if (!newNotification.is_read) {
          toast.info(displayMessage);
      }
    };

    // Subscribe to the notifications table directly
    const notificationChannel = supabase
      .channel(`public:notifications:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        handleNewNotification
      )
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Subscribed to notifications channel!');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Notifications subscription error:', status, err);
            setError('Erro na conexão de notificações em tempo real.');
            toast.error('Erro na conexão de notificações.');
          }
      });

    // Cleanup function
    return () => {
      supabase.removeChannel(notificationChannel).catch(err => console.error("Error removing channel:", err));
      console.log('Unsubscribed from notifications channel.');
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    // Find the notification first to avoid unnecessary updates
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.is_read) {
        return; // Already read or not found
    }

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id); // Ensure user can only update their own

      if (updateError) throw updateError;

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast.error('Erro ao marcar notificação como lida.');
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    isLoading,
    error,
  };
};
