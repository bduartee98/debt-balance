import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DateFilter, Person, DateRange } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  personFilter: string | null;
  onPersonFilterChange: (personId: string | null) => void;
  people: Person[];
  customDateRange?: DateRange | null;
  onCustomDateRangeChange?: (range: DateRange | null) => void;
}

export function FilterBar({
  dateFilter,
  onDateFilterChange,
  personFilter,
  onPersonFilterChange,
  people,
  customDateRange,
  onCustomDateRangeChange,
}: FilterBarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ start?: Date; end?: Date }>({});

  const dateFilterLabels: Record<DateFilter, string> = {
    all: 'Todos',
    week: 'Esta Semana',
    month: 'Este Mês',
    custom: 'Personalizado',
  };

  const selectedPerson = people.find(p => p.id === personFilter);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: date });
    } else {
      const start = tempRange.start < date ? tempRange.start : date;
      const end = tempRange.start < date ? date : tempRange.start;
      
      if (onCustomDateRangeChange) {
        onCustomDateRangeChange({ start, end });
      }
      onDateFilterChange('custom');
      setTempRange({});
      setIsCalendarOpen(false);
    }
  };

  const getDateRangeLabel = () => {
    if (dateFilter === 'custom' && customDateRange) {
      return `${format(customDateRange.start, 'dd/MM')} - ${format(customDateRange.end, 'dd/MM')}`;
    }
    return dateFilterLabels[dateFilter];
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {dateFilter !== 'custom' && dateFilterLabels[dateFilter]}
            {dateFilter === 'custom' && getDateRangeLabel()}
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

      {/* Custom Date Range Picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-2",
              dateFilter === 'custom' && "border-primary text-primary"
            )}
          >
            <Calendar className="h-4 w-4" />
            Período
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="start">
          <div className="p-3 border-b">
            <p className="text-sm font-medium">
              {!tempRange.start 
                ? 'Selecione a data inicial' 
                : 'Selecione a data final'}
            </p>
            {tempRange.start && (
              <p className="text-xs text-muted-foreground">
                Início: {format(tempRange.start, 'dd/MM/yyyy')}
              </p>
            )}
          </div>
          <CalendarComponent
            mode="single"
            selected={tempRange.end || tempRange.start}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

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
            if (onCustomDateRangeChange) {
              onCustomDateRangeChange(null);
            }
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
