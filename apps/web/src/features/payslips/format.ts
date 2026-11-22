import type { Payslip } from '@nexora/contracts';

export const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
] as const;

export const STATUS_LABELS: Record<Payslip['status'], string> = {
  DRAFT: 'Brouillon',
  GENERATED: 'Générée',
};