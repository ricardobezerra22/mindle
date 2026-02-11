interface FocusMetrics {
  totalMinutes: number;
  avgDaily: number;
  completionRate: number;
  topTask: { title: string; minutes: number } | null;
  growth: number;
  sessionCount: number;
  dailyData: Record<string, number>;
}

interface TaskMetrics {
  total: number;
  done: number;
  completionRate: number;
  totalTimeSpent: number;
  byPriority: {
    HIGH: { total: number; done: number };
    MEDIUM: { total: number; done: number };
    LOW: { total: number; done: number };
  };
  favoriteDone: number;
  growth: number;
  dailyCreated: Record<string, number>;
  dailyDone: Record<string, number>;
}

interface ProjectMetrics {
  activeCount: number;
  archivedCount: number;
  avgProgress: number;
  topProject: { id: string; title: string; progress: number; totalTasks: number; doneTasks: number } | null;
  staleProjects: { id: string; title: string; progress: number }[];
  projectProgress: { id: string; title: string; progress: number; totalTasks: number; doneTasks: number; category: { name: string; color: string } | null }[];
}

interface PlannerMetrics {
  planned: number;
  executed: number;
  executionRate: number;
  byWeekday: { label: string; planned: number; done: number }[];
}

interface HabitStat {
  id: string;
  title: string;
  icon: string | null;
  logCount: number;
  consistency: number;
  streak: number;
}

interface HabitMetrics {
  avgConsistency: number;
  best: HabitStat | null;
  neglected: HabitStat | null;
  habits: HabitStat[];
}

interface FinanceMetrics {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  onTimeRate: number;
  overdue: number;
  entryCount: number;
  paidCount: number;
  pendingCount: number;
  byCategory: Record<string, { total: number; paid: number; pending: number }>;
}

interface MoodMetrics {
  total: number;
  distribution: Record<string, number>;
  dailyMoods: { date: string; mood: string }[];
}

export interface DashboardMetrics {
  focus: FocusMetrics;
  tasks: TaskMetrics;
  projects: ProjectMetrics;
  planner: PlannerMetrics;
  habits: HabitMetrics;
  finance: FinanceMetrics;
  mood: MoodMetrics;
}

export type PeriodOption = "today" | "7d" | "30d" | "this-month" | "last-month" | "custom";

export const useDashboardMetrics = () => {
  const metrics = useState<DashboardMetrics | null>("dashboard-metrics", () => null);
  const loading = useState("dashboard-loading", () => false);
  const error = useState<string | null>("dashboard-error", () => null);
  const period = useState<PeriodOption>("dashboard-period", () => "30d");
  const customRange = useState<{ start: string; end: string }>("dashboard-custom-range", () => ({
    start: "",
    end: "",
  }));

  const fetchMetrics = async () => {
    loading.value = true;
    error.value = null;

    try {
      const params: Record<string, string> = {};

      if (period.value === "custom" && customRange.value.start && customRange.value.end) {
        params.startDate = new Date(customRange.value.start).toISOString();
        params.endDate = new Date(customRange.value.end + "T23:59:59").toISOString();
      } else {
        params.period = period.value;
      }

      const response = await $fetch<{ success: boolean; data: DashboardMetrics }>("/api/dashboard/metrics", {
        params,
      });

      if (response.success) {
        metrics.value = response.data;
      }
    } catch (e: any) {
      error.value = e?.message || "Erro ao carregar métricas";
    } finally {
      loading.value = false;
    }
  };

  const setPeriod = (newPeriod: PeriodOption) => {
    period.value = newPeriod;
    if (newPeriod !== "custom") {
      fetchMetrics();
    }
  };

  const setCustomRange = (start: string, end: string) => {
    customRange.value = { start, end };
    period.value = "custom";
    fetchMetrics();
  };

  const periodLabel = computed(() => {
    const labels: Record<PeriodOption, string> = {
      "today": "Hoje",
      "7d": "7 dias",
      "30d": "30 dias",
      "this-month": "Este mês",
      "last-month": "Mês passado",
      "custom": "Personalizado",
    };
    return labels[period.value];
  });

  return {
    metrics,
    loading,
    error,
    period,
    customRange,
    periodLabel,
    fetchMetrics,
    setPeriod,
    setCustomRange,
  };
};
