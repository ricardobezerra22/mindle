export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading, fetchUser } = useAuth();

  if (loading.value) {
    await fetchUser();
  }

  const isAuthPage = to.path.startsWith("/auth");
  const isPublicPage = to.path === "/landing";

  if (!user.value && !isAuthPage && !isPublicPage) {
    return navigateTo("/auth/welcome");
  }

  if (user.value && isAuthPage) {
    return navigateTo("/");
  }
});
