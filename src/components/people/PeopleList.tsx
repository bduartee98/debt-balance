import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Person, Debt } from '@/types';
import { cn } from '@/lib/utils';

interface PeopleListProps {
  people: Person[];
  debts: Debt[];
  onAddPerson: (name: string) => void;
  onDeletePerson: (id: string) => void;
}

export function PeopleList({ people, debts, onAddPerson, onDeletePerson }: PeopleListProps) {
  const [search, setSearch] = useState('');
  const [newPersonName, setNewPersonName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPersonStats = (personId: string) => {
    const personDebts = debts.filter(d => d.personId === personId);
    const pending = personDebts.filter(d => d.status === 'pending');
    const paid = personDebts.filter(d => d.status === 'paid');
    
    return {
      totalPending: pending.reduce((acc, d) => acc + d.amount, 0),
      totalPaid: paid.reduce((acc, d) => acc + d.amount, 0),
      pendingCount: pending.length,
      paidCount: paid.length,
    };
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    onAddPerson(newPersonName.trim());
    setNewPersonName('');
    setIsDialogOpen(false);
  };

  return (
    <Card className="animate-fade-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Pessoas</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pessoas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Nova Pessoa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Adicionar Pessoa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Nome da pessoa"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPerson} className="flex-1" disabled={!newPersonName.trim()}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma pessoa encontrada</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map(person => {
              const stats = getPersonStats(person.id);
              
              return (
                <div
                  key={person.id}
                  className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Desde {format(new Date(person.createdAt), "MMM yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir pessoa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Isso irá excluir {person.name} e todas as dívidas associadas. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeletePerson(person.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-warning/5">
                      <p className="text-xs text-muted-foreground mb-1">Pendente</p>
                      <p className="font-semibold text-warning">{formatCurrency(stats.totalPending)}</p>
                      <p className="text-xs text-muted-foreground">{stats.pendingCount} dívida{stats.pendingCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/5">
                      <p className="text-xs text-muted-foreground mb-1">Recebido</p>
                      <p className="font-semibold text-success">{formatCurrency(stats.totalPaid)}</p>
                      <p className="text-xs text-muted-foreground">{stats.paidCount} dívida{stats.paidCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
