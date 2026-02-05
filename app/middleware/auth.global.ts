export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading, fetchUser } = useAuth();

  if (loading.value && !user.value) {
    await fetchUser();
  }

  const isAuthPage = to.path.startsWith("/auth");

  if (!user.value && !isAuthPage) {
    return navigateTo("/auth/login");
  }

  if (user.value && isAuthPage) {
    return navigateTo("/");
  }
});
