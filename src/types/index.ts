export interface Person {
  id: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Debt {
  id: string;
  personId: string;
  personName: string;
  amount: number;
  description: string;
  category: string;
  paymentMethod?: string;
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
  status: 'pending' | 'paid';
  notes?: string;
}

export interface SplitDebt {
  personId: string;
  personName: string;
  amount: number;
  customAmount?: boolean;
}

export type DateFilter = 'week' | 'month' | 'custom' | 'all';

export interface DashboardMetrics {
  totalPending: number;
  totalReceived: number;
  totalDebts: number;
  paidDebts: number;
}
