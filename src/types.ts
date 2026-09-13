export type UserRole = 'admin' | 'usuario';

export type UserLevel = 1 | 2 | 3 | 4;

export type PaymentMethod = 'Nequi' | 'Daviplata' | 'Bancolombia' | 'PayPal';

export const SURVEY_REWARDS_BY_LEVEL: Record<UserLevel, number> = {
  1: 2000,
  2: 5000,
  3: 10000,
  4: 20000
};

export const TASK_REWARDS_BY_LEVEL: Record<UserLevel, number> = {
  1: 5000,
  2: 10000,
  3: 20000,
  4: 50000
};

export const REFERRAL_REWARD = 1000;

export interface HistoryItem {
  id: string;
  type: 'Encuesta' | 'Tarea' | 'Retiro' | 'Bono' | 'Referido';
  description: string;
  amount: number;
  date: string;
  status: 'Acreditado' | 'Pendiente' | 'Aprobado';
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  paymentMethod: PaymentMethod;
  balance: number;
  role: UserRole;
  level: UserLevel;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  surveysCompleted: number[];
  tasksCompleted: number[];
  withdrawn: number;
  history: HistoryItem[];
}

export interface SurveyQuestion {
  question: string;
  options: string[];
}

export interface Survey {
  id: number;
  title: string;
  category: string;
  duration: string;
  reward?: number;
  isAIGenerated?: boolean;
  questions: SurveyQuestion[];
}

export interface Task {
  id: number;
  title: string;
  category: string;
  reward?: number;
  instructions: string;
}

export type ViewTab = 'dashboard' | 'encuestas' | 'tareas' | 'referidos' | 'retiros' | 'sheets' | 'admin';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

