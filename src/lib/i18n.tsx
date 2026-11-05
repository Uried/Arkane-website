import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  I18nContext,
  initialLang,
  STORAGE_KEY,
  type I18nContextValue,
} from "./i18n-store";
import { dict } from "../i18n/dict";
import type { Lang } from "../types";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable — still works in memory */
    }
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key) => dict[key]?.[lang] ?? String(key),
      pick: (v) => v[lang],
    }),
    [lang],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}
