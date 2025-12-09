import { Calendar, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateFilter, Person } from '@/types';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  personFilter: string | null;
  onPersonFilterChange: (personId: string | null) => void;
  people: Person[];
}

export function FilterBar({
  dateFilter,
  onDateFilterChange,
  personFilter,
  onPersonFilterChange,
  people,
}: FilterBarProps) {
  const dateFilterLabels: Record<DateFilter, string> = {
    all: 'Todos',
    week: 'Esta Semana',
    month: 'Este Mês',
    custom: 'Personalizado',
  };

  const selectedPerson = people.find(p => p.id === personFilter);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {dateFilterLabels[dateFilter]}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover">
          <DropdownMenuItem onClick={() => onDateFilterChange('all')}>
            Todos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange('week')}>
            Esta Semana
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateFilterChange('month')}>
            Este Mês
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {selectedPerson?.name || 'Todas as pessoas'}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover">
          <DropdownMenuItem onClick={() => onPersonFilterChange(null)}>
            Todas as pessoas
          </DropdownMenuItem>
          {people.map(person => (
            <DropdownMenuItem 
              key={person.id}
              onClick={() => onPersonFilterChange(person.id)}
            >
              {person.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(dateFilter !== 'all' || personFilter) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onDateFilterChange('all');
            onPersonFilterChange(null);
          }}
          className="gap-1 text-muted-foreground"
        >
          <X className="h-3 w-3" />
          Limpar filtros
        </Button>
      )}

      {personFilter && (
        <Badge variant="secondary" className="gap-1">
          {selectedPerson?.name}
          <button onClick={() => onPersonFilterChange(null)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
