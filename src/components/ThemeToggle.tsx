import { useEffect, useState } from "react";
import { Palette, Square } from "lucide-react";

type Theme = "vivid" | "mono";
const STORAGE_KEY = "savans-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("theme-vivid", "theme-mono");
  root.classList.add(`theme-${theme}`);
  root.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("vivid");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Theme | null)) || "vivid";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggle = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return { theme, toggle };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 backdrop-blur p-1 text-xs"
    >
      <button
        type="button"
        onClick={() => toggle("vivid")}
        aria-pressed={theme === "vivid"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-medium transition-colors ${
          theme === "vivid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Palette className="size-3.5" />
        Vivid
      </button>
      <button
        type="button"
        onClick={() => toggle("mono")}
        aria-pressed={theme === "mono"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-medium transition-colors ${
          theme === "mono" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Square className="size-3.5" />
        Mono
      </button>
    </div>
  );
}
