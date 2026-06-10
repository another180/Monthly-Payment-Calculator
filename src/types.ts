export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Annual';
export type BillCategory = 'Mortgage' | 'Utilities' | 'Insurance' | 'Subscription' | 'Other';

export interface LoanItem {
  id: string;
  name: string;
  lender: string;
  monthlyPayment: number;
  dueDay: number;
  remainingBalance: number;
  notes?: string;
}

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  frequency: PaymentFrequency;
  category: BillCategory;
  active: boolean;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  itemId: string;
  type: 'Loan' | 'Bill';
  paidAmount: number;
  paidDate: string;
  month: string;
}

export interface SettingForReminder {
  enabled: boolean;
  leadDays: number;
}

export interface TrackerData {
  loan?: LoanItem;
  bills: BillItem[];
  records: PaymentRecord[];
  settings: SettingForReminder;
}
