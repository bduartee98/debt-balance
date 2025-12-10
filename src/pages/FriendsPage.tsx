import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus } from 'lucide-react';
import { FriendsPanel } from '@/components/friends/FriendsPanel';

export function FriendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Amigos</h1>
        <p className="text-muted-foreground">Conecte-se com outros usuários e compartilhe dívidas</p>
      </div>

      <FriendsPanel />
    </div>
  );
}
