import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Debt } from '@/types';
import { cn } from '@/lib/utils';

interface RecentDebtsProps {
  debts: Debt[];
  onMarkAsPaid: (id: string) => void;
  onViewAll: () => void;
}

export function RecentDebts({ debts, onMarkAsPaid, onViewAll }: RecentDebtsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const recentDebts = debts.slice(0, 5);

  return (
    <Card className="animate-fade-up" style={{ animationDelay: '500ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Dívidas Recentes</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        {recentDebts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma dívida cadastrada
          </p>
        ) : (
          <div className="space-y-3">
            {recentDebts.map(debt => (
              <div 
                key={debt.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  "hover:bg-muted/50"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {getInitials(debt.person_name || 'NN')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{debt.person_name}</p>
                    <Badge 
                      variant={debt.status === 'paid' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs",
                        debt.status === 'paid' && "bg-success/10 text-success hover:bg-success/20"
                      )}
                    >
                      {debt.status === 'paid' ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Pago</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Pendente</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {debt.description} • {format(new Date(debt.created_at), "dd MMM", { locale: ptBR })}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {formatCurrency(debt.amount)}
                </p>

                {debt.status === 'pending' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => onMarkAsPaid(debt.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marcar como pago
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
