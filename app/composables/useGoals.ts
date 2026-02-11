import type { GoalWithProgress, Project } from "~/types";

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export const useGoals = () => {
  const goals = useState<GoalWithProgress[]>("goals", () => []);
  const loading = useState<boolean>("goals-loading", () => false);
  const error = useState<string | null>("goals-error", () => null);

  const fetchGoals = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<APIResponse<GoalWithProgress[]>>("/api/goals");
      if (response.success) {
        goals.value = response.data;
      }
    } catch (err: any) {
      error.value = err?.data?.error || "Erro ao carregar metas";
    } finally {
      loading.value = false;
    }
  };

  const fetchGoalById = async (id: string): Promise<GoalWithProgress | null> => {
    try {
      const response = await $fetch<APIResponse<GoalWithProgress>>(`/api/goals/${id}`);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const createGoal = async (data: {
    title: string;
    description?: string;
    color?: string;
    deadline?: string;
  }) => {
    try {
      const response = await $fetch<APIResponse<GoalWithProgress>>("/api/goals", {
        method: "POST",
        body: data,
      });
      if (response.success) {
        goals.value = [response.data, ...goals.value];
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const updateGoal = async (id: string, data: Record<string, any>) => {
    try {
      const response = await $fetch<APIResponse<GoalWithProgress>>(`/api/goals/${id}`, {
        method: "PUT",
        body: data,
      });
      if (response.success) {
        const index = goals.value.findIndex(g => g.id === id);
        if (index !== -1) goals.value[index] = response.data;
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const response = await $fetch<APIResponse<{ deleted: boolean }>>(`/api/goals/${id}`, { method: "DELETE" });
      if (response.success) {
        goals.value = goals.value.filter(g => g.id !== id);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const linkProject = async (goalId: string, projectId: string) => {
    try {
      const response = await $fetch<APIResponse<Project>>(`/api/goals/${goalId}/link-project`, {
        method: "POST",
        body: { projectId },
      });
      return response.success;
    } catch {
      return false;
    }
  };

  const unlinkProject = async (goalId: string, projectId: string) => {
    try {
      const response = await $fetch<APIResponse<Project>>(`/api/goals/${goalId}/unlink-project`, {
        method: "POST",
        body: { projectId },
      });
      return response.success;
    } catch {
      return false;
    }
  };

  const activeGoals = computed(() =>
    goals.value.filter(g => !g.archived && g.status !== "DONE"),
  );

  const completedGoals = computed(() =>
    goals.value.filter(g => g.status === "DONE"),
  );

  const atRiskGoals = computed(() =>
    goals.value.filter(g => g.status === "AT_RISK"),
  );

  return {
    goals,
    loading,
    error,
    activeGoals,
    completedGoals,
    atRiskGoals,
    fetchGoals,
    fetchGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    linkProject,
    unlinkProject,
  };
};
