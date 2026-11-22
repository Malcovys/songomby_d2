import type { Leave } from '@nexora/contracts';

export const TYPE_LABELS: Record<Leave['type'], string> = {
  ANNUAL: 'Congé payé',
  SICK: 'Arrêt maladie',
  UNPAID: 'Sans solde',
  MATERNITY: 'Maternité',
  PATERNITY: 'Paternité',
  OTHER: 'Autre',
};

export const STATUS_LABELS: Record<Leave['status'], string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Refusé',
  CANCELLED: 'Annulé',
};

const shortDate = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const format = (iso: string): string => shortDate.format(new Date(`${iso}T00:00:00Z`));

export const formatPeriod = (start: string, end: string): string =>
  start === end ? format(start) : `${format(start)} – ${format(end)}`;