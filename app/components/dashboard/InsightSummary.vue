<template>
  <div class="insight-card">
    <div class="insight-header">
      <Icon name="lucide:sparkles" size="18" />
      <h3 class="insight-title">Resumo Inteligente</h3>
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
        <p class="insight-text">{{ insight.text }}</p>
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
      text: `Você dedicou ${formatMinutes(m.focus.totalMinutes)} ao foco profundo (${props.periodLabel.toLowerCase()}).`,
      type: m.focus.growth >= 0 ? "positive" : "neutral",
    });

    if (m.focus.topTask) {
      list.push({
        icon: "lucide:star",
        text: `Sua tarefa mais focada foi "${m.focus.topTask.title}" com ${formatMinutes(m.focus.topTask.minutes)}.`,
        type: "neutral",
      });
    }

    if (m.focus.growth > 0) {
      list.push({
        icon: "lucide:trending-up",
        text: `Seu foco cresceu ${m.focus.growth}% comparado ao período anterior.`,
        type: "positive",
      });
    } else if (m.focus.growth < 0) {
      list.push({
        icon: "lucide:trending-down",
        text: `Seu foco caiu ${Math.abs(m.focus.growth)}% comparado ao período anterior.`,
        type: "warning",
      });
    }
  }

  if (m.tasks.total > 0) {
    list.push({
      icon: "lucide:check-circle-2",
      text: `Você completou ${m.tasks.done} de ${m.tasks.total} tarefas (${m.tasks.completionRate}%).`,
      type: m.tasks.completionRate >= 70 ? "positive" : m.tasks.completionRate >= 40 ? "neutral" : "warning",
    });

    const highDone = m.tasks.byPriority.HIGH.done;
    const highTotal = m.tasks.byPriority.HIGH.total;
    if (highTotal > 0) {
      const highRate = Math.round((highDone / highTotal) * 100);
      list.push({
        icon: "lucide:alert-triangle",
        text: highRate >= 70
          ? `Ótimo desempenho em tarefas de alta prioridade: ${highRate}% concluídas.`
          : `Atenção: apenas ${highRate}% das tarefas de alta prioridade foram concluídas.`,
        type: highRate >= 70 ? "positive" : "warning",
      });
    }
  }

  if (m.projects.topProject && m.projects.topProject.progress > 0) {
    list.push({
      icon: "lucide:folder-kanban",
      text: `Seu projeto "${m.projects.topProject.title}" avançou para ${m.projects.topProject.progress}%.`,
      type: "positive",
    });
  }

  if (m.projects.staleProjects.length > 0) {
    const names = m.projects.staleProjects.slice(0, 2).map(p => `"${p.title}"`).join(", ");
    list.push({
      icon: "lucide:archive",
      text: `${m.projects.staleProjects.length === 1 ? "Projeto" : "Projetos"} sem atualização recente: ${names}.`,
      type: "warning",
    });
  }

  if (m.planner.planned > 0) {
    list.push({
      icon: "lucide:calendar-check",
      text: `Taxa de execução do planejamento: ${m.planner.executionRate}% (${m.planner.executed}/${m.planner.planned}).`,
      type: m.planner.executionRate >= 70 ? "positive" : m.planner.executionRate >= 40 ? "neutral" : "warning",
    });
  }

  if (m.habits.best) {
    list.push({
      icon: "lucide:heart",
      text: `Seu hábito mais consistente foi "${m.habits.best.title}" com ${m.habits.best.consistency}%.`,
      type: "positive",
    });
  }

  if (m.habits.neglected && m.habits.habits.length > 1 && m.habits.neglected.consistency < 30) {
    list.push({
      icon: "lucide:heart-off",
      text: `"${m.habits.neglected.title}" precisa de atenção: apenas ${m.habits.neglected.consistency}% de consistência.`,
      type: "warning",
    });
  }

  if (m.mood.total > 0) {
    const moodEntries = Object.entries(m.mood.distribution);
    const dominant = moodEntries.sort((a, b) => b[1] - a[1])[0];
    const moodLabels: Record<string, string> = {
      HAPPY: "feliz", CALMLY: "calmo", OK: "neutro",
      SAD: "triste", TIRED: "cansado", OVERWHELMED: "sobrecarregado",
    };
    if (dominant) {
      const label = moodLabels[dominant[0]] || dominant[0];
      const pct = Math.round((dominant[1] / m.mood.total) * 100);
      list.push({
        icon: "lucide:smile",
        text: `Seu humor predominante foi "${label}" em ${pct}% dos dias registrados.`,
        type: ["HAPPY", "CALMLY"].includes(dominant[0]) ? "positive" : ["SAD", "OVERWHELMED"].includes(dominant[0]) ? "warning" : "neutral",
      });
    }

    const bestMoodHabit = Object.entries(m.mood.moodHabitCorrelation).sort((a, b) => b[1] - a[1])[0];
    if (bestMoodHabit && bestMoodHabit[1] > 50) {
      const label = moodLabels[bestMoodHabit[0]] || bestMoodHabit[0];
      list.push({
        icon: "lucide:heart-handshake",
        text: `Nos dias em que você se sentiu "${label}", completou ${bestMoodHabit[1]}% dos hábitos.`,
        type: "positive",
      });
    }
  }

  if (m.finance.overdue > 0) {
    list.push({
      icon: "lucide:alert-circle",
      text: `Finanças pedem atenção: ${m.finance.overdue} ${m.finance.overdue === 1 ? "pendência vencida" : "pendências vencidas"}.`,
      type: "warning",
    });
  }

  if (m.finance.pendingCount > 0 && m.finance.overdue === 0) {
    list.push({
      icon: "lucide:wallet",
      text: `${m.finance.pendingCount} ${m.finance.pendingCount === 1 ? "pagamento pendente" : "pagamentos pendentes"} no período.`,
      type: "neutral",
    });
  }

  if (list.length === 0) {
    list.push({
      icon: "lucide:coffee",
      text: "Ainda não há dados suficientes neste período para gerar insights.",
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
