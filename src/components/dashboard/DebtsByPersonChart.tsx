import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DebtsByPersonChartProps {
  data: { name: string; total: number }[];
}

const COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(200, 80%, 50%)',
  'hsl(280, 70%, 55%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
];

export function DebtsByPersonChart({ data }: DebtsByPersonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <Card className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Dívidas por Pessoa</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Nenhuma dívida pendente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-up" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Dívidas por Pessoa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="total"
                nameKey="name"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background stroke-2"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
