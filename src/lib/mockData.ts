export const MOCK_ACCOUNTS = [
  { id: '1', name: 'Main Checking', type: 'bank', balance: 124500.80, currency: 'RUB', institution: 'Sberbank' },
  { id: '2', name: 'Savings Fund', type: 'bank', balance: 450000.00, currency: 'RUB', institution: 'T-Bank' },
  { id: '3', name: 'Digital Wallet', type: 'cash', balance: 5400.00, currency: 'RUB', institution: 'Cash' },
  { id: '4', name: 'Investment Account', type: 'investment', balance: 82000.45, currency: 'RUB', institution: 'VTB' },
  { id: '5', name: 'Ameriabank Savings', type: 'bank', balance: 1250000.00, currency: 'AMD', institution: 'Ameriabank' },
];

export const MOCK_TRANSACTIONS = [
  { id: 't1', amount: 450.00, category: 'Food', type: 'expense', description: 'Cofix', timestamp: new Date().toISOString(), currency: 'RUB' },
  { id: 't2', amount: 35000.00, category: 'Housing', type: 'expense', description: 'Rent Payment', timestamp: new Date(Date.now() - 86400000).toISOString(), currency: 'RUB' },
  { id: 't3', amount: 150000.00, category: 'Salary', type: 'income', description: 'Monthly Salary', timestamp: new Date(Date.now() - 172800000).toISOString(), currency: 'RUB' },
  { id: 't4', amount: 1250.00, category: 'Transport', type: 'expense', description: 'Yandex Go', timestamp: new Date(Date.now() - 259200000).toISOString(), currency: 'RUB' },
  { id: 't5', amount: 8520.20, category: 'Shopping', type: 'expense', description: 'Ozon Purchase', timestamp: new Date(Date.now() - 345600000).toISOString(), currency: 'RUB' },
  { id: 't6', amount: 45000.00, category: 'Food', type: 'expense', description: 'Supermarket Visit', timestamp: new Date(Date.now() - 50000).toISOString(), currency: 'AMD' },
];

export const CHART_DATA_WEEK = [
  { name: 'Mon', income: 0, expense: 45 },
  { name: 'Tue', income: 3500, expense: 1200 },
  { name: 'Wed', income: 0, expense: 12 },
  { name: 'Thu', income: 200, expense: 85 },
  { name: 'Fri', income: 0, expense: 30 },
  { name: 'Sat', income: 0, expense: 150 },
  { name: 'Sun', income: 0, expense: 60 },
];

export const CHART_DATA_MONTH = [
  { name: 'Week 1', income: 4500, expense: 3200 },
  { name: 'Week 2', income: 1000, expense: 1500 },
  { name: 'Week 3', income: 2500, expense: 1800 },
  { name: 'Week 4', income: 5000, expense: 2100 },
];

export const CHART_DATA_DAY = [
  { name: '08:00', income: 0, expense: 5 },
  { name: '10:00', income: 0, expense: 12 },
  { name: '12:00', income: 0, expense: 45 },
  { name: '14:00', income: 0, expense: 20 },
  { name: '16:00', income: 0, expense: 0 },
  { name: '18:00', income: 0, expense: 15 },
  { name: '20:00', income: 0, expense: 10 },
];
