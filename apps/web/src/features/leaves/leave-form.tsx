import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Leave } from '@nexora/contracts';
import { useEmployees } from '@/features/employees/use-employees';
import { ApiRequestError } from '@/lib/api';
import { TYPE_LABELS } from './format';
import { useCreateLeave } from './use-leaves';

interface LeaveFormProps {
  onDone: () => void;
  onCancel: () => void;
}

const fieldClass =
  'h-9 rounded-md border border-line bg-white px-2 text-sm outline-none focus:border-accent';

export function LeaveForm({ onDone, onCancel }: LeaveFormProps) {
  const employees = useEmployees({ page: 1, limit: 100, search: '', status: 'ACTIVE' });
  const create = useCreateLeave();

  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<Leave['type']>('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [certificateRef, setCertificateRef] = useState('');

  function submit(event: FormEvent): void {
    event.preventDefault();
    create.mutate(
      {
        employeeId,
        type,
        startDate,
        endDate,
        ...(reason.trim() !== '' && { reason: reason.trim() }),
        ...(type === 'SICK' && certificateRef.trim() !== '' && {
          certificateRef: certificateRef.trim(),
        }),
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 border-b border-line bg-paper/50 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Employé</span>
        <select
          required
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          disabled={employees.isPending}
          className={fieldClass}
        >
          <option value="">
            {employees.isPending ? 'Chargement…' : 'Choisir un employé'}
          </option>
          {employees.data?.items.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.lastName} {employee.firstName} ({employee.matricule})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Type</span>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as Leave['type'])}
          className={fieldClass}
        >
          {(Object.keys(TYPE_LABELS) as Leave['type'][]).map((key) => (
            <option key={key} value={key}>
              {TYPE_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Premier jour</span>
        <input
          type="date"
          required
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Dernier jour</span>
        <input
          type="date"
          required
          value={endDate}
          min={startDate || undefined}
          onChange={(event) => setEndDate(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Motif (facultatif)</span>
        <input
          type="text"
          maxLength={500}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className={fieldClass}
        />
      </label>

      {type === 'SICK' && (
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-ink-soft">Référence du certificat médical (facultatif)</span>
          <input
            type="text"
            maxLength={100}
            value={certificateRef}
            onChange={(event) => setCertificateRef(event.target.value)}
            className={fieldClass}
          />
        </label>
      )}

      {create.isError && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">
          {create.error instanceof ApiRequestError
            ? create.error.message
            : 'Impossible de joindre le serveur. Vérifiez que l’API est lancée.'}
        </p>
      )}

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          disabled={create.isPending}
          className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {create.isPending ? 'Création…' : 'Créer la demande'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-md border border-line px-4 text-sm hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}