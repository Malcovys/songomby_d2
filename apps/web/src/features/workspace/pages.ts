import { CalendarDays, Plane, Receipt, Sparkles, Ticket, UserX, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TabMeta {
  label: string;
  icon: LucideIcon;
  description: string;
}

export const AGENT_META: TabMeta = {
  label: 'Assistant',
  icon: Sparkles,
  description: 'Demandez une action en français, avec ou sans fichier.',
};

export const PAGES = [
  {
    id: 'employees',
    label: 'Employés',
    icon: Users,
    description: 'Liste des employés, leurs informations et leur solde de congés.',
  },
  {
    id: 'leaves',
    label: 'Congés',
    icon: Plane,
    description: 'Congés payés, congés sans solde et arrêts maladie.',
  },
  {
    id: 'absences',
    label: 'Absences',
    icon: UserX,
    description: 'Retards et absences, justifiés ou non.',
  },
  {
    id: 'holidays',
    label: 'Jours fériés',
    icon: CalendarDays,
    description: "Calendrier des jours fériés de l'entreprise.",
  },
  {
    id: 'tickets',
    label: 'Tickets',
    icon: Ticket,
    description: 'Demandes et tâches internes.',
  },
  {
    id: 'payslips',
    label: 'Fiches de paie',
    icon: Receipt,
    description: 'Fiches de paie par employé et par mois.',
  },
] as const satisfies readonly (TabMeta & { id: string })[];

export type PageId = (typeof PAGES)[number]['id'];
export type TabId = 'agent' | PageId;

export function getTabMeta(id: TabId): TabMeta {
  if (id === 'agent') return AGENT_META;
  return PAGES.find((page) => page.id === id) ?? AGENT_META;
}