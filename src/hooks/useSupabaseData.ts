import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Person, Debt, Category, DateFilter, DashboardMetrics, SplitDebt, DateRange } from '@/types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, addMonths } from 'date-fns';

export function useSupabaseData() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [personFilter, setPersonFilter] = useState<string | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [debtsRes, peopleRes, categoriesRes] = await Promise.all([
        supabase
          .from('debts')
          .select(`
            *,
            people:person_id(name),
            categories:category_id(name, color)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('people')
          .select('*')
          .eq('user_id', user.id)
          .order('name'),
        supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('name'),
      ]);

      if (debtsRes.data) {
        setDebts(debtsRes.data.map((d: any) => ({
          ...d,
          status: d.status as 'pending' | 'paid',
          person_name: d.people?.name,
          category_name: d.categories?.name,
          category_color: d.categories?.color,
          due_date: d.due_date ? new Date(d.due_date) : null,
          paid_at: d.paid_at ? new Date(d.paid_at) : null,
          created_at: new Date(d.created_at),
          updated_at: new Date(d.updated_at),
        })));
      }

      if (peopleRes.data) {
        setPeople(peopleRes.data.map((p: any) => ({
          ...p,
          created_at: new Date(p.created_at),
        })));
      }

      if (categoriesRes.data) {
        setCategories(categoriesRes.data.map((c: any) => ({
          ...c,
          created_at: new Date(c.created_at),
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredDebts = useMemo(() => {
    let filtered = [...debts];

    if (personFilter) {
      filtered = filtered.filter(d => d.person_id === personFilter);
    }

    const now = new Date();
    if (dateFilter === 'week') {
      const start = startOfWeek(now, { weekStartsOn: 0 });
      const end = endOfWeek(now, { weekStartsOn: 0 });
      filtered = filtered.filter(d =>
        isWithinInterval(new Date(d.created_at), { start, end })
      );
    } else if (dateFilter === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      filtered = filtered.filter(d =>
        isWithinInterval(new Date(d.created_at), { start, end })
      );
    } else if (dateFilter === 'custom' && customDateRange) {
      filtered = filtered.filter(d =>
        isWithinInterval(new Date(d.created_at), customDateRange)
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [debts, dateFilter, personFilter, customDateRange]);

  const metrics: DashboardMetrics = useMemo(() => {
    const pending = filteredDebts.filter(d => d.status === 'pending');
    const paid = filteredDebts.filter(d => d.status === 'paid');

    return {
      totalPending: pending.reduce((acc, d) => acc + Number(d.amount), 0),
      totalReceived: paid.reduce((acc, d) => acc + Number(d.amount), 0),
      totalDebts: filteredDebts.length,
      paidDebts: paid.length,
    };
  }, [filteredDebts]);

  const debtsByPerson = useMemo(() => {
    const pending = filteredDebts.filter(d => d.status === 'pending');
    const grouped = pending.reduce((acc, debt) => {
      const name = debt.person_name || 'Desconhecido';
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name] += Number(debt.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredDebts]);

  const debtsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const grouped = debts.reduce((acc, debt) => {
      const month = new Date(debt.created_at).getMonth();
      if (!acc[month]) {
        acc[month] = { pending: 0, paid: 0 };
      }
      if (debt.status === 'pending') {
        acc[month].pending += Number(debt.amount);
      } else {
        acc[month].paid += Number(debt.amount);
      }
      return acc;
    }, {} as Record<number, { pending: number; paid: number }>);

    return months.map((name, index) => ({
      name,
      pendente: grouped[index]?.pending || 0,
      recebido: grouped[index]?.paid || 0,
    }));
  }, [debts]);

  // CRUD Operations
  const addDebt = async (debt: {
    person_id: string;
    category_id: string | null;
    amount: number;
    description: string;
    due_date: Date;
    status: 'pending';
    installment_group_id?: string;
    installment_number?: number;
    total_installments?: number;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('debts')
      .insert({
        ...debt,
        user_id: user.id,
        due_date: debt.due_date.toISOString().split('T')[0],
      })
      .select(`
        *,
        people:person_id(name),
        categories:category_id(name, color)
      `)
      .single();

    if (error) throw error;

    if (data) {
      const newDebt: Debt = {
        ...data,
        status: data.status as 'pending' | 'paid',
        person_name: data.people?.name,
        category_name: data.categories?.name,
        category_color: data.categories?.color,
        due_date: data.due_date ? new Date(data.due_date) : null,
        paid_at: data.paid_at ? new Date(data.paid_at) : null,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
      setDebts(prev => [newDebt, ...prev]);
    }
  };

  const addInstallmentDebts = async (
    personId: string,
    categoryId: string | null,
    totalAmount: number,
    description: string,
    firstDueDate: Date,
    totalInstallments: number
  ) => {
    if (!user) return;

    const installmentGroupId = crypto.randomUUID();
    const installmentAmount = totalAmount / totalInstallments;

    const installments = Array.from({ length: totalInstallments }, (_, i) => ({
      user_id: user.id,
      person_id: personId,
      category_id: categoryId,
      amount: installmentAmount,
      description: `${description} - Parcela ${i + 1}/${totalInstallments}`,
      due_date: addMonths(firstDueDate, i).toISOString().split('T')[0],
      status: 'pending' as const,
      installment_group_id: installmentGroupId,
      installment_number: i + 1,
      total_installments: totalInstallments,
    }));

    const { data, error } = await supabase
      .from('debts')
      .insert(installments)
      .select(`
        *,
        people:person_id(name),
        categories:category_id(name, color)
      `);

    if (error) throw error;

    if (data) {
      const newDebts: Debt[] = data.map((d: any) => ({
        ...d,
        status: d.status as 'pending' | 'paid',
        person_name: d.people?.name,
        category_name: d.categories?.name,
        category_color: d.categories?.color,
        due_date: d.due_date ? new Date(d.due_date) : null,
        paid_at: d.paid_at ? new Date(d.paid_at) : null,
        created_at: new Date(d.created_at),
        updated_at: new Date(d.updated_at),
      }));
      setDebts(prev => [...newDebts, ...prev]);
    }
  };

  const addSplitDebts = async (
    totalAmount: number,
    splits: SplitDebt[],
    description: string,
    categoryId: string | null,
    dueDate: Date
  ) => {
    if (!user) return;

    const debtsToInsert = splits.map(split => ({
      user_id: user.id,
      person_id: split.personId,
      category_id: categoryId,
      amount: split.amount,
      description,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'pending' as const,
    }));

    const { data, error } = await supabase
      .from('debts')
      .insert(debtsToInsert)
      .select(`
        *,
        people:person_id(name),
        categories:category_id(name, color)
      `);

    if (error) throw error;

    if (data) {
      const newDebts: Debt[] = data.map((d: any) => ({
        ...d,
        status: d.status as 'pending' | 'paid',
        person_name: d.people?.name,
        category_name: d.categories?.name,
        category_color: d.categories?.color,
        due_date: d.due_date ? new Date(d.due_date) : null,
        paid_at: d.paid_at ? new Date(d.paid_at) : null,
        created_at: new Date(d.created_at),
        updated_at: new Date(d.updated_at),
      }));
      setDebts(prev => [...newDebts, ...prev]);
    }
  };

  const deleteDebt = async (id: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) throw error;
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('debts')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    setDebts(prev =>
      prev.map(d =>
        d.id === id ? { ...d, status: 'paid' as const, paid_at: new Date() } : d
      )
    );
  };

  const markAllAsPaid = async (personId: string) => {
    const { error } = await supabase
      .from('debts')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('person_id', personId)
      .eq('status', 'pending');

    if (error) throw error;

    setDebts(prev =>
      prev.map(d =>
        d.person_id === personId && d.status === 'pending'
          ? { ...d, status: 'paid' as const, paid_at: new Date() }
          : d
      )
    );
  };

  const addPerson = async (name: string) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('people')
      .insert({ user_id: user.id, name })
      .select()
      .single();

    if (error) throw error;

    const newPerson: Person = {
      ...data,
      created_at: new Date(data.created_at),
    };
    setPeople(prev => [...prev, newPerson]);
    return newPerson;
  };

  const deletePerson = async (id: string) => {
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) throw error;
    setPeople(prev => prev.filter(p => p.id !== id));
    setDebts(prev => prev.filter(d => d.person_id !== id));
  };

  const addCategory = async (name: string, color: string) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name, color })
      .select()
      .single();

    if (error) throw error;

    const newCategory: Category = {
      ...data,
      created_at: new Date(data.created_at),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = async (id: string, updates: { name?: string; color?: string }) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const getPersonDebts = (personId: string) => {
    return debts.filter(d => d.person_id === personId);
  };

  const getPersonTotalOwed = (personId: string) => {
    return debts
      .filter(d => d.person_id === personId && d.status === 'pending')
      .reduce((acc, d) => acc + Number(d.amount), 0);
  };

  return {
    debts: filteredDebts,
    allDebts: debts,
    people,
    categories,
    metrics,
    debtsByPerson,
    debtsByMonth,
    dateFilter,
    setDateFilter,
    personFilter,
    setPersonFilter,
    customDateRange,
    setCustomDateRange,
    loading,
    addDebt,
    addInstallmentDebts,
    addSplitDebts,
    deleteDebt,
    markAsPaid,
    markAllAsPaid,
    addPerson,
    deletePerson,
    addCategory,
    updateCategory,
    deleteCategory,
    getPersonDebts,
    getPersonTotalOwed,
    refetch: fetchData,
  };
}
