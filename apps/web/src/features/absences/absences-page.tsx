import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Absence } from '@nexora/contracts';
import { fieldClass, headerButtonClass, rowActionClass } from '@/components/form-classes';
import { Pagination } from '@/components/pagination';
import { formatDate } from '@/features/employees/format';
import { errorMessage } from '@/lib/error-message';
import { cn } from '@/lib/utils';
import { AbsenceForm } from './absence-form';
import { useAbsences, useDeleteAbsence, useUpdateAbsence } from './use-absences';
import type { AbsencesParams } from './use-absences';

const PAGE_SIZE = 25;

export function AbsencesPage() {
  const [justified, setJustified] = useState<AbsencesParams['justified']>('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isPending, isError, error, refetch } = useAbsences({
    page,
    limit: PAGE_SIZE,
    justified,
  });
  const update = useUpdateAbsence();
  const remove = useDeleteAbsence();

  const actionError = update.isError ? update.error : remove.isError ? remove.error : null;

  function onDelete(absence: Absence): void {
    const who = `${absence.employee.firstName} ${absence.employee.lastName}`;
    if (!window.confirm(`Supprimer l’absence de ${who} du ${formatDate(absence.date)} ?`)) return;
    remove.mutate(absence.id);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">
          Absences
          {data && <span className="ml-2 text-sm font-normal text-ink-soft">{data.total}</span>}
        </h1>

        <label>
          <span className="sr-only">Filtrer par justification</span>
          <select
            value={justified}
            onChange={(event) => {
              setJustified(event.target.value as AbsencesParams['justified']);
              setPage(1);
              update.reset();
              remove.reset();
            }}
            className={fieldClass}
          >
            <option value="">Toutes</option>
            <option value="true">Justifiées</option>
            <option value="false">Non justifiées</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          aria-expanded={showForm}
          className={headerButtonClass}
        >
          <Plus className="size-4" aria-hidden />
          Nouvelle absence
        </button>
      </header>

      {showForm && (
        <AbsenceForm
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
          <p className="p-6 text-sm text-ink-soft">Chargement des absences…</p>
        ) : data.items.length === 0 ? (
          <p className="max-w-md p-6 text-sm text-ink-soft">
            {justified !== ''
              ? 'Aucune absence ne correspond à ce filtre.'
              : 'Aucune absence pour le moment. Ajoutez-en une avec « Nouvelle absence ».'}
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b border-line text-ink-soft">
                <th className="px-6 py-2 font-medium">Employé</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Justification</th>
                <th className="px-4 py-2 font-medium">Motif</th>
                <th className="px-6 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((absence) => (
                <tr key={absence.id} className="border-b border-line align-top">
                  <td className="px-6 py-2.5">
                    <div className="font-medium">
                      {absence.employee.lastName} {absence.employee.firstName}
                    </div>
                    <div className="text-ink-soft">{absence.employee.matricule}</div>
                  </td>
                  <td className="px-4 py-2.5">{formatDate(absence.date)}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          absence.justified ? 'bg-accent' : 'bg-amber-600',
                        )}
                        aria-hidden
                      />
                      {absence.justified ? 'Justifiée' : 'Non justifiée'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{absence.reason ?? '—'}</td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: absence.id, changes: { justified: !absence.justified } })
                      }
                      className={`${rowActionClass} font-medium text-accent`}
                    >
                      {absence.justified ? 'Marquer non justifiée' : 'Marquer justifiée'}
                    </button>
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => onDelete(absence)}
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