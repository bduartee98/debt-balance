export interface PersonalExpense {
  id: string;
  user_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  due_date: string | null;
  status: 'pending' | 'paid';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  friend_display_name?: string;
  friend_email?: string;
}

export interface DebtNotification {
  id: string;
  debt_id: string;
  from_user_id: string;
  to_user_id: string;
  is_read: boolean;
  created_at: string;
  from_user_name?: string;
  debt_description?: string;
  debt_amount?: number;
  debt_category?: string;
}
