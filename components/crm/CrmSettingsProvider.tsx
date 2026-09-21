"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CRM_SETTINGS_KEY,
  defaultCrmSettings,
  parseCrmSettings,
  type CrmSettings,
} from "@/lib/crm/settings";

type CrmSettingsContextValue = {
  settings: CrmSettings;
  setSettings: (next: CrmSettings | ((current: CrmSettings) => CrmSettings)) => void;
  saveSettings: (next?: CrmSettings) => void;
  resetSettings: () => void;
  savedAt: string | null;
};

const CrmSettingsContext = createContext<CrmSettingsContextValue | null>(null);

export function CrmSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<CrmSettings>(defaultCrmSettings);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CRM_SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { settings?: unknown; savedAt?: string };
      setSettingsState(parseCrmSettings(parsed.settings ?? parsed));
      setSavedAt(typeof parsed.savedAt === "string" ? parsed.savedAt : null);
    } catch {
      setSettingsState(defaultCrmSettings);
    }
  }, []);

  const value = useMemo<CrmSettingsContextValue>(() => {
    function persist(next: CrmSettings) {
      const stamp = new Date().toISOString();
      window.localStorage.setItem(CRM_SETTINGS_KEY, JSON.stringify({ settings: next, savedAt: stamp }));
      setSavedAt(stamp);
    }

    return {
      settings,
      setSettings: setSettingsState,
      saveSettings(next) {
        const payload = next ?? settings;
        setSettingsState(payload);
        persist(payload);
      },
      resetSettings() {
        setSettingsState(defaultCrmSettings);
        persist(defaultCrmSettings);
      },
      savedAt,
    };
  }, [savedAt, settings]);

  return <CrmSettingsContext.Provider value={value}>{children}</CrmSettingsContext.Provider>;
}

export function useCrmSettings() {
  const context = useContext(CrmSettingsContext);
  if (!context) {
    throw new Error("useCrmSettings must be used inside CrmSettingsProvider");
  }
  return context;
}
