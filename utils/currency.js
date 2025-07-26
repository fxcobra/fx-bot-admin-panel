import { api } from './api';

export async function fetchActiveCurrency() {
  const res = await api.get('/currency/active');
  return res.data;
}

export function formatPrice(amount, currency) {
  if (!currency) return amount;
  return `${currency.symbol}${Number(amount).toFixed(2)}`;
}
