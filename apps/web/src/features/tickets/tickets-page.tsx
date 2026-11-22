import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Ticket } from '@nexora/contracts';
import { fieldClass, headerButtonClass, rowActionClass } from '@/components/form-classes';
import { Pagination } from '@/components/pagination';
import { errorMessage } from '@/lib/error-message';
import { cn } from '@/lib/utils';
import { PRIORITY_LABELS, STATUS_LABELS } from './format';
import { TicketForm } from './ticket-form';
import { useDeleteTicket, useTickets, useUpdateTicket } from './use-tickets';
import type { TicketsParams } from './use-tickets';

const PAGE_SIZE = 25;

const PRIORITY_DOT: Record<Ticket['priority'], string> = {
  LOW: 'bg-ink-soft/50',
  MEDIUM: 'bg-amber-600',
  HIGH: 'bg-red-700',
};

export function TicketsPage() {
  const [status, setStatus] = useState<TicketsParams['status']>('');
  const [priority, setPriority] = useState<TicketsParams['priority']>('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isPending, isError, error, refetch } = useTickets({
    page,
    limit: PAGE_SIZE,
    status,
    priority,
  });
  const update = useUpdateTicket();
  const remove = useDeleteTicket();

  const filtered = status !== '' || priority !== '';
  const actionError = update.isError ? update.error : remove.isError ? remove.error : null;

  function resetErrors(): void {
    update.reset();
    remove.reset();
  }

  function onDelete(ticket: Ticket): void {
    if (!window.confirm(`Supprimer le ticket « ${ticket.title} » ?`)) return;
    remove.mutate(ticket.id);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">
          Tickets
          {data && <span className="ml-2 text-sm font-normal text-ink-soft">{data.total}</span>}
        </h1>

        <label>
          <span className="sr-only">Filtrer par priorité</span>
          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value as TicketsParams['priority']);
              setPage(1);
              resetErrors();
            }}
            className={fieldClass}
          >
            <option value="">Toutes les priorités</option>
            {(Object.keys(PRIORITY_LABELS) as Ticket['priority'][]).map((key) => (
              <option key={key} value={key}>
                {PRIORITY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filtrer par statut</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as TicketsParams['status']);
              setPage(1);
              resetErrors();
            }}
            className={fieldClass}
          >
            <option value="">Tous les statuts</option>
            {(Object.keys(STATUS_LABELS) as Ticket['status'][]).map((key) => (
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
          className={headerButtonClass}
        >
          <Plus className="size-4" aria-hidden />
          Nouveau ticket
        </button>
      </header>

      {showForm && (
        <TicketForm
          onCancel={() => setShowForm(false)}
          onDone={() => {
            setShowForm(false);
            setPage(1);
          }}
        />
      )}

      {actionError && (
        <p role="alert" className="border-b border-line bg-red-50 px-6 py-2.5 text-sm text-red-800">
          {errorMessage(actionError)}
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
          <p className="p-6 text-sm text-ink-soft">Chargement des tickets…</p>
        ) : data.items.length === 0 ? (
          <p className="max-w-md p-6 text-sm text-ink-soft">
            {filtered
              ? 'Aucun ticket ne correspond à ces filtres.'
              : 'Aucun ticket pour le moment. Créez-en un avec « Nouveau ticket ».'}
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b border-line text-ink-soft">
                <th className="px-6 py-2 font-medium">Ticket</th>
                <th className="px-4 py-2 font-medium">Employé</th>
                <th className="px-4 py-2 font-medium">Priorité</th>
                <th className="px-4 py-2 font-medium">Statut</th>
                <th className="px-6 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((ticket) => (
                <tr key={ticket.id} className="border-b border-line align-top">
                  <td className="px-6 py-2.5">
                    <div className="font-medium">{ticket.title}</div>
                    {ticket.description && (
                      <div className="max-w-md truncate text-ink-soft">{ticket.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {ticket.employee
                      ? `${ticket.employee.lastName} ${ticket.employee.firstName}`
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn('size-2 rounded-full', PRIORITY_DOT[ticket.priority])}
                        aria-hidden
                      />
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      aria-label={`Statut du ticket ${ticket.title}`}
                      value={ticket.status}
                      disabled={update.isPending}
                      onChange={(event) =>
                        update.mutate({
                          id: ticket.id,
                          changes: { status: event.target.value as Ticket['status'] },
                        })
                      }
                      className={fieldClass}
                    >
                      {(Object.keys(STATUS_LABELS) as Ticket['status'][]).map((key) => (
                        <option key={key} value={key}>
                          {STATUS_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => onDelete(ticket)}
                      className={`${rowActionClass} text-ink-soft`}
                    >
                      Supprimer
                    </button>
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