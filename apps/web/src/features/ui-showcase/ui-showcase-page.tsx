import { ArrowRight, Bell, MoreHorizontal, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AiButton, Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { Count } from '@/components/ui/count';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { SearchField } from '@/components/ui/search-field';
import { Status } from '@/components/ui/status';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h2 font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;

/** Vitrine des composants réutilisables du design system (route /ui). */
export function UiShowcasePage() {
  const [tab, setTab] = useState('overview');
  const [period, setPeriod] = useState('day');
  const [chip, setChip] = useState('all');
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark' : undefined}>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 bg-bg-surface px-6 py-12 text-text-primary">
        <header className="flex items-center justify-between">
          <h1 className="text-h1 font-semibold">Composants</h1>
          <Button variant="secondary" size="s" onClick={() => setDark((value) => !value)}>
            {dark ? 'Mode clair' : 'Mode sombre'}
          </Button>
        </header>

        <Section title="Button">
          {variants.map((variant) => (
            <div key={variant} className="flex w-full flex-wrap items-center gap-4">
              <Button variant={variant} leadingIcon={<Plus />}>
                Bouton
              </Button>
              <Button variant={variant} size="s" leadingIcon={<Plus />}>
                Bouton
              </Button>
              <Button variant={variant} trailingIcon={<ArrowRight />}>
                Bouton
              </Button>
              <Button variant={variant} leadingIcon={<Plus />} disabled>
                Bouton
              </Button>
              <Button variant={variant} leadingIcon={<Plus />} loading>
                Bouton
              </Button>
            </div>
          ))}
        </Section>

        <Section title="Button / AI">
          <AiButton />
          <AiButton size="s" />
          <AiButton disabled />
        </Section>

        <Section title="Icon Button">
          <Tooltip content="Plus d’options">
            <IconButton aria-label="Plus d’options">
              <MoreHorizontal />
            </IconButton>
          </Tooltip>
          <IconButton size="s" aria-label="Fermer">
            <X />
          </IconButton>
          <Tooltip content="Notifications" placement="bottom">
            <IconButton variant="secondary" aria-label="Notifications">
              <Bell />
            </IconButton>
          </Tooltip>
          <IconButton variant="secondary" size="s" aria-label="Notifications" disabled>
            <Bell />
          </IconButton>
        </Section>

        <Section title="Badge · Status · Count">
          <Badge>Statut</Badge>
          <Badge tone="primary">Statut</Badge>
          <Badge tone="success">Statut</Badge>
          <Badge tone="warning">Statut</Badge>
          <Badge tone="danger">Statut</Badge>
          <Badge tone="ai">Statut</Badge>
          <Status>Statut</Status>
          <Status tone="info">Statut</Status>
          <Status tone="success">Statut</Status>
          <Status tone="warning">Statut</Status>
          <Status tone="danger">Statut</Status>
          <Status tone="ai">Statut</Status>
          <Count value={6} />
          <Count tone="attention" value={6} />
          <Count tone="muted" value={6} />
          <Count tone="plain" value={6} />
          <Count tone="attention" value={120} />
        </Section>

        <Section title="Kbd · Avatar">
          <Kbd>Ctrl K</Kbd>
          <Avatar name="Aina Bema" />
          <Avatar name="Aina Bema" size="m" />
          <Avatar name="Aina Bema" size="l" />
        </Section>

        <Section title="Chip">
          {['all', 'open', 'closed'].map((value) => (
            <Chip
              key={value}
              label={value === 'all' ? 'Tous' : value === 'open' ? 'Ouverts' : 'Clos'}
              count={24}
              selected={chip === value}
              onClick={() => setChip(value)}
            />
          ))}
          <Chip label="Filtre" count={24} disabled />
        </Section>

        <Section title="Checkbox">
          <Checkbox label="Libellé" />
          <Checkbox label="Libellé" defaultChecked />
          <Checkbox label="Libellé" indeterminate />
          <Checkbox label="Libellé" disabled />
          <Checkbox label="Libellé" defaultChecked disabled />
          <Checkbox label="Libellé" indeterminate disabled />
        </Section>

        <Section title="Input · Search Field">
          <div className="grid w-full gap-6 sm:grid-cols-3">
            <Input label="Libellé" placeholder="ex : Jean" helper="Texte d’aide facultatif." />
            <Input
              label="Libellé"
              defaultValue="Jean Rakoto"
              error="Indiquez un nom valide."
            />
            <Input
              label="Libellé"
              placeholder="ex : Jean"
              helper="Texte d’aide facultatif."
              disabled
            />
          </div>
          <SearchField shortcut containerClassName="w-65" />
        </Section>

        <Section title="Tabs">
          <div className="flex w-full flex-col gap-6">
            <Tabs
              aria-label="Sections de la fiche"
              value={tab}
              onValueChange={setTab}
              items={[
                { value: 'overview', label: 'Vue d’ensemble' },
                { value: 'details', label: 'Détails', count: 3 },
                { value: 'history', label: 'Historique' },
                { value: 'archives', label: 'Archives', disabled: true },
              ]}
            />
            <Tabs
              aria-label="Période"
              variant="segmented"
              value={period}
              onValueChange={setPeriod}
              items={[
                { value: 'day', label: 'Jour' },
                { value: 'week', label: 'Semaine' },
                { value: 'month', label: 'Mois' },
              ]}
            />
          </div>
        </Section>

        <Section title="Alert">
          {(['info', 'success', 'warning', 'danger', 'ai'] as const).map((tone) => (
            <Alert
              key={tone}
              tone={tone}
              className="max-w-140"
              title="Titre du message"
              description="Explication courte et action recommandée."
              action={
                <Button variant="ghost" size="s">
                  Voir le détail
                </Button>
              }
              onDismiss={() => undefined}
            />
          ))}
        </Section>
      </main>
    </div>
  );
}
