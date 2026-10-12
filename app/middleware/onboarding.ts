export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;
  const seen = useCookie("mindle_onboarded");
  if (seen.value) return;
  if (!window.matchMedia("(max-width: 760px)").matches) return;
  return navigateTo("/auth/welcome");
});
