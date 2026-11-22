import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Leave } from '@nexora/contracts';
import { Pagination } from '@/components/pagination';
import { formatDays } from '@/features/employees/format';
import { ApiRequestError } from '@/lib/api';
import { STATUS_LABELS, TYPE_LABELS, formatPeriod } from './format';
import { LeaveForm } from './leave-form';
import { LeaveStatusBadge } from './leave-status-badge';
import { useLeaves, useUpdateLeaveStatus } from './use-leaves';
import type { LeavesParams } from './use-leaves';

const PAGE_SIZE = 25;

type NewStatus = 'APPROVED' | 'REJECTED' | 'CANCELLED';

const errorMessage = (error: unknown): string =>
  error instanceof ApiRequestError
    ? error.message
    : 'Impossible de joindre le serveur. Vérifiez que l’API est lancée.';

const actionClass =
  'rounded px-2 py-1 text-sm hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50';

export function LeavesPage() {
  const [status, setStatus] = useState<LeavesParams['status']>('');
  const [type, setType] = useState<LeavesParams['type']>('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isPending, isError, error, refetch } = useLeaves({
    page,
    limit: PAGE_SIZE,
    status,
    type,
  });
  const update = useUpdateLeaveStatus();

  const filtered = status !== '' || type !== '';

  function change(leave: Leave, next: NewStatus): void {
    if (next === 'CANCELLED') {
      const message =
        leave.status === 'APPROVED' && leave.type === 'ANNUAL'
          ? 'Annuler ce congé approuvé ? Les jours seront recrédités au solde de l’employé.'
          : 'Annuler cette demande de congé ?';
      if (!window.confirm(message)) return;
    }
    update.mutate({ id: leave.id, status: next });
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">
          Congés
          {data && <span className="ml-2 text-sm font-normal text-ink-soft">{data.total}</span>}
        </h1>

        <label>
          <span className="sr-only">Filtrer par type</span>
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as LeavesParams['type']);
              setPage(1);
              update.reset();
            }}
            className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-accent"
          >
            <option value="">Tous les types</option>
            {(Object.keys(TYPE_LABELS) as Leave['type'][]).map((key) => (
              <option key={key} value={key}>
                {TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filtrer par statut</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as LeavesParams['status']);
              setPage(1);
              update.reset();
            }}
            className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-accent"
          >
            <option value="">Tous les statuts</option>
            {(Object.keys(STATUS_LABELS) as Leave['status'][]).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          aria-expanded={showForm}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Plus className="size-4" aria-hidden />
          Nouveau congé
        </button>
      </header>

      {showForm && (
        <LeaveForm
          onCancel={() => setShowForm(false)}
          onDone={() => {
            setShowForm(false);
            setPage(1);
          }}
        />
      )}

      {update.isError && (
        <p role="alert" className="border-b border-line bg-red-50 px-6 py-2.5 text-sm text-red-800">
          {errorMessage(update.error)}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-auto" aria-busy={isPending}>
        {isError ? (
          <div className="flex flex-col items-start gap-3 p-6 text-sm">
            <p>{errorMessage(error)}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-md border border-line px-3 py-1.5 hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
            >
              Réessayer
            </button>
          </div>
        ) : isPending ? (
          <p className="p-6 text-sm text-ink-soft">Chargement des congés…</p>
        ) : data.items.length === 0 ? (
          <p className="max-w-md p-6 text-sm text-ink-soft">
            {filtered
              ? 'Aucun congé ne correspond à ces filtres.'
              : 'Aucun congé pour le moment. Créez une demande avec « Nouveau congé ».'}
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b border-line text-ink-soft">
                <th className="px-6 py-2 font-medium">Employé</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Période</th>
                <th className="px-4 py-2 text-right font-medium">Jours</th>
                <th className="px-4 py-2 font-medium">Statut</th>
                <th className="px-6 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((leave) => (
                <tr key={leave.id} className="border-b border-line align-top">
                  <td className="px-6 py-2.5">
                    <div className="font-medium">
                      {leave.employee.lastName} {leave.employee.firstName}
                    </div>
                    <div className="text-ink-soft">{leave.employee.matricule}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div>{TYPE_LABELS[leave.type]}</div>
                    {leave.certificateRef && (
                      <div className="text-ink-soft">Certificat {leave.certificateRef}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{formatPeriod(leave.startDate, leave.endDate)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatDays(leave.days)}</td>
                  <td className="px-4 py-2.5">
                    <LeaveStatusBadge status={leave.status} />
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    {leave.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          disabled={update.isPending}
                          onClick={() => change(leave, 'APPROVED')}
                          className={`${actionClass} font-medium text-accent`}
                        >
                          Approuver
                        </button>
                        <button
                          type="button"
                          disabled={update.isPending}
                          onClick={() => change(leave, 'REJECTED')}
                          className={`${actionClass} text-ink-soft`}
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {(leave.status === 'PENDING' || leave.status === 'APPROVED') && (
                      <button
                        type="button"
                        disabled={update.isPending}
                        onClick={() => change(leave, 'CANCELLED')}
                        className={`${actionClass} text-ink-soft`}
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && <Pagination page={page} limit={PAGE_SIZE} total={data.total} onChange={setPage} />}
    </div>
  );
}