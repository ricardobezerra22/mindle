<template>
  <div class="dashboard">
    <section class="greeting-section">
      <div class="greeting-content">
        <h1 class="greeting-text">
          {{ greetingMessage }}, {{ userName }}
        </h1>
        <p class="context-line">
          {{ contextLine }}
        </p>
      </div>
      <div class="greeting-date">
        <span class="date-day">{{ todayFormatted.day }}</span>
        <span class="date-full">{{ todayFormatted.full }}</span>
      </div>
    </section>

    <DashboardDateFilter />

    <DashboardSkeleton v-if="metricsLoading && !metrics" />

    <template v-else-if="metrics">
      <Transition name="fade-content" mode="out-in">
        <div
          :key="period"
          class="metrics-content"
        >
          <section class="kpi-grid">
            <DashboardKpiCard
              icon="lucide:target"
              :value="metrics.focus.totalMinutes"
              label="Minutos de foco"
              format="minutes"
              :growth="metrics.focus.growth"
              color="#6faf8e"
              :subtitle="metrics.focus.topTask ? `Top: ${metrics.focus.topTask.title}` : undefined"
            />
            <DashboardKpiCard
              icon="lucide:check-circle-2"
              :value="metrics.tasks.done"
              :label="`de ${metrics.tasks.total} tarefas`"
              :growth="metrics.tasks.growth"
              color="#10b981"
              :subtitle="`Taxa: ${metrics.tasks.completionRate}%`"
            />
            <DashboardKpiCard
              icon="lucide:folder-kanban"
              :value="metrics.projects.activeCount"
              label="Projetos ativos"
              color="#6366f1"
              :subtitle="`Progresso médio: ${metrics.projects.avgProgress}%`"
            />
            <DashboardKpiCard
              icon="lucide:calendar-check"
              :value="`${metrics.planner.executionRate}%`"
              label="Execução do planner"
              color="#f59e0b"
              :subtitle="`${metrics.planner.executed}/${metrics.planner.planned} executadas`"
            />
            <DashboardKpiCard
              icon="lucide:heart"
              :value="`${metrics.habits.avgConsistency}%`"
              label="Consistência hábitos"
              color="#ec4899"
              :subtitle="metrics.habits.best ? `Melhor: ${metrics.habits.best.title}` : undefined"
            />
            <DashboardKpiCard
              icon="lucide:wallet"
              :value="metrics.finance.totalPending"
              label="Pendente"
              format="currency"
              color="#ef4444"
              :subtitle="metrics.finance.overdue > 0 ? `${metrics.finance.overdue} vencido(s)` : `${metrics.finance.onTimeRate}% em dia`"
            />
          </section>

          <section class="charts-grid">
            <DashboardFocusChart :daily-data="metrics.focus.dailyData" />
            <DashboardTaskPriorityChart :by-priority="metrics.tasks.byPriority" />
          </section>

          <section class="charts-grid">
            <DashboardProjectProgressChart :projects="metrics.projects.projectProgress" />
            <DashboardFinanceChart
              :total-paid="metrics.finance.totalPaid"
              :total-pending="metrics.finance.totalPending"
            />
          </section>

          <section class="charts-grid single">
            <DashboardHabitConsistencyChart :habits="metrics.habits.habits" />
          </section>

          <section class="charts-grid">
            <DashboardMoodChart
              :distribution="metrics.mood.distribution"
              :energy-distribution="metrics.mood.energyDistribution"
              :mood-habit-correlation="metrics.mood.moodHabitCorrelation"
            />
          </section>

          <DashboardInsightSummary
            :metrics="metrics"
            :period-label="periodLabel"
          />
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
const {
  metrics,
  loading: metricsLoading,
  period,
  periodLabel,
  fetchMetrics,
} = useDashboardMetrics();

const userName = computed(() => {
  const user = useAuth().user;
  const name = user.value?.name;
  return name ? name.split(" ")[0] : "";
});

const greetingMessage = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

const todayFormatted = computed(() => {
  const now = new Date();
  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  return {
    day: dayNames[now.getDay()],
    full: now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" }),
  };
});

const contextLine = computed(() => {
  return "Análise detalhada do seu desempenho.";
});

onMounted(() => {
  fetchMetrics();
});
</script>

<style scoped lang="css">
.dashboard {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.greeting-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.greeting-content {
  flex: 1;
}

.greeting-text {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.context-line {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: 1.5;
}

.greeting-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.date-day {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.date-full {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.metrics-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.charts-grid.single {
  grid-template-columns: 1fr;
}

.fade-content-enter-active,
.fade-content-leave-active {
  transition: opacity 0.25s ease;
}

.fade-content-enter-from,
.fade-content-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .greeting-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .greeting-date {
    align-items: flex-start;
  }

  .greeting-text {
    font-size: 22px;
  }

  .kpi-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .charts-grid {
    gap: var(--spacing-sm);
  }
}

@media (max-width: 400px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
