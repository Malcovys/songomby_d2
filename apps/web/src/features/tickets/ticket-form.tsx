import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Ticket } from '@nexora/contracts';
import {
  backButtonClass,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/form-classes';
import { useEmployees } from '@/features/employees/use-employees';
import { errorMessage } from '@/lib/error-message';
import { PRIORITY_LABELS } from './format';
import { useCreateTicket } from './use-tickets';

interface TicketFormProps {
  onDone: () => void;
  onCancel: () => void;
}

export function TicketForm({ onDone, onCancel }: TicketFormProps) {
  const employees = useEmployees({ page: 1, limit: 100, search: '', status: 'ACTIVE' });
  const create = useCreateTicket();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Ticket['priority']>('MEDIUM');
  const [employeeId, setEmployeeId] = useState('');

  function submit(event: FormEvent): void {
    event.preventDefault();
    create.mutate(
      {
        title: title.trim(),
        priority,
        ...(description.trim() !== '' && { description: description.trim() }),
        ...(employeeId !== '' && { employeeId }),
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 border-b border-line bg-paper/50 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={create.isPending}
        className={backButtonClass}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour aux tickets
      </button>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Titre</span>
        <input
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Priorité</span>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Ticket['priority'])}
          className={fieldClass}
        >
          {(Object.keys(PRIORITY_LABELS) as Ticket['priority'][]).map((key) => (
            <option key={key} value={key}>
              {PRIORITY_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Employé concerné (facultatif)</span>
        <select
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          disabled={employees.isPending}
          className={fieldClass}
        >
          <option value="">{employees.isPending ? 'Chargement…' : 'Aucun'}</option>
          {employees.data?.items.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.lastName} {employee.firstName} ({employee.matricule})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-4">
        <span className="text-ink-soft">Description (facultatif)</span>
        <textarea
          rows={3}
          maxLength={5000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-md border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-accent"
        />
      </label>

      {create.isError && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">
          {errorMessage(create.error)}
        </p>
      )}

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <button type="submit" disabled={create.isPending} className={primaryButtonClass}>
          {create.isPending ? 'Création…' : 'Créer le ticket'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Annuler
        </button>
      </div>
    </form>
  );
}