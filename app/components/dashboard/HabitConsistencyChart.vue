<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:heart" size="16" />
        <h3 class="chart-title">Consistência dos Hábitos</h3>
      </div>
      <span class="chart-subtitle">% de dias cumpridos no período</span>
    </div>
    <div class="chart-body">
      <div
        v-if="habits.length > 0"
        class="habit-bars"
      >
        <div
          v-for="habit in habits"
          :key="habit.id"
          class="habit-row"
        >
          <div class="habit-info">
            <Icon
              :name="habit.icon || 'lucide:circle'"
              size="16"
            />
            <span class="habit-name">{{ habit.title }}</span>
          </div>
          <div class="habit-bar-wrap">
            <div class="habit-bar-track">
              <div
                class="habit-bar-fill"
                :style="{ width: `${habit.consistency}%`, backgroundColor: consistencyColor(habit.consistency) }"
              />
            </div>
            <span class="habit-pct">{{ habit.consistency }}%</span>
          </div>
          <span
            v-if="habit.streak > 0"
            class="habit-streak"
          >
            <Icon name="lucide:flame" size="12" />
            {{ habit.streak }}d
          </span>
        </div>
      </div>
      <div v-else class="chart-empty">
        <span>Sem hábitos cadastrados</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HabitStat {
  id: string;
  title: string;
  icon: string | null;
  logCount: number;
  consistency: number;
  streak: number;
}

interface Props {
  habits: HabitStat[];
}

defineProps<Props>();

const consistencyColor = (pct: number) => {
  if (pct >= 80) return "#10b981";
  if (pct >= 50) return "#6faf8e";
  if (pct >= 25) return "#f59e0b";
  return "#e5e7eb";
};
</script>

<style scoped>
.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.chart-subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.chart-body {
  min-height: 100px;
}

.habit-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.habit-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.habit-info {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 120px;
  flex-shrink: 0;
  color: var(--color-text-primary);
}

.habit-name {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.habit-bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.habit-bar-track {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
}

.habit-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.habit-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 32px;
  text-align: right;
}

.habit-streak {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
  white-space: nowrap;
}

.chart-empty {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 13px;
}

@media (max-width: 640px) {
  .chart-card {
    padding: var(--spacing-md);
  }

  .habit-info {
    width: 80px;
  }

  .habit-name {
    font-size: 12px;
  }
}
</style>
