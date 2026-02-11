<template>
  <div
    v-if="insights.length > 0"
    class="insights-card"
  >
    <div class="insights-header">
      <Icon name="lucide:lightbulb" size="16" />
      <h3 class="insights-title">Insights</h3>
    </div>
    <div class="insights-list">
      <div
        v-for="(insight, i) in insights"
        :key="i"
        :class="['insight-item', insight.type]"
      >
        <Icon :name="insight.icon" size="16" />
        <p class="insight-text">{{ insight.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GoalWithProgress } from "~/types";

interface Props {
  goal: GoalWithProgress;
}

const props = defineProps<Props>();

interface Insight {
  icon: string;
  text: string;
  type: "positive" | "warning" | "neutral";
}

const insights = computed(() => {
  const list: Insight[] = [];
  const g = props.goal;

  if (g.progress === 100) {
    list.push({
      icon: "lucide:trophy",
      text: "Meta concluída! Parabéns pelo seu progresso.",
      type: "positive",
    });
    return list;
  }

  if (g.lastActivity) {
    const daysSince = Math.floor(
      (Date.now() - new Date(g.lastActivity).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSince > 10) {
      list.push({
        icon: "lucide:alert-circle",
        text: `Você não avançou nesta meta nos últimos ${daysSince} dias.`,
        type: "warning",
      });
    } else if (daysSince <= 3 && g.progress > 0) {
      list.push({
        icon: "lucide:zap",
        text: "Excelente consistência. Continue nesse ritmo.",
        type: "positive",
      });
    }
  }

  if (g.deadline) {
    const daysLeft = Math.ceil(
      (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0) {
      list.push({
        icon: "lucide:alert-triangle",
        text: `O prazo desta meta expirou há ${Math.abs(daysLeft)} dias.`,
        type: "warning",
      });
    } else if (daysLeft <= 14) {
      list.push({
        icon: "lucide:clock",
        text: `Faltam ${daysLeft} dias para concluir esta meta.`,
        type: "warning",
      });
    }

    if (daysLeft > 0 && g.progress > 0) {
      const expectedProgress = Math.min(100, Math.round(
        ((Date.now() - new Date(g.createdAt).getTime()) /
        (new Date(g.deadline).getTime() - new Date(g.createdAt).getTime())) * 100,
      ));
      if (g.progress < expectedProgress - 15) {
        list.push({
          icon: "lucide:trending-down",
          text: `Progresso está abaixo do esperado para o prazo (${g.progress}% vs ${expectedProgress}% esperado).`,
          type: "warning",
        });
      }
    }
  }

  if (g.projectCount === 0) {
    list.push({
      icon: "lucide:folder-plus",
      text: "Vincule projetos a esta meta para acompanhar o progresso.",
      type: "neutral",
    });
  }

  if (g.totalTasks === 0 && g.projectCount > 0) {
    list.push({
      icon: "lucide:list-plus",
      text: "Seus projetos ainda não possuem tarefas. Adicione tarefas para medir o progresso.",
      type: "neutral",
    });
  }

  if (g.clarityScore < 50) {
    list.push({
      icon: "lucide:compass",
      text: "Defina prazo, vincule projetos e crie tarefas para aumentar a clareza desta meta.",
      type: "neutral",
    });
  }

  if (list.length === 0) {
    list.push({
      icon: "lucide:sparkles",
      text: "Tudo certo! Continue trabalhando em direção à sua meta.",
      type: "positive",
    });
  }

  return list;
});
</script>

<style scoped>
.insights-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.insights-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
}

.insights-title {
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
  transition: background-color 0.15s ease;
}

.insight-item.positive {
  background: rgba(16, 185, 129, 0.06);
  color: #065f46;
}

.insight-item.positive :deep(svg) {
  color: #10b981;
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

.insight-item.neutral {
  background: rgba(107, 124, 122, 0.06);
  color: var(--color-text-secondary);
}

.insight-item.neutral :deep(svg) {
  color: var(--color-text-secondary);
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
  .insights-card {
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
