import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TopDebtorsProps {
  data: { name: string; total: number }[];
}

export function TopDebtors({ data }: TopDebtorsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <Card className="animate-fade-up" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Maiores Devedores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma dívida pendente
          </p>
        ) : (
          data.slice(0, 5).map((person, index) => (
            <div key={person.name} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback 
                  className={cn(
                    "text-sm font-medium",
                    index === 0 && "bg-primary/10 text-primary"
                  )}
                >
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{person.name}</p>
                  <p className="text-sm font-semibold">{formatCurrency(person.total)}</p>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(person.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
