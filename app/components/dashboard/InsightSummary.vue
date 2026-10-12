<template>
  <div class="insight-card">
    <div class="insight-header">
      <Icon
        name="lucide:sparkles"
        size="18"
      />
      <h3 class="insight-title">
        {{ $t('dashboard.insights.title') }}
      </h3>
    </div>

    <div class="insights-list">
      <div
        v-for="(insight, i) in insights"
        :key="i"
        :class="['insight-item', insight.type]"
      >
        <Icon
          :name="insight.icon"
          size="16"
        />
        <p class="insight-text">
          {{ insight.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardMetrics } from "~/composables/useDashboardMetrics";

interface Props {
  metrics: DashboardMetrics;
  periodLabel: string;
}

const props = defineProps<Props>();
const { t } = useI18n();

interface Insight {
  icon: string;
  text: string;
  type: "positive" | "neutral" | "warning";
}

const formatMinutes = (min: number) => {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${min}min`;
};

const insights = computed<Insight[]>(() => {
  const m = props.metrics;
  const list: Insight[] = [];

  if (m.focus.totalMinutes > 0) {
    list.push({
      icon: "lucide:target",
      text: t("dashboard.insights.focusTime", { time: formatMinutes(m.focus.totalMinutes), period: props.periodLabel.toLowerCase() }),
      type: m.focus.growth >= 0 ? "positive" : "neutral",
    });

    if (m.focus.topTask) {
      list.push({
        icon: "lucide:star",
        text: t("dashboard.insights.topTask", { title: m.focus.topTask.title, time: formatMinutes(m.focus.topTask.minutes) }),
        type: "neutral",
      });
    }

    if (m.focus.growth > 0) {
      list.push({
        icon: "lucide:trending-up",
        text: t("dashboard.insights.focusGrowth", { pct: m.focus.growth }),
        type: "positive",
      });
    } else if (m.focus.growth < 0) {
      list.push({
        icon: "lucide:trending-down",
        text: t("dashboard.insights.focusDrop", { pct: Math.abs(m.focus.growth) }),
        type: "warning",
      });
    }
  }

  if (m.tasks.total > 0) {
    list.push({
      icon: "lucide:check-circle-2",
      text: t("dashboard.insights.tasksCompleted", { done: m.tasks.done, total: m.tasks.total, pct: m.tasks.completionRate }),
      type: m.tasks.completionRate >= 70 ? "positive" : m.tasks.completionRate >= 40 ? "neutral" : "warning",
    });

    const highDone = m.tasks.byPriority.HIGH.done;
    const highTotal = m.tasks.byPriority.HIGH.total;
    if (highTotal > 0) {
      const highRate = Math.round((highDone / highTotal) * 100);
      list.push({
        icon: "lucide:alert-triangle",
        text: highRate >= 70
          ? t("dashboard.insights.highPriorityGood", { pct: highRate })
          : t("dashboard.insights.highPriorityBad", { pct: highRate }),
        type: highRate >= 70 ? "positive" : "warning",
      });
    }
  }

  if (m.projects.topProject && m.projects.topProject.progress > 0) {
    list.push({
      icon: "lucide:folder-kanban",
      text: t("dashboard.insights.topProject", { title: m.projects.topProject.title, pct: m.projects.topProject.progress }),
      type: "positive",
    });
  }

  if (m.projects.staleProjects.length > 0) {
    const names = m.projects.staleProjects.slice(0, 2).map(p => `"${p.title}"`).join(", ");
    list.push({
      icon: "lucide:archive",
      text: m.projects.staleProjects.length === 1
        ? t("dashboard.insights.staleProject", { names })
        : t("dashboard.insights.staleProjects", { names }),
      type: "warning",
    });
  }

  if (m.planner.planned > 0) {
    list.push({
      icon: "lucide:calendar-check",
      text: t("dashboard.insights.plannerRate", { pct: m.planner.executionRate, done: m.planner.executed, planned: m.planner.planned }),
      type: m.planner.executionRate >= 70 ? "positive" : m.planner.executionRate >= 40 ? "neutral" : "warning",
    });
  }

  if (m.habits.best) {
    list.push({
      icon: "lucide:heart",
      text: t("dashboard.insights.bestHabit", { title: m.habits.best.title, pct: m.habits.best.consistency }),
      type: "positive",
    });
  }

  if (m.habits.neglected && m.habits.habits.length > 1 && m.habits.neglected.consistency < 30) {
    list.push({
      icon: "lucide:heart-off",
      text: t("dashboard.insights.neglectedHabit", { title: m.habits.neglected.title, pct: m.habits.neglected.consistency }),
      type: "warning",
    });
  }

  if (m.mood.total > 0) {
    const moodEntries = Object.entries(m.mood.distribution);
    const dominant = moodEntries.sort((a, b) => b[1] - a[1])[0];
    const moodLabelMap: Record<string, string> = {
      HAPPY: t("dashboard.insights.moodLabels.happy"),
      CALMLY: t("dashboard.insights.moodLabels.calmly"),
      OK: t("dashboard.insights.moodLabels.ok"),
      SAD: t("dashboard.insights.moodLabels.sad"),
      TIRED: t("dashboard.insights.moodLabels.tired"),
      OVERWHELMED: t("dashboard.insights.moodLabels.overwhelmed"),
    };
    if (dominant) {
      const label = moodLabelMap[dominant[0]] || dominant[0];
      const pct = Math.round((dominant[1] / m.mood.total) * 100);
      list.push({
        icon: "lucide:smile",
        text: t("dashboard.insights.dominantMood", { mood: label, pct }),
        type: ["HAPPY", "CALMLY"].includes(dominant[0]) ? "positive" : ["SAD", "OVERWHELMED"].includes(dominant[0]) ? "warning" : "neutral",
      });
    }

    const bestMoodHabit = Object.entries(m.mood.moodHabitCorrelation).sort((a, b) => b[1] - a[1])[0];
    if (bestMoodHabit && bestMoodHabit[1] > 50) {
      const label = moodLabelMap[bestMoodHabit[0]] || bestMoodHabit[0];
      list.push({
        icon: "lucide:heart-handshake",
        text: t("dashboard.insights.moodHabit", { mood: label, pct: bestMoodHabit[1] }),
        type: "positive",
      });
    }
  }

  if (m.finance.overdue > 0) {
    list.push({
      icon: "lucide:alert-circle",
      text: t("dashboard.insights.overdueFinance", { count: m.finance.overdue, label: t("dashboard.insights.overdueLabel", m.finance.overdue) }),
      type: "warning",
    });
  }

  if (m.finance.pendingCount > 0 && m.finance.overdue === 0) {
    list.push({
      icon: "lucide:wallet",
      text: t("dashboard.insights.pendingFinance", { count: m.finance.pendingCount, label: t("dashboard.insights.pendingLabel", m.finance.pendingCount) }),
      type: "neutral",
    });
  }

  if (list.length === 0) {
    list.push({
      icon: "lucide:coffee",
      text: t("dashboard.insights.noData"),
      type: "neutral",
    });
  }

  return list;
});
</script>

<style scoped>
.insight-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
}

.insight-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
}

.insight-item.positive {
  background: rgba(16, 185, 129, 0.06);
  color: #059669;
}

.insight-item.positive :deep(svg) {
  color: #059669;
  flex-shrink: 0;
  margin-top: 2px;
}

.insight-item.neutral {
  background: rgba(111, 175, 142, 0.06);
  color: var(--color-text-secondary);
}

.insight-item.neutral :deep(svg) {
  color: var(--color-text-secondary);
  flex-shrink: 0;
  margin-top: 2px;
}

.insight-item.warning {
  background: rgba(245, 158, 11, 0.06);
  color: #b45309;
}

.insight-item.warning :deep(svg) {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.insight-text {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: inherit;
}

@media (max-width: 640px) {
  .insight-card {
    padding: var(--spacing-md);
  }

  .insight-item {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .insight-text {
    font-size: 12px;
  }
}
</style>
