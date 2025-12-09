import { DebtList } from '@/components/debts/DebtList';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { Debt, Person, DateFilter } from '@/types';

interface DebtsPageProps {
  debts: Debt[];
  people: Person[];
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  personFilter: string | null;
  onPersonFilterChange: (personId: string | null) => void;
  onMarkAsPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DebtsPage({
  debts,
  people,
  dateFilter,
  onDateFilterChange,
  personFilter,
  onPersonFilterChange,
  onMarkAsPaid,
  onDelete,
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
