export const usePalette = () => {
  const { preferences } = usePreferences();
  const cookie = useCookie<string | null>("mindle_palette", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const palette = computed(() =>
    preferences.value.palette === "classic" ? "classic" : "contrastful",
  );

  watch(
    palette,
    (value) => {
      cookie.value = value;
    },
    { immediate: true },
  );

  useHead({
    htmlAttrs: { "data-palette": palette },
    link: computed(() =>
      palette.value === "contrastful"
        ? [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
            {
              rel: "stylesheet",
              href: "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap",
            },
          ]
        : [],
    ),
  });

  return { palette };
};
