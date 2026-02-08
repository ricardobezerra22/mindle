interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export const useAuth = () => {
  const user = useState<User | null>("auth-user", () => null);
  const loading = useState<boolean>("auth-loading", () => true);

  const fetchUser = async () => {
    loading.value = true;
    try {
      const headers = import.meta.server ? useRequestHeaders(["cookie"]) : {};
      const response = await $fetch("/api/auth/me", { headers });
      if (response.success) {
        user.value = response.data;
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.success) {
        user.value = response.data;
      }

      return response;
    } catch (err: any) {
      const data = err?.data;
      if (data && data.error) {
        return { success: false, error: data.error };
      }
      return { success: false, error: "Erro ao fazer login" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });

    if (response.success) {
      user.value = response.data;
    }

    return response;
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await $fetch("/api/auth/google-login", {
        method: "POST",
        body: { credential },
      });

      if (response.success) {
        user.value = response.data;
      }

      return response;
    } catch (err: any) {
      const data = err?.data;
      if (data && data.error) {
        return { success: false, error: data.error };
      }
      return { success: false, error: "Erro ao fazer login com Google" };
    }
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    navigateTo("/auth/login");
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    login,
    register,
    googleLogin,
    logout,
  };
};
