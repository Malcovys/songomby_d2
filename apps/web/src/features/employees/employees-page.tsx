import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import type { Employee } from '@nexora/contracts';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { ApiRequestError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { EmployeeDetail } from './employee-detail';
import { CONTRACT_LABELS, STATUS_LABELS, formatDays } from './format';
import { StatusBadge } from './status-badge';
import { useEmployees } from './use-employees';
import type { EmployeesParams } from './use-employees';

const PAGE_SIZE = 25;

export function EmployeesPage() {
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput.trim());
  const [status, setStatus] = useState<EmployeesParams['status']>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Employee | null>(null);

  const { data, isPending, isError, error, refetch } = useEmployees({
    page,
    limit: PAGE_SIZE,
    search,
    status,
  });

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const filtered = search !== '' || status !== '';

  return (
    <div className="flex h-full">
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
          <h1 className="mr-auto text-xl font-semibold tracking-tight">
            Employés
            {data && <span className="ml-2 text-sm font-normal text-ink-soft">{total}</span>}
          </h1>

          <label className="relative">
            <span className="sr-only">Rechercher un employé</span>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
              placeholder="Nom, matricule, email"
              className="h-9 w-64 rounded-md border border-line bg-white pl-8 pr-3 text-sm outline-none placeholder:text-ink-soft focus:border-accent"
            />
          </label>

          <label>
            <span className="sr-only">Filtrer par statut</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as EmployeesParams['status']);
                setPage(1);
              }}
              className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-accent"
            >
              <option value="">Tous les statuts</option>
              {(Object.keys(STATUS_LABELS) as Employee['status'][]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </header>

        <div className="min-h-0 flex-1 overflow-auto" aria-busy={isPending}>
          {isError ? (
            <div className="flex flex-col items-start gap-3 p-6 text-sm">
              <p>
                {error instanceof ApiRequestError
                  ? error.message
                  : 'Impossible de joindre le serveur. Vérifiez que l’API est lancée.'}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md border border-line px-3 py-1.5 hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
              >
                Réessayer
              </button>
            </div>
          ) : isPending ? (
            <p className="p-6 text-sm text-ink-soft">Chargement des employés…</p>
          ) : data.items.length === 0 ? (
            <p className="max-w-md p-6 text-sm text-ink-soft">
              {filtered
                ? 'Aucun employé ne correspond à cette recherche.'
                : 'Aucun employé pour le moment. Demandez à l’assistant d’en ajouter, ou importez un fichier.'}
            </p>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-panel">
                <tr className="border-b border-line text-ink-soft">
                  <th className="px-4 py-2 font-medium">Matricule</th>
                  <th className="px-4 py-2 font-medium">Nom</th>
                  <th className="px-4 py-2 font-medium">Poste</th>
                  <th className="px-4 py-2 font-medium">Département</th>
                  <th className="px-4 py-2 font-medium">Contrat</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 text-right font-medium">Congés</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => setSelected(employee)}
                    className={cn(
                      'cursor-pointer border-b border-line hover:bg-paper/70',
                      selected?.id === employee.id && 'bg-accent-soft/50',
                    )}
                  >
                    <td className="px-4 py-2.5 text-ink-soft">{employee.matricule}</td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        className="text-left font-medium hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        {employee.lastName} {employee.firstName}
                      </button>
                    </td>
                    <td className="px-4 py-2.5">{employee.position}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{employee.department ?? '—'}</td>
                    <td className="px-4 py-2.5">{CONTRACT_LABELS[employee.contractType]}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatDays(employee.leaveBalanceDays)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && total > 0 && (
          <footer className="flex items-center justify-between border-t border-line px-6 py-2.5 text-sm text-ink-soft">
            <span>
              {from}–{to} sur {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Page précédente"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded p-1.5 hover:bg-paper disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <span className="px-1 tabular-nums">
                {page} / {pageCount}
              </span>
              <button
                type="button"
                aria-label="Page suivante"
                disabled={page >= pageCount}
                onClick={() => setPage((current) => current + 1)}
                className="rounded p-1.5 hover:bg-paper disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </footer>
        )}
      </section>

      {selected && <EmployeeDetail employee={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}