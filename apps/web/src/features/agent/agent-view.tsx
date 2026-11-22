import { ArrowUp, FileText, Paperclip, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  files: string[];
}

const SUGGESTIONS = [
  'Ajouter les jours fériés de décembre',
  'Donner les fiches de paie du mois',
  'Créer un ticket pour renouveler un contrat',
  'Importer les employés depuis un fichier',
];

const NOT_CONNECTED = "Je ne suis pas encore connecté au serveur : cette demande n'a rien modifié.";

export function AgentView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const canSend = draft.trim().length > 0 || files.length > 0;
  const empty = messages.length === 0;

  function send(): void {
    if (!canSend) return;
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text: draft.trim(),
        files: files.map((file) => file.name),
      },
      { id: crypto.randomUUID(), role: 'assistant', text: NOT_CONNECTED, files: [] },
    ]);
    setDraft('');
    setFiles([]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  }

  function addFiles(list: FileList | null): void {
    if (!list || list.length === 0) return;
    setFiles((previous) => [...previous, ...Array.from(list)]);
    if (fileInput.current) fileInput.current.value = '';
  }

  const composer = (
    <div
      className="rounded-xl border border-line bg-white p-3 focus-within:border-accent"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        addFiles(event.dataTransfer.files);
      }}
    >
      {files.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="inline-flex items-center gap-1.5 rounded border border-line bg-panel px-2 py-1 text-xs"
            >
              <FileText className="size-3.5 text-ink-soft" aria-hidden />
              {file.name}
              <button
                type="button"
                aria-label={`Retirer ${file.name}`}
                onClick={() => setFiles((previous) => previous.filter((_, i) => i !== index))}
                className="rounded text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <textarea
        aria-label="Votre demande"
        autoFocus
        rows={2}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Demandez une action ou glissez un fichier ici"
        className="field-sizing-content max-h-48 min-h-14 w-full resize-none bg-transparent text-sm outline-none placeholder:text-ink-soft"
      />

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Joindre un fichier"
          onClick={() => fileInput.current?.click()}
          className="rounded p-1.5 text-ink-soft hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Paperclip className="size-4" aria-hidden />
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
        <button
          type="button"
          aria-label="Envoyer"
          disabled={!canSend}
          onClick={send}
          className="grid size-8 place-items-center rounded-full bg-accent text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:bg-line disabled:text-ink-soft"
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {empty ? (
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-5 px-6 py-8">
            <h1 className="text-2xl font-semibold tracking-tight">Que voulez-vous faire ?</h1>
            {composer}
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => setDraft(suggestion)}
                    className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-6 py-8">
            {messages.map((message) =>
              message.role === 'user' ? (
                <div
                  key={message.id}
                  className="ml-auto max-w-[85%] rounded-lg bg-accent-soft px-4 py-2.5 text-sm"
                >
                  {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                  {message.files.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {message.files.map((name, index) => (
                        <li
                          key={`${name}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded bg-white/70 px-2 py-1 text-xs"
                        >
                          <FileText className="size-3.5" aria-hidden />
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p key={message.id} className="max-w-[85%] text-sm text-ink-soft">
                  {message.text}
                </p>
              ),
            )}
            <div ref={bottom} />
          </div>
        )}
      </div>

      {!empty && <div className="mx-auto w-full max-w-2xl px-6 pb-6">{composer}</div>}
    </div>
  );
}