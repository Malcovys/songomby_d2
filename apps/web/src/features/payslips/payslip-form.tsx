import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  backButtonClass,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/form-classes';
import { formatMoney } from '@/features/employees/format';
import { useEmployees } from '@/features/employees/use-employees';
import { errorMessage } from '@/lib/error-message';
import { MONTHS } from './format';
import { useGeneratePayslip, usePreviewPayslip } from './use-payslips';

interface PayslipFormProps {
  onDone: () => void;
  onCancel: () => void;
}

export function PayslipForm({ onDone, onCancel }: PayslipFormProps) {
  const now = new Date();
  const employees = useEmployees({ page: 1, limit: 100, search: '', status: 'ACTIVE' });
  const preview = usePreviewPayslip();
  const generate = useGeneratePayslip();

  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [bonuses, setBonuses] = useState('0');

  const input = () => ({ employeeId, month, year, bonuses: Number(bonuses) || 0 });

  // Toute modification invalide l'aperçu déjà calculé
  function edited(): void {
    preview.reset();
    generate.reset();
  }

  function calculate(event: FormEvent): void {
    event.preventDefault();
    generate.reset();
    preview.mutate(input());
  }

  const result = preview.data;
  const busy = preview.isPending || generate.isPending;

  return (
    <form
      onSubmit={calculate}
      className="grid gap-3 border-b border-line bg-paper/50 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <button type="button" onClick={onCancel} disabled={busy} className={backButtonClass}>
        <ArrowLeft className="size-4" aria-hidden />
        Retour aux fiches de paie
      </button>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Employé</span>
        <select
          required
          value={employeeId}
          onChange={(event) => {
            setEmployeeId(event.target.value);
            edited();
          }}
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
        <span className="text-ink-soft">Mois</span>
        <select
          value={month}
          onChange={(event) => {
            setMonth(Number(event.target.value));
            edited();
          }}
          className={fieldClass}
        >
          {MONTHS.map((label, index) => (
            <option key={label} value={index + 1}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink-soft">Année</span>
        <input
          type="number"
          required
          min={2000}
          max={2100}
          value={year}
          onChange={(event) => {
            setYear(Number(event.target.value));
            edited();
          }}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="text-ink-soft">Primes du mois</span>
        <input
          type="number"
          min={0}
          step="any"
          value={bonuses}
          onChange={(event) => {
            setBonuses(event.target.value);
            edited();
          }}
          className={fieldClass}
        />
      </label>

      {result && (
        <dl className="grid gap-x-6 gap-y-2 rounded-md border border-line bg-white p-4 text-sm sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
          <div>
            <dt className="text-ink-soft">Jours ouvrés</dt>
            <dd>{result.workingDays}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Congés sans solde</dt>
            <dd>{result.unpaidLeaveDays} j</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Absences non justifiées</dt>
            <dd>{result.unjustifiedAbsences}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Taux journalier</dt>
            <dd>{formatMoney(result.dailyRate)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Salaire de base</dt>
            <dd>{formatMoney(result.baseSalary)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Retenues</dt>
            <dd>{formatMoney(result.deductions)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Primes</dt>
            <dd>{formatMoney(result.bonuses)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Net à payer</dt>
            <dd className="font-semibold">{formatMoney(result.netSalary)}</dd>
          </div>
        </dl>
      )}

      {(preview.isError || generate.isError) && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">
          {errorMessage(preview.isError ? preview.error : generate.error)}
        </p>
      )}

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <button type="submit" disabled={busy} className={secondaryButtonClass}>
          {preview.isPending ? 'Calcul…' : 'Calculer l’aperçu'}
        </button>
        <button
          type="button"
          disabled={!result || busy}
          onClick={() => generate.mutate(input(), { onSuccess: onDone })}
          className={primaryButtonClass}
        >
          {generate.isPending ? 'Génération…' : 'Générer la fiche'}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Annuler
        </button>
      </div>
    </form>
  );
}