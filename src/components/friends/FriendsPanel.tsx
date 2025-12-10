import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  Trash2,
  Loader2,
  Bell,
  Mail
} from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function FriendsPanel() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    id: string;
    email: string;
    display_name: string;
  } | null>(null);
  const [removeFriendId, setRemoveFriendId] = useState<string | null>(null);

  const {
    friends,
    pendingRequests,
    notifications,
    unreadCount,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useFriends();

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('search-user-by-email', {
        body: { email: searchEmail.trim() },
      });

      if (error) throw error;

      if (data.found && data.user) {
        setSearchResult(data.user);
      } else if (data.error) {
        toast.error(data.error);
      } else {
        toast.info('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erro ao buscar usuário');
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;

    try {
      await sendFriendRequest(searchResult.id);
      toast.success('Solicitação enviada!');
      setSearchResult(null);
      setSearchEmail('');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Solicitação já enviada');
      } else {
        toast.error('Erro ao enviar solicitação');
      }
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await acceptFriendRequest(id);
      toast.success('Amigo adicionado!');
    } catch (error) {
      toast.error('Erro ao aceitar solicitação');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await rejectFriendRequest(id);
      toast.info('Solicitação rejeitada');
    } catch (error) {
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  const handleRemoveFriend = async () => {
    if (!removeFriendId) return;
    try {
      await removeFriend(removeFriendId);
      toast.success('Amigo removido');
      setRemoveFriendId(null);
    } catch (error) {
      toast.error('Erro ao remover amigo');
    }
  };

  if (loading) {
    return (
      <Card className="glass card-shadow">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search for friends */}
      <Card className="glass card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Amigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Digite o email do amigo..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching || !searchEmail.trim()}>
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {searchResult && (
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(searchResult.display_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{searchResult.display_name}</p>
                  <p className="text-sm text-muted-foreground">{searchResult.email}</p>
                </div>
              </div>
              <Button onClick={handleSendRequest} size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="glass card-shadow border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-warning" />
              Solicitações Pendentes ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(request.friend_display_name || 'U')}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{request.friend_display_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-success"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="glass card-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                Marcar todas como lidas
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 10).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border ${
                  notif.is_read ? 'bg-card opacity-70' : 'bg-primary/5 border-primary/20'
                }`}
                onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {notif.from_user_name} criou uma dívida para você
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notif.debt_description} - {formatCurrency(notif.debt_amount || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Nova
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card className="glass card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Meus Amigos ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Você ainda não tem amigos adicionados
            </p>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(friend.friend_display_name || 'U')}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{friend.friend_display_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setRemoveFriendId(friend.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Friend Confirmation */}
      <AlertDialog open={!!removeFriendId} onOpenChange={() => setRemoveFriendId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover amigo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Vocês precisarão se adicionar novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFriend}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
