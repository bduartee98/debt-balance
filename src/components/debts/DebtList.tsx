import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  Search, 
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Debt } from '@/types';
import { cn } from '@/lib/utils';

interface DebtListProps {
  debts: Debt[];
  onMarkAsPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DebtList({ debts, onMarkAsPaid, onDelete }: DebtListProps) {
  const [search, setSearch] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredDebts = debts.filter(debt =>
    (debt.person_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (debt.description?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <Card className="animate-fade-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Todas as Dívidas</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dívidas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDebts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma dívida encontrada</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map(debt => (
                  <TableRow key={debt.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(debt.person_name || 'NN')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{debt.person_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{debt.description}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="font-normal"
                        style={{ 
                          backgroundColor: debt.category_color ? `${debt.category_color}20` : undefined,
                          color: debt.category_color || undefined
                        }}
                      >
                        {debt.category_name || 'Sem categoria'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(debt.created_at), "dd MMM yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={debt.status === 'paid' ? 'default' : 'secondary'}
                        className={cn(
                          "gap-1",
                          debt.status === 'paid' && "bg-success/10 text-success hover:bg-success/20"
                        )}
                      >
                        {debt.status === 'paid' ? (
                          <><CheckCircle2 className="h-3 w-3" /> Pago</>
                        ) : (
                          <><Clock className="h-3 w-3" /> Pendente</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(debt.amount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          {debt.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => onMarkAsPaid(debt.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Marcar como pago
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onDelete(debt.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
