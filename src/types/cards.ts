export interface Card {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  credit_limit: number | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  card_id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  month_reference: string;
  created_at: string;
  updated_at: string;
}

export interface CardExpense {
  id: string;
  user_id: string;
  bill_id: string;
  category_id: string | null;
  description: string | null;
  amount: number;
  is_paid_separately: boolean;
  created_at: string;
  updated_at: string;
}
