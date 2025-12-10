export interface Person {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: Date;
}

export interface Debt {
  id: string;
  user_id: string;
  person_id: string;
  person_name?: string;
  category_id: string | null;
  category_name?: string;
  category_color?: string;
  amount: number;
  description: string | null;
  due_date: Date | null;
  status: 'pending' | 'paid';
  paid_at: Date | null;
  installment_group_id: string | null;
  installment_number: number | null;
  total_installments: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  theme: 'midnight' | 'blossom';
  created_at: Date;
  updated_at: Date;
}

export interface SplitDebt {
  personId: string;
  personName: string;
  amount: number;
}

export type DateFilter = 'all' | 'week' | 'month' | 'custom';

export interface DashboardMetrics {
  totalPending: number;
  totalReceived: number;
  totalDebts: number;
  paidDebts: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}
