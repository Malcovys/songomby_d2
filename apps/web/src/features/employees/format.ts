import type { Employee } from '@nexora/contracts';

export const STATUS_LABELS: Record<Employee['status'], string> = {
  ACTIVE: 'Actif',
  ON_LEAVE: 'En congé',
  TERMINATED: 'Sorti',
};

export const CONTRACT_LABELS: Record<Employee['contractType'], string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERN: 'Stage',
  FREELANCE: 'Freelance',
};

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });
const moneyFormat = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'MGA',
  maximumFractionDigits: 0,
});

// "2026-01-15" -> "15 janvier 2026"
export const formatDate = (iso: string): string => dateFormat.format(new Date(`${iso}T00:00:00Z`));

export const formatMoney = (value: string): string => moneyFormat.format(Number(value));

export const formatDays = (value: string): string => `${Number(value).toLocaleString('fr-FR')} j`;