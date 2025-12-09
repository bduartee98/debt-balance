import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyChartProps {
  data: { name: string; pendente: number; recebido: number }[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  // Filter to show only months with data
  const filteredData = data.filter(d => d.pendente > 0 || d.recebido > 0);

  return (
    <Card className="animate-fade-up" style={{ animationDelay: '300ms' }}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Dívidas por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.length > 0 ? filteredData : data.slice(-3)}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'pendente' ? 'Pendente' : 'Recebido'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-foreground">
                    {value === 'pendente' ? 'Pendente' : 'Recebido'}
                  </span>
                )}
              />
              <Bar 
                dataKey="pendente" 
                fill="hsl(var(--warning))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="recebido" 
                fill="hsl(var(--success))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
