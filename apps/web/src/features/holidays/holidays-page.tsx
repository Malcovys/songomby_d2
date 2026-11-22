import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ApiRequestError } from '@/lib/api';
import { useCreateHoliday, useDeleteHoliday, useHolidays } from './use-holidays';

const dayFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const formatDay = (iso: string): string => dayFormat.format(new Date(`${iso}T00:00:00Z`));

const errorMessage = (error: unknown): string =>
  error instanceof ApiRequestError
    ? error.message
    : 'Impossible de joindre le serveur. Vérifiez que l’API est lancée.';

export function HolidaysPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [date, setDate] = useState('');
  const [name, setName] = useState('');

  const { data, isPending, isError, error, refetch } = useHolidays(year);
  const create = useCreateHoliday();
  const remove = useDeleteHoliday();

  function changeYear(delta: number): void {
    setYear((current) => current + delta);
    setDate('');
    create.reset();
  }

  function submit(event: FormEvent): void {
    event.preventDefault();
    if (!date || !name.trim()) return;
    create.mutate(
      { date, name: name.trim() },
      {
        onSuccess: () => {
          setDate('');
          setName('');
        },
      },
    );
  }

  function confirmRemove(id: string, holidayName: string): void {
    if (window.confirm(`Supprimer « ${holidayName} » ?`)) remove.mutate(id);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">
          Jours fériés
          {data && <span className="ml-2 text-sm font-normal text-ink-soft">{data.length}</span>}
        </h1>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Année précédente"
            onClick={() => changeYear(-1)}
            className="rounded p-1.5 hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{year}</span>
          <button
            type="button"
            aria-label="Année suivante"
            onClick={() => changeYear(1)}
            className="rounded p-1.5 hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </header>

      <form onSubmit={submit} className="flex flex-wrap items-end gap-3 border-b border-line px-6 py-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-soft">Date</span>
          <input
            type="date"
            required
            value={date}
            min={`${year}-01-01`}
            max={`${year}-12-31`}
            onChange={(event) => {
              setDate(event.target.value);
              create.reset();
            }}
            className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm">
          <span className="text-ink-soft">Nom</span>
          <input
            type="text"
            required
            maxLength={150}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              create.reset();
            }}
            placeholder="Fête de l’Indépendance"
            className="h-9 rounded-md border border-line bg-white px-3 text-sm outline-none placeholder:text-ink-soft focus:border-accent"
          />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {create.isPending ? 'Ajout…' : 'Ajouter'}
        </button>
        {create.isError && (
          <p role="alert" className="basis-full text-sm text-red-700">
            {errorMessage(create.error)}
          </p>
        )}
      </form>

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
          <p className="p-6 text-sm text-ink-soft">Chargement…</p>
        ) : data.length === 0 ? (
          <p className="max-w-md p-6 text-sm text-ink-soft">
            Aucun jour férié en {year}. Ajoutez-en un avec le formulaire ci-dessus.
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b border-line text-ink-soft">
                <th className="px-6 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-6 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((holiday) => (
                <tr key={holiday.id} className="border-b border-line">
                  <td className="px-6 py-2.5 first-letter:uppercase">{formatDay(holiday.date)}</td>
                  <td className="px-4 py-2.5 font-medium">{holiday.name}</td>
                  <td className="px-6 py-2.5 text-right">
                    <button
                      type="button"
                      aria-label={`Supprimer ${holiday.name}`}
                      disabled={remove.isPending}
                      onClick={() => confirmRemove(holiday.id, holiday.name)}
                      className="rounded p-1.5 text-ink-soft hover:bg-paper hover:text-red-700 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}