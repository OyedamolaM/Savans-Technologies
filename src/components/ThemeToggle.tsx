import { useEffect, useState } from "react";
import { Palette, Square } from "lucide-react";

type Theme = "vivid" | "mono";
const STORAGE_KEY = "savans-theme";

let currentTheme: Theme = "vivid";
const subscribers = new Set<(theme: Theme) => void>();

function isTheme(value: unknown): value is Theme {
  return value === "vivid" || value === "mono";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return currentTheme;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (isTheme(saved)) return saved;

  const documentTheme = document.documentElement.dataset.theme;
  if (isTheme(documentTheme)) return documentTheme;

  return currentTheme;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("theme-vivid", "theme-mono");
  root.classList.add(`theme-${theme}`);
  root.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    const saved = getStoredTheme();
    currentTheme = saved;
    setTheme(saved);
    applyTheme(saved);

    subscribers.add(setTheme);
    return () => {
      subscribers.delete(setTheme);
    };
  }, []);

  const toggle = (next: Theme) => {
    currentTheme = next;
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors, for example private browsing restrictions.
    }
    subscribers.forEach((subscriber) => subscriber(next));
  };

  return { theme, toggle };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card/60 backdrop-blur p-0.5 text-[11px] sm:gap-1 sm:p-1 sm:text-xs"
    >
      <button
        type="button"
        onClick={() => toggle("vivid")}
        aria-pressed={theme === "vivid"}
        className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-full font-medium transition-colors sm:gap-1.5 sm:px-2.5 ${
          theme === "vivid"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Palette className="size-3 sm:size-3.5" />
        Vivid
      </button>
      <button
        type="button"
        onClick={() => toggle("mono")}
        aria-pressed={theme === "mono"}
        className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-full font-medium transition-colors sm:gap-1.5 sm:px-2.5 ${
          theme === "mono"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Square className="size-3 sm:size-3.5" />
        Mono
      </button>
    </div>
  );
}
