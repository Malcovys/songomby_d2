import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Payslip } from '@nexora/contracts';
import { fieldClass, headerButtonClass, rowActionClass } from '@/components/form-classes';
import { Pagination } from '@/components/pagination';
import { formatMoney } from '@/features/employees/format';
import { errorMessage } from '@/lib/error-message';
import { MONTHS, STATUS_LABELS } from './format';
import { PayslipForm } from './payslip-form';
import { useDeletePayslip, usePayslips } from './use-payslips';
import type { PayslipsParams } from './use-payslips';

const PAGE_SIZE = 25;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR + 1, CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

export function PayslipsPage() {
  const [month, setMonth] = useState<PayslipsParams['month']>('');
  const [year, setYear] = useState<PayslipsParams['year']>('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isPending, isError, error, refetch } = usePayslips({
    page,
    limit: PAGE_SIZE,
    month,
    year,
  });
  const remove = useDeletePayslip();

  const filtered = month !== '' || year !== '';

  function onDelete(payslip: Payslip): void {
    const who = `${payslip.employee.firstName} ${payslip.employee.lastName}`;
    const period = `${MONTHS[payslip.month - 1]} ${payslip.year}`;
    if (
      !window.confirm(
        `Supprimer la fiche de paie de ${who} (${period}) ? Vous pourrez la régénérer ensuite.`,
      )
    )
      return;
    remove.mutate(payslip.id);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">
          Fiches de paie
          {data && <span className="ml-2 text-sm font-normal text-ink-soft">{data.total}</span>}
        </h1>

        <label>
          <span className="sr-only">Filtrer par mois</span>
          <select
            value={month}
            onChange={(event) => {
              setMonth(event.target.value === '' ? '' : Number(event.target.value));
              setPage(1);
              remove.reset();
            }}
            className={fieldClass}
          >
            <option value="">Tous les mois</option>
            {MONTHS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filtrer par année</span>
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value === '' ? '' : Number(event.target.value));
              setPage(1);
              remove.reset();
            }}
            className={fieldClass}
          >
            <option value="">Toutes les années</option>
            {YEARS.map((value) => (
              <option key={value} value={value}>
                {value}
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
          Nouvelle fiche
        </button>
      </header>

      {showForm && (
        <PayslipForm
          onCancel={() => setShowForm(false)}
          onDone={() => {
            setShowForm(false);
            setPage(1);
          }}
        />
      )}

      {remove.isError && (
        <p role="alert" className="border-b border-line bg-red-50 px-6 py-2.5 text-sm text-red-800">
          {errorMessage(remove.error)}
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
          <p className="p-6 text-sm text-ink-soft">Chargement des fiches de paie…</p>
        ) : data.items.length === 0 ? (
          <p className="max-w-md p-6 text-sm text-ink-soft">
            {filtered
              ? 'Aucune fiche de paie ne correspond à ces filtres.'
              : 'Aucune fiche de paie pour le moment. Créez-en une avec « Nouvelle fiche ».'}
          </p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b border-line text-ink-soft">
                <th className="px-6 py-2 font-medium">Employé</th>
                <th className="px-4 py-2 font-medium">Période</th>
                <th className="px-4 py-2 text-right font-medium">Base</th>
                <th className="px-4 py-2 text-right font-medium">Retenues</th>
                <th className="px-4 py-2 text-right font-medium">Primes</th>
                <th className="px-4 py-2 text-right font-medium">Net</th>
                <th className="px-4 py-2 font-medium">Statut</th>
                <th className="px-6 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((payslip) => (
                <tr key={payslip.id} className="border-b border-line align-top">
                  <td className="px-6 py-2.5">
                    <div className="font-medium">
                      {payslip.employee.lastName} {payslip.employee.firstName}
                    </div>
                    <div className="text-ink-soft">{payslip.employee.matricule}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    {MONTHS[payslip.month - 1]} {payslip.year}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatMoney(payslip.baseSalary)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatMoney(payslip.deductions)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatMoney(payslip.bonuses)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatMoney(payslip.netSalary)}
                  </td>
                  <td className="px-4 py-2.5">{STATUS_LABELS[payslip.status]}</td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => onDelete(payslip)}
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