import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'GHS') {
  const locales: Record<string, string> = {
    GHS: 'en-GH',
    USD: 'en-US',
    EUR: 'de-DE',
    WON: 'ko-KR',
    XOF: 'fr-FR'
  };
  
  return new Intl.NumberFormat(locales[currency] || 'en-US', {
    style: 'currency',
    currency: currency === 'WON' ? 'KRW' : currency,
  }).format(amount);
}
