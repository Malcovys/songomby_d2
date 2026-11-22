import type { Proposal } from '@nexora/contracts';

const STATUS_TEXT: Record<Proposal['status'], string> = {
  PREVIEW: 'En attente',
  APPLIED: 'Appliqué',
  CANCELLED: 'Annulé',
  FAILED: 'Échec',
};

interface ProposalCardProps {
  proposal: Proposal;
  busy: boolean;
  onAction: (action: 'apply' | 'cancel') => void;
}

export function ProposalCard({ proposal, busy, onAction }: ProposalCardProps) {
  const pending = proposal.status === 'PREVIEW';

  return (
    <div className="rounded-lg border border-line bg-white p-4 text-sm">
      <p className="text-ink-soft">Action proposée</p>
      <p className="mt-1 font-medium">{proposal.summary}</p>

      {pending ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction('apply')}
            className="h-9 rounded-md bg-accent px-4 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            Appliquer
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction('cancel')}
            className="h-9 rounded-md border border-line px-4 hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60"
          >
            Annuler
          </button>
        </div>
      ) : (
        <p className={`mt-3 ${proposal.status === 'FAILED' ? 'text-red-700' : 'text-ink-soft'}`}>
          {STATUS_TEXT[proposal.status]}
          {proposal.error ? ` : ${proposal.error}` : ''}
        </p>
      )}
    </div>
  );
}