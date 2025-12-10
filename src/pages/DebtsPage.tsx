import { DebtList } from '@/components/debts/DebtList';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { Debt, Person, Category, DateFilter, DateRange } from '@/types';

export interface DebtsPageProps {
  debts: Debt[];
  people: Person[];
  categories: Category[];
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  personFilter: string | null;
  onPersonFilterChange: (personId: string | null) => void;
  customDateRange: DateRange | null;
  onCustomDateRangeChange: (range: DateRange | null) => void;
  onMarkAsPaid: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMarkAllAsPaid: (personId: string) => Promise<void>;
}

export function DebtsPage({
  debts,
  people,
  categories,
  dateFilter,
  onDateFilterChange,
  personFilter,
  onPersonFilterChange,
  customDateRange,
  onCustomDateRangeChange,
  onMarkAsPaid,
  onDelete,
  onMarkAllAsPaid,
}: DebtsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dívidas</h1>
          <p className="text-muted-foreground">Gerencie todas as suas dívidas</p>
        </div>
        <FilterBar
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          personFilter={personFilter}
          onPersonFilterChange={onPersonFilterChange}
          people={people}
          customDateRange={customDateRange}
          onCustomDateRangeChange={onCustomDateRangeChange}
        />
      </div>

      <DebtList
        debts={debts}
        onMarkAsPaid={onMarkAsPaid}
        onDelete={onDelete}
      />
    </div>
  );
}
