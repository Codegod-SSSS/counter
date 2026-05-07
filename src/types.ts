
export type CategoryIcon = 'food' | 'transport' | 'home' | 'health' | 'shopping' | 'leisure' | 'education' | 'other';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  monthlyLimit: number;
}

export type PaymentMethod = 'Cash' | 'Mobile Money' | 'Bank';

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export type BudgetType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface UserSettings {
  budgetAmount: number;
  budgetType: BudgetType;
  currency: string;
  onboarded: boolean;
  theme: 'light' | 'dark' | 'gold' | 'system';
  language?: 'en' | 'fr' | 'ko';
  welcomed?: boolean;
  isAuthenticated?: boolean;
  userName?: string;
  email?: string;
}
