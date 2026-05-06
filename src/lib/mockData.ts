import type { FinancialTransaction } from './utils';

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'investment' | 'credit' | 'crypto';
  balance: number;
  currency: string;
  institution: string;
}

export const MOCK_ACCOUNTS: FinancialAccount[] = [];
export const MOCK_TRANSACTIONS: FinancialTransaction[] = [];

const emptyChart = (labels: string[]) =>
  labels.map(name => ({ name, income: 0, expense: 0 }));

export const CHART_DATA_WEEK = emptyChart(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
export const CHART_DATA_MONTH = emptyChart(['Week 1', 'Week 2', 'Week 3', 'Week 4']);
export const CHART_DATA_DAY = emptyChart(['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']);

const dayKey = (d: Date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];

export function buildChartData(
  range: 'Day' | 'Week' | 'Month',
  transactions: FinancialTransaction[]
) {
  const base = range === 'Day' ? CHART_DATA_DAY : range === 'Month' ? CHART_DATA_MONTH : CHART_DATA_WEEK;
  if (!transactions.length) return base;

  if (range === 'Week') {
    const buckets: Record<string, { income: number; expense: number }> = {};
    for (const row of base) buckets[row.name] = { income: 0, expense: 0 };
    for (const t of transactions) {
      const k = dayKey(new Date(t.timestamp));
      if (buckets[k]) {
        if (t.type === 'income') buckets[k].income += t.amount;
        else buckets[k].expense += t.amount;
      }
    }
    return base.map(row => ({ name: row.name, ...buckets[row.name] }));
  }

  if (range === 'Day') {
    const buckets: Record<string, { income: number; expense: number }> = {};
    for (const row of base) buckets[row.name] = { income: 0, expense: 0 };
    for (const t of transactions) {
      const d = new Date(t.timestamp);
      if (d.toDateString() !== new Date().toDateString()) continue;
      const hour = d.getHours();
      const slot = base.find(b => Math.abs(parseInt(b.name) - hour) < 2);
      if (slot && buckets[slot.name]) {
        if (t.type === 'income') buckets[slot.name].income += t.amount;
        else buckets[slot.name].expense += t.amount;
      }
    }
    return base.map(row => ({ name: row.name, ...buckets[row.name] }));
  }

  // Month: bucket by week of month
  const buckets: Record<string, { income: number; expense: number }> = {};
  for (const row of base) buckets[row.name] = { income: 0, expense: 0 };
  const now = new Date();
  for (const t of transactions) {
    const d = new Date(t.timestamp);
    if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) continue;
    const wk = `Week ${Math.min(4, Math.floor((d.getDate() - 1) / 7) + 1)}`;
    if (buckets[wk]) {
      if (t.type === 'income') buckets[wk].income += t.amount;
      else buckets[wk].expense += t.amount;
    }
  }
  return base.map(row => ({ name: row.name, ...buckets[row.name] }));
}
