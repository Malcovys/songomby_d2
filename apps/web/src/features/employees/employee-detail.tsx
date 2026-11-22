import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Employee } from '@nexora/contracts';
import { CONTRACT_LABELS, formatDate, formatDays, formatMoney } from './format';
import { StatusBadge } from './status-badge';

interface EmployeeDetailProps {
  employee: Employee;
  onClose: () => void;
}

type Row = [label: string, value: ReactNode];

export function EmployeeDetail({ employee, onClose }: EmployeeDetailProps) {
  const rows: Row[] = [
    ['Poste', employee.position],
    ['Département', employee.department ?? '—'],
    ['Contrat', CONTRACT_LABELS[employee.contractType]],
    ['Statut', <StatusBadge key="status" status={employee.status} />],
    ['Embauché le', formatDate(employee.hireDate)],
  ];

  if (employee.endDate) {
    rows.push(['Fin de contrat', formatDate(employee.endDate)]);
  }

  rows.push(
    ['Salaire de base', formatMoney(employee.baseSalary)],
    ['Solde de congés', formatDays(employee.leaveBalanceDays)],
    ['Email', employee.email ?? '—'],
    ['Téléphone', employee.phone ?? '—'],
  );

  return (
    <aside
      aria-label={`Fiche de ${employee.firstName} ${employee.lastName}`}
      className="w-80 shrink-0 overflow-y-auto border-l border-line bg-panel"
    >
      <div className="flex items-start justify-between gap-2 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-sm text-ink-soft">{employee.matricule}</p>
        </div>
        <button
          type="button"
          aria-label="Fermer la fiche"
          onClick={onClose}
          className="rounded p-1 text-ink-soft hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <dl className="flex flex-col gap-3 px-5 py-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-ink-soft">{label}</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}