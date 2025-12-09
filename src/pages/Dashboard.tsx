import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Receipt, CheckCircle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DebtsByPersonChart } from '@/components/dashboard/DebtsByPersonChart';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { TopDebtors } from '@/components/dashboard/TopDebtors';
import { RecentDebts } from '@/components/dashboard/RecentDebts';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DashboardMetrics, Person, Debt, DateFilter } from '@/types';

interface DashboardProps {
  metrics: DashboardMetrics;
  debtsByPerson: { name: string; total: number }[];
  debtsByMonth: { name: string; pendente: number; recebido: number }[];
  debts: Debt[];
  people: Person[];
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  personFilter: string | null;
  onPersonFilterChange: (personId: string | null) => void;
  onMarkAsPaid: (id: string) => void;
}

export function Dashboard({
  metrics,
  debtsByPerson,
  debtsByMonth,
  debts,
  people,
  dateFilter,
  onDateFilterChange,
  personFilter,
  onPersonFilterChange,
  onMarkAsPaid,
}: DashboardProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas dívidas</p>
        </div>
        <FilterBar
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          personFilter={personFilter}
          onPersonFilterChange={onPersonFilterChange}
          people={people}
        />
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="A Receber"
          value={formatCurrency(metrics.totalPending)}
          subtitle={`${metrics.totalDebts - metrics.paidDebts} dívidas pendentes`}
          icon={TrendingUp}
          variant="warning"
          delay={0}
        />
        <MetricCard
          title="Recebido"
          value={formatCurrency(metrics.totalReceived)}
          subtitle={`${metrics.paidDebts} dívidas pagas`}
          icon={TrendingDown}
          variant="success"
          delay={50}
        />
        <MetricCard
          title="Total de Dívidas"
          value={metrics.totalDebts.toString()}
          subtitle="Todas as dívidas"
          icon={Receipt}
          variant="primary"
          delay={100}
        />
        <MetricCard
          title="Taxa de Recebimento"
          value={metrics.totalDebts > 0 
            ? `${Math.round((metrics.paidDebts / metrics.totalDebts) * 100)}%`
            : '0%'
          }
          subtitle="Dívidas pagas"
          icon={CheckCircle}
          variant="default"
          delay={150}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DebtsByPersonChart data={debtsByPerson} />
        <MonthlyChart data={debtsByMonth} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopDebtors data={debtsByPerson} />
        <RecentDebts 
          debts={debts} 
          onMarkAsPaid={onMarkAsPaid}
          onViewAll={() => navigate('/debts')}
        />
      </div>
    </div>
  );
}
