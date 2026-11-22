import type { Ticket } from '@nexora/contracts';

export const STATUS_LABELS: Record<Ticket['status'], string> = {
  OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
  CLOSED: 'Clôturé',
};

export const PRIORITY_LABELS: Record<Ticket['priority'], string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
};