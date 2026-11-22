import { useSyncExternalStore } from 'react';
import { PAGES } from './pages';
import type { TabId } from './pages';

interface WorkspaceState {
  tabs: TabId[];
  active: TabId;
}

const STORAGE_KEY = 'nexora.workspace';
const INITIAL: WorkspaceState = { tabs: ['agent'], active: 'agent' };
const VALID_IDS = new Set<string>(['agent', ...PAGES.map((page) => page.id)]);

function load(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const data = JSON.parse(raw) as Partial<WorkspaceState>;
    const tabs = (data.tabs ?? []).filter((id) => VALID_IDS.has(id));
    if (!tabs.includes('agent')) tabs.unshift('agent');
    const active = data.active && tabs.includes(data.active) ? data.active : 'agent';
    return { tabs, active };
  } catch {
    return INITIAL;
  }
}

let state = load();
const listeners = new Set<() => void>();

function setState(next: WorkspaceState): void {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // stockage indisponible : l'état reste en mémoire
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Ouvre l'onglet s'il n'existe pas, puis l'active
export function openTab(id: TabId): void {
  const tabs = state.tabs.includes(id) ? state.tabs : [...state.tabs, id];
  setState({ tabs, active: id });
}

export function activateTab(id: TabId): void {
  if (state.tabs.includes(id)) setState({ ...state, active: id });
}

export function closeTab(id: TabId): void {
  if (id === 'agent') return;
  const index = state.tabs.indexOf(id);
  if (index === -1) return;
  const tabs = state.tabs.filter((tab) => tab !== id);
  const active = state.active === id ? (tabs[index] ?? tabs[index - 1] ?? 'agent') : state.active;
  setState({ tabs, active });
}

export function useWorkspace(): WorkspaceState {
  return useSyncExternalStore(subscribe, () => state);
}