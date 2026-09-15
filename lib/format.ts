import type { Currency, DateFormat } from './types';

const DATE_LOCALES: Record<DateFormat, string> = {
  us: 'en-US',
  eu: 'en-GB',
  iso: 'en-CA',
};

/** ADR-14: смена валюты не конвертирует суммы, только формат. Locale фиксирован. */
export function formatMoney(minorUnits: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(minorUnits / 100);
}

/** ADR-11: 'us'/'eu'/'iso' маппятся на locale, а не на ручную сборку строки. */
export function formatDate(isoDate: string, dateFormat: DateFormat): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat(DATE_LOCALES[dateFormat], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** ADR-13: ставка налога хранится в промилле (800 = 8.00%) и форматируется как процент. */
export function formatTaxRate(taxRatePermille: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(taxRatePermille / 1000);
}

/** Зум холста форматируется через Intl, а не конкатенацией строки с "%". */
export function formatZoom(zoom: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(zoom);
}
