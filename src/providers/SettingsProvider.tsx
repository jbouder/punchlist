import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Priority } from '@/lib/tasks';

const STORAGE_KEY = 'punchlist:settings';

export interface Settings {
  workspace: string;
  defaultAssignee: string;
  defaultPriority: Priority;
  defaultDue: string;
}

export const DEFAULT_SETTINGS: Settings = {
  workspace: 'Platform team',
  defaultAssignee: 'JB',
  defaultPriority: 'medium',
  defaultDue: 'Next week',
};

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
    }
  } catch {
    // Fall through to the defaults.
  }
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable; the session still works.
    }
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
