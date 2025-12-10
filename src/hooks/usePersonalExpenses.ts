import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PersonalExpense } from '@/types/social';

interface CategorySimple {
  id: string;
  name: string;
  color: string;
}

export function usePersonalExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [categories, setCategories] = useState<CategorySimple[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        supabase
          .from('personal_expenses')
          .select('*, categories(name, color)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('id, name, color')
          .eq('user_id', user.id)
          .order('name'),
      ]);

      if (expensesRes.data) {
        const mapped = expensesRes.data.map((e: any) => ({
          ...e,
          category_name: e.categories?.name,
          category_color: e.categories?.color,
        }));
        setExpenses(mapped);
      }
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching personal expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addExpense = async (data: {
    description: string;
    amount: number;
    category_id?: string;
    due_date?: Date;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newExpense, error } = await supabase
      .from('personal_expenses')
      .insert({
        user_id: user.id,
        description: data.description,
        amount: data.amount,
        category_id: data.category_id || null,
        due_date: data.due_date ? data.due_date.toISOString().split('T')[0] : null,
        status: 'pending',
      })
      .select('*, categories(name, color)')
      .single();

    if (error) throw error;

    const mapped = {
      ...newExpense,
      category_name: (newExpense as any).categories?.name,
      category_color: (newExpense as any).categories?.color,
    } as PersonalExpense;

    setExpenses(prev => [mapped, ...prev]);
    return mapped;
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('personal_expenses')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    setExpenses(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status: 'paid' as const, paid_at: new Date().toISOString() } : e
      )
    );
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('personal_expenses').delete().eq('id', id);
    if (error) throw error;
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Metrics
  const totalPending = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalPaid = expenses
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return {
    expenses,
    categories,
    loading,
    totalPending,
    totalPaid,
    addExpense,
    markAsPaid,
    deleteExpense,
    refetch: fetchData,
  };
}
