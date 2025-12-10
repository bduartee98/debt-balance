import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Bill, CardExpense } from '@/types/cards';

interface CategorySimple {
  id: string;
  name: string;
  color: string;
}

export function useCardsData() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<CardExpense[]>([]);
  const [categories, setCategories] = useState<CategorySimple[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const [cardsRes, billsRes, expensesRes, categoriesRes] = await Promise.all([
        supabase.from('cards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('bills').select('*').eq('user_id', user.id).order('due_date', { ascending: false }),
        supabase.from('card_expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').eq('user_id', user.id).order('name'),
      ]);

      if (cardsRes.data) setCards(cardsRes.data as Card[]);
      if (billsRes.data) setBills(billsRes.data as Bill[]);
      if (expensesRes.data) setExpenses(expensesRes.data as CardExpense[]);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching cards data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Card operations
  const addCard = async (data: { name: string; brand?: string; credit_limit?: number; color: string }) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newCard, error } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        name: data.name,
        brand: data.brand || null,
        credit_limit: data.credit_limit || null,
        color: data.color,
      })
      .select()
      .single();

    if (error) throw error;
    setCards(prev => [newCard as Card, ...prev]);
    return newCard as Card;
  };

  const updateCard = async (id: string, data: Partial<Card>) => {
    const { error } = await supabase.from('cards').update(data).eq('id', id);
    if (error) throw error;
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCard = async (id: string) => {
    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (error) throw error;
    setCards(prev => prev.filter(c => c.id !== id));
    setBills(prev => prev.filter(b => b.card_id !== id));
  };

  // Bill operations
  const addBill = async (data: { card_id: string; amount: number; due_date: Date; month_reference: string }) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newBill, error } = await supabase
      .from('bills')
      .insert({
        user_id: user.id,
        card_id: data.card_id,
        amount: data.amount,
        due_date: data.due_date.toISOString().split('T')[0],
        month_reference: data.month_reference,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    setBills(prev => [newBill as Bill, ...prev]);
    return newBill as Bill;
  };

  const updateBill = async (id: string, data: Partial<Bill>) => {
    const { error } = await supabase.from('bills').update(data).eq('id', id);
    if (error) throw error;
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const markBillAsPaid = async (id: string) => {
    await updateBill(id, { status: 'paid' });
  };

  const deleteBill = async (id: string) => {
    const { error } = await supabase.from('bills').delete().eq('id', id);
    if (error) throw error;
    setBills(prev => prev.filter(b => b.id !== id));
    setExpenses(prev => prev.filter(e => e.bill_id !== id));
  };

  // Expense operations
  const addExpense = async (data: { bill_id: string; category_id?: string; description?: string; amount: number }) => {
    if (!user) throw new Error('User not authenticated');

    const { data: newExpense, error } = await supabase
      .from('card_expenses')
      .insert({
        user_id: user.id,
        bill_id: data.bill_id,
        category_id: data.category_id || null,
        description: data.description || null,
        amount: data.amount,
        is_paid_separately: false,
      })
      .select()
      .single();

    if (error) throw error;
    setExpenses(prev => [newExpense as CardExpense, ...prev]);
    return newExpense as CardExpense;
  };

  const updateExpense = async (id: string, data: Partial<CardExpense>) => {
    const { error } = await supabase.from('card_expenses').update(data).eq('id', id);
    if (error) throw error;
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const markExpenseAsPaidSeparately = async (id: string, isPaid: boolean) => {
    await updateExpense(id, { is_paid_separately: isPaid });
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('card_expenses').delete().eq('id', id);
    if (error) throw error;
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Helper functions
  const getCardBills = (cardId: string) => {
    return bills.filter(b => b.card_id === cardId);
  };

  const getBillExpenses = (billId: string) => {
    return expenses.filter(e => e.bill_id === billId);
  };

  const getCardTotalPending = (cardId: string) => {
    return bills
      .filter(b => b.card_id === cardId && b.status === 'pending')
      .reduce((sum, b) => sum + Number(b.amount), 0);
  };

  return {
    cards,
    bills,
    expenses,
    categories,
    loading,
    addCard,
    updateCard,
    deleteCard,
    addBill,
    updateBill,
    markBillAsPaid,
    deleteBill,
    addExpense,
    updateExpense,
    markExpenseAsPaidSeparately,
    deleteExpense,
    getCardBills,
    getBillExpenses,
    getCardTotalPending,
    refetch: fetchData,
  };
}
