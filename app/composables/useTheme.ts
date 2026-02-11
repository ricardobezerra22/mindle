export const useTheme = () => {
  const { preferences } = usePreferences();

  const resolvedTheme = computed(() => {
    if (preferences.value.theme === "system") {
      if (import.meta.server) return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return preferences.value.theme;
  });

  const applyTheme = () => {
    if (import.meta.server) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme.value);
  };

  const applyFontSize = () => {
    if (import.meta.server) return;
    const root = document.documentElement;
    const sizes: Record<string, string> = {
      small: "13px",
      normal: "14px",
      large: "16px",
    };
    root.style.fontSize = sizes[preferences.value.fontSize] || "14px";
  };

  watch(resolvedTheme, applyTheme);
  watch(() => preferences.value.fontSize, applyFontSize);
  watch(() => preferences.value.theme, () => {
    applyTheme();
  });

  const init = () => {
    applyTheme();
    applyFontSize();

    if (import.meta.client) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);
    }
  };

  return { resolvedTheme, applyTheme, applyFontSize, init };
};
