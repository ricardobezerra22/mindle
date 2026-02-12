<template>
  <NuxtLink
    :to="`/goals/${goal.id}`"
    class="goal-card"
    :style="cardAccent"
  >
    <div class="goal-top">
      <div class="goal-badges">
        <span
          :class="[
            'status-badge',
            `status-${goal.status.toLowerCase().replace('_', '-')}`,
          ]"
        >
          {{ statusLabel }}
        </span>
        <span
          v-if="isDeadlineClose"
          class="badge-indicator deadline"
        >
          <Icon
            name="lucide:clock"
            size="12"
          />
          {{ daysLeftLabel }}
        </span>
        <span
          v-if="isInactive"
          class="badge-indicator inactive"
        >
          <Icon
            name="lucide:moon"
            size="12"
          />
          Inativa
        </span>
      </div>
      <div
        v-if="goal.color"
        class="goal-accent-dot"
        :style="{ backgroundColor: goal.color }"
      />
    </div>

    <div class="goal-body">
      <h3 class="goal-title">{{ goal.title }}</h3>
      <p
        v-if="goal.description"
        class="goal-description"
      >
        {{ goal.description }}
      </p>
    </div>

    <GoalsGoalProgressBar
      :value="goal.progress"
      :color="goal.color"
      size="md"
    />

    <div class="goal-footer">
      <div class="goal-stat">
        <Icon
          name="lucide:folder"
          size="14"
        />
        <span
          >{{ goal.projectCount }}
          {{ goal.projectCount === 1 ? "projeto" : "projetos" }}</span
        >
      </div>
      <div class="goal-stat">
        <Icon
          name="lucide:check-circle-2"
          size="14"
        />
        <span>{{ goal.completedTasks }}/{{ goal.totalTasks }}</span>
      </div>
      <div
        class="clarity-score"
        :title="`Clareza: ${goal.clarityScore}%`"
      >
        <div class="clarity-dots">
          <span
            v-for="i in 4"
            :key="i"
            :class="[
              'clarity-dot',
              { filled: i <= Math.ceil(goal.clarityScore / 25) },
            ]"
            :style="
              i <= Math.ceil(goal.clarityScore / 25)
                ? { backgroundColor: goal.color || 'var(--color-primary)' }
                : {}
            "
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { GoalWithProgress } from "~/types";

interface Props {
  goal: GoalWithProgress;
}

const props = defineProps<Props>();

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    IN_PROGRESS: "Em andamento",
    DONE: "Concluída",
  };
  return map[props.goal.status] || props.goal.status;
});

const daysLeft = computed(() => {
  if (!props.goal.deadline) return null;
  const diff = new Date(props.goal.deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const isDeadlineClose = computed(() => {
  return daysLeft.value !== null && daysLeft.value >= 0 && daysLeft.value <= 14;
});

const daysLeftLabel = computed(() => {
  if (daysLeft.value === null) return "";
  if (daysLeft.value === 0) return "Hoje";
  if (daysLeft.value === 1) return "Amanhã";
  return `${daysLeft.value}d`;
});

const isInactive = computed(() => {
  if (!props.goal.lastActivity) return true;
  const daysSince = Math.floor(
    (Date.now() - new Date(props.goal.lastActivity).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return daysSince > 10;
});

const cardAccent = computed(() => {
  const color = props.goal.color;
  if (!color) return {};
  return {
    borderTopColor: color,
  };
});
</script>

<style scoped>
.goal-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  cursor: pointer;
}

.goal-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.goal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goal-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
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

.risk-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
  cursor: help;
}

.risk-info-icon {
  opacity: 0.7;
}

.risk-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  padding: 8px 12px;
  background: var(--color-text-primary);
  color: white;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  border-radius: var(--radius-sm);
  text-transform: none;
  letter-spacing: normal;
  z-index: 10;
  pointer-events: none;
  white-space: normal;
}

.risk-tooltip-wrapper:hover .risk-tooltip,
.risk-tooltip-wrapper:focus-within .risk-tooltip {
  display: block;
}

.status-badge.status-done {
  background: rgba(16, 185, 129, 0.12);
  color: #065f46;
}

.badge-indicator {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 100px;
}

.badge-indicator.deadline {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
}

.badge-indicator.inactive {
  background: rgba(107, 124, 122, 0.1);
  color: var(--color-text-secondary);
}

.goal-accent-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.goal-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.goal-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goal-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.goal-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.clarity-score {
  margin-left: auto;
}

.clarity-dots {
  display: flex;
  gap: 3px;
}

.clarity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background-color 0.3s ease;
}

.clarity-dot.filled {
  background: var(--color-primary);
}

@media (max-width: 640px) {
  .goal-card {
    padding: var(--spacing-md);
  }

  .goal-title {
    font-size: 16px;
  }
}
</style>
