import { useState, useMemo } from 'react';
import { Debt, Person, DateFilter, DashboardMetrics, SplitDebt } from '@/types';
import { mockDebts, mockPeople } from '@/lib/mockData';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [personFilter, setPersonFilter] = useState<string | null>(null);
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const filteredDebts = useMemo(() => {
    let filtered = [...debts];

    // Filter by person
    if (personFilter) {
      filtered = filtered.filter(d => d.personId === personFilter);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === 'week') {
      const start = startOfWeek(now, { weekStartsOn: 0 });
      const end = endOfWeek(now, { weekStartsOn: 0 });
      filtered = filtered.filter(d => 
        isWithinInterval(new Date(d.createdAt), { start, end })
      );
    } else if (dateFilter === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      filtered = filtered.filter(d => 
        isWithinInterval(new Date(d.createdAt), { start, end })
      );
    } else if (dateFilter === 'custom' && customDateRange) {
      filtered = filtered.filter(d => 
        isWithinInterval(new Date(d.createdAt), customDateRange)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [debts, dateFilter, personFilter, customDateRange]);

  const metrics: DashboardMetrics = useMemo(() => {
    const pending = filteredDebts.filter(d => d.status === 'pending');
    const paid = filteredDebts.filter(d => d.status === 'paid');

    return {
      totalPending: pending.reduce((acc, d) => acc + d.amount, 0),
      totalReceived: paid.reduce((acc, d) => acc + d.amount, 0),
      totalDebts: filteredDebts.length,
      paidDebts: paid.length,
    };
  }, [filteredDebts]);

  const debtsByPerson = useMemo(() => {
    const pending = filteredDebts.filter(d => d.status === 'pending');
    const grouped = pending.reduce((acc, debt) => {
      if (!acc[debt.personName]) {
        acc[debt.personName] = 0;
      }
      acc[debt.personName] += debt.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredDebts]);

  const debtsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const grouped = debts.reduce((acc, debt) => {
      const month = new Date(debt.createdAt).getMonth();
      if (!acc[month]) {
        acc[month] = { pending: 0, paid: 0 };
      }
      if (debt.status === 'pending') {
        acc[month].pending += debt.amount;
      } else {
        acc[month].paid += debt.amount;
      }
      return acc;
    }, {} as Record<number, { pending: number; paid: number }>);

    return months.map((name, index) => ({
      name,
      pendente: grouped[index]?.pending || 0,
      recebido: grouped[index]?.paid || 0,
    }));
  }, [debts]);

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDebts(prev => [newDebt, ...prev]);
  };

  const addSplitDebts = (
    totalAmount: number,
    splits: SplitDebt[],
    description: string,
    category: string,
    dueDate: Date,
    notes?: string
  ) => {
    const newDebts = splits.map(split => ({
      id: Date.now().toString() + split.personId,
      personId: split.personId,
      personName: split.personName,
      amount: split.amount,
      description,
      category,
      dueDate,
      createdAt: new Date(),
      status: 'pending' as const,
      notes,
    }));
    setDebts(prev => [...newDebts, ...prev]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => 
      prev.map(d => d.id === id ? { ...d, ...updates } : d)
    );
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const markAsPaid = (id: string) => {
    setDebts(prev => 
      prev.map(d => 
        d.id === id ? { ...d, status: 'paid', paidAt: new Date() } : d
      )
    );
  };

  const addPerson = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
    };
    setPeople(prev => [...prev, newPerson]);
    return newPerson;
  };

  const deletePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setDebts(prev => prev.filter(d => d.personId !== id));
  };

  return {
    debts: filteredDebts,
    allDebts: debts,
    people,
    metrics,
    debtsByPerson,
    debtsByMonth,
    dateFilter,
    setDateFilter,
    personFilter,
    setPersonFilter,
    customDateRange,
    setCustomDateRange,
    addDebt,
    addSplitDebts,
    updateDebt,
    deleteDebt,
    markAsPaid,
    addPerson,
    deletePerson,
  };
}
