import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  backButtonClass,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/form-classes';
import { useEmployees } from '@/features/employees/use-employees';
import { errorMessage } from '@/lib/error-message';
import { useCreateAbsence } from './use-absences';

interface AbsenceFormProps {
  onDone: () => void;
  onCancel: () => void;
}

export function AbsenceForm({ onDone, onCancel }: AbsenceFormProps) {
  const employees = useEmployees({ page: 1, limit: 100, search: '', status: 'ACTIVE' });
  const create = useCreateAbsence();

  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [justified, setJustified] = useState(false);
  const [reason, setReason] = useState('');

  function submit(event: FormEvent): void {
    event.preventDefault();
    create.mutate(
      {
        employeeId,
        date,
        justified,
        ...(reason.trim() !== '' && { reason: reason.trim() }),
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
        Retour aux absences
      </button>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Employé</span>
        <select
          required
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          disabled={employees.isPending}
          className={fieldClass}
        >
          <option value="">{employees.isPending ? 'Chargement…' : 'Choisir un employé'}</option>
          {employees.data?.items.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.lastName} {employee.firstName} ({employee.matricule})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Date</span>
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <input
          type="checkbox"
          checked={justified}
          onChange={(event) => setJustified(event.target.checked)}
        />
        Absence justifiée
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-4">
        <span className="text-ink-soft">Motif (facultatif)</span>
        <input
          type="text"
          maxLength={500}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className={fieldClass}
        />
      </label>

      {create.isError && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">
          {errorMessage(create.error)}
        </p>
      )}

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <button type="submit" disabled={create.isPending} className={primaryButtonClass}>
          {create.isPending ? 'Enregistrement…' : 'Enregistrer l’absence'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Annuler
        </button>
      </div>
    </form>
  );
}