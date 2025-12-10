import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Friendship, DebtNotification } from '@/types/social';

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [notifications, setNotifications] = useState<DebtNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch accepted friendships
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${user.id},friend_user_id.eq.${user.id}`)
        .eq('status', 'accepted');

      // Fetch pending requests where I'm the receiver
      const { data: pending } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_user_id', user.id)
        .eq('status', 'pending');

      // Fetch notifications
      const { data: notifs } = await supabase
        .from('debt_notifications')
        .select('*')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false });

      // Get friend profiles
      if (friendships) {
        const friendIds = friendships.map(f => 
          f.user_id === user.id ? f.friend_user_id : f.user_id
        );
        
        if (friendIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, display_name')
            .in('user_id', friendIds);

          const mapped: Friendship[] = friendships.map(f => {
            const friendId = f.user_id === user.id ? f.friend_user_id : f.user_id;
            const profile = profiles?.find(p => p.user_id === friendId);
            return {
              ...f,
              status: f.status as 'pending' | 'accepted' | 'rejected',
              friend_display_name: profile?.display_name || 'Usuário',
            };
          });
          setFriends(mapped);
        } else {
          setFriends([]);
        }
      }

      // Get pending request sender profiles
      if (pending && pending.length > 0) {
        const senderIds = pending.map(p => p.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', senderIds);

        const mapped: Friendship[] = pending.map(p => {
          const profile = profiles?.find(pr => pr.user_id === p.user_id);
          return {
            ...p,
            status: p.status as 'pending' | 'accepted' | 'rejected',
            friend_display_name: profile?.display_name || 'Usuário',
          };
        });
        setPendingRequests(mapped);
      } else {
        setPendingRequests([]);
      }

      // Enrich notifications with debt and sender info
      if (notifs && notifs.length > 0) {
        const senderIds = [...new Set(notifs.map(n => n.from_user_id))];
        const debtIds = [...new Set(notifs.map(n => n.debt_id))];

        const [profilesRes, debtsRes] = await Promise.all([
          supabase.from('profiles').select('user_id, display_name').in('user_id', senderIds),
          supabase.from('debts').select('id, description, amount, categories(name)').in('id', debtIds),
        ]);

        const mapped = notifs.map(n => {
          const profile = profilesRes.data?.find(p => p.user_id === n.from_user_id);
          const debt = debtsRes.data?.find((d: any) => d.id === n.debt_id);
          return {
            ...n,
            from_user_name: profile?.display_name || 'Usuário',
            debt_description: debt?.description || 'Dívida',
            debt_amount: debt?.amount,
            debt_category: (debt as any)?.categories?.name,
          };
        });
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('debt-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'debt_notifications',
          filter: `to_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New notification received:', payload);
          fetchData(); // Refetch to get full notification data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchData]);

  const searchUserByEmail = async (email: string) => {
    if (!email.trim()) return null;

    // First get auth user by querying profiles (we can't query auth.users directly)
    // We need an edge function or a different approach
    // For now, we'll search in profiles and hope they have the same email
    
    // Actually, we need to create a function to search users
    // Let's return null for now and create an edge function
    return null;
  };

  const sendFriendRequest = async (friendUserId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_user_id: friendUserId,
        status: 'pending',
      });

    if (error) throw error;
    await fetchData();
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) throw error;
    await fetchData();
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'rejected' })
      .eq('id', friendshipId);

    if (error) throw error;
    await fetchData();
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
    await fetchData();
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('debt_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('debt_notifications')
      .update({ is_read: true })
      .eq('to_user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    friends,
    pendingRequests,
    notifications,
    unreadCount,
    loading,
    searchUserByEmail,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refetch: fetchData,
  };
}
