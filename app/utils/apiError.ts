export function resolveApiError(err: unknown, fallback?: string): string {
  const { t, te } = useNuxtApp().$i18n;
  const fe = err as { statusCode?: number; data?: { error?: string } };
  if (fe.data?.error) return fe.data.error;
  const key = `errors.${fe.statusCode}`;
  if (fe.statusCode !== undefined && te(key)) return t(key);
  return fallback ?? t("errors.generic");
}
