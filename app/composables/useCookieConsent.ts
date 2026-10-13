export const useCookieConsent = () => {
  const consent = useCookie<"required" | "all" | null>("cookie_consent", {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const hasConsent = computed(() => consent.value !== null);

  const acceptRequired = () => {
    consent.value = "required";
  };

  const acceptAll = () => {
    consent.value = "all";
  };

  return { consent, hasConsent, acceptRequired, acceptAll };
};
