<template>
  <div class="goal-header" :style="headerAccent">
    <div class="header-top">
      <button class="back-btn" @click="$router.back()">
        <Icon name="lucide:arrow-left" size="18" />
      </button>
      <div class="header-actions">
        <button
          class="action-btn"
          title="Editar meta"
          @click="emit('edit')"
        >
          <Icon name="lucide:pencil" size="16" />
        </button>
        <button
          class="action-btn danger"
          title="Excluir meta"
          @click="emit('delete')"
        >
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <div class="header-body">
      <div class="header-info">
        <div class="header-badges">
          <span :class="['status-badge', `status-${goal.status.toLowerCase().replace('_', '-')}`]">
            {{ statusLabel }}
          </span>
          <span v-if="deadlineFormatted" class="deadline-text">
            <Icon name="lucide:calendar" size="13" />
            {{ deadlineFormatted }}
          </span>
        </div>
        <h1 class="goal-name">{{ goal.title }}</h1>
        <p v-if="goal.description" class="goal-description">{{ goal.description }}</p>
      </div>

      <div class="header-progress">
        <div class="progress-ring-container">
          <svg class="progress-ring" viewBox="0 0 100 100">
            <circle
              class="ring-bg"
              cx="50" cy="50" r="42"
              fill="none"
              stroke-width="6"
            />
            <circle
              class="ring-fill"
              cx="50" cy="50" r="42"
              fill="none"
              stroke-width="6"
              :stroke="goal.color || 'var(--color-primary)'"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeOffset"
              stroke-linecap="round"
            />
          </svg>
          <div class="progress-value">
            <span class="progress-number">{{ goal.progress }}</span>
            <span class="progress-percent">%</span>
          </div>
        </div>
        <div class="progress-meta">
          <span>{{ goal.completedTasks }}/{{ goal.totalTasks }} tarefas</span>
          <span>{{ goal.projectCount }} {{ goal.projectCount === 1 ? 'projeto' : 'projetos' }}</span>
        </div>
      </div>
    </div>

    <div class="clarity-bar">
      <div class="clarity-label">
        <Icon name="lucide:sparkles" size="14" />
        <span>Clareza</span>
      </div>
      <div class="clarity-track">
        <div
          class="clarity-fill"
          :style="{ width: `${goal.clarityScore}%`, backgroundColor: clarityColor }"
        />
      </div>
      <span class="clarity-value">{{ goal.clarityScore }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GoalWithProgress } from "~/types";

interface Props {
  goal: GoalWithProgress;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const circumference = 2 * Math.PI * 42;
const strokeOffset = computed(() =>
  circumference - (props.goal.progress / 100) * circumference,
);

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    IN_PROGRESS: "Em andamento",
    DONE: "Concluída",
  };
  return map[props.goal.status] || props.goal.status;
});

const deadlineFormatted = computed(() => {
  if (!props.goal.deadline) return null;
  return new Date(props.goal.deadline).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

const clarityColor = computed(() => {
  if (props.goal.clarityScore >= 75) return "#10b981";
  if (props.goal.clarityScore >= 50) return "#6faf8e";
  if (props.goal.clarityScore >= 25) return "#f59e0b";
  return "#ef4444";
});

const headerAccent = computed(() => {
  const c = props.goal.color;
  if (!c) return {};
  return { borderBottom: `2px solid ${c}` };
});
</script>

<style scoped>
.goal-header {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.back-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.action-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

.header-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.status-badge.status-in-progress {
  background: rgba(111, 175, 142, 0.12);
  color: #3d7a5a;
}

.status-badge.status-at-risk {
  background: rgba(245, 158, 11, 0.12);
  color: #92400e;
}

.status-badge.status-done {
  background: rgba(16, 185, 129, 0.12);
  color: #065f46;
}

.deadline-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.goal-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.goal-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
  max-width: 520px;
}

.header-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.progress-ring-container {
  position: relative;
  width: 96px;
  height: 96px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  stroke: var(--color-border);
}

.ring-fill {
  transition: stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.progress-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}

.progress-percent {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.progress-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.clarity-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.clarity-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.clarity-track {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 100px;
  overflow: hidden;
}

.clarity-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s ease;
}

.clarity-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .header-body {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .header-progress {
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .progress-ring-container {
    width: 72px;
    height: 72px;
  }

  .progress-number {
    font-size: 18px;
  }

  .goal-name {
    font-size: 22px;
  }

  .goal-header {
    padding: var(--spacing-md);
  }
}
</style>
