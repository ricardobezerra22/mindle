<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:smile" size="16" />
        <h3 class="chart-title">Humor e Energia</h3>
      </div>
      <span class="chart-subtitle">Distribuição no período</span>
    </div>

    <div class="chart-body">
      <template v-if="hasMoodData">
        <div class="mood-distribution">
          <div
            v-for="item in moodItems"
            :key="item.mood"
            class="mood-bar-row"
          >
            <div class="mood-bar-label">
              <span class="mood-emoji">{{ item.emoji }}</span>
              <span class="mood-name">{{ item.label }}</span>
            </div>
            <div class="mood-bar-track">
              <div
                class="mood-bar-fill"
                :style="{ width: `${item.pct}%`, backgroundColor: item.color }"
              />
            </div>
            <span class="mood-bar-count">{{ item.count }}</span>
          </div>
        </div>

        <div
          v-if="hasEnergyData"
          class="energy-section"
        >
          <span class="energy-title">Energia</span>
          <div class="energy-pills">
            <div
              v-for="e in energyItems"
              :key="e.level"
              class="energy-pill"
              :style="{ backgroundColor: e.bg, color: e.color }"
            >
              <span class="energy-icon">{{ e.icon }}</span>
              <span class="energy-label">{{ e.label }}</span>
              <span class="energy-count">{{ e.count }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="hasCorrelation"
          class="correlation-section"
        >
          <span class="correlation-title">Hábitos por humor</span>
          <div class="correlation-list">
            <div
              v-for="c in correlationItems"
              :key="c.mood"
              class="correlation-row"
            >
              <span class="correlation-emoji">{{ c.emoji }}</span>
              <div class="correlation-bar-track">
                <div
                  class="correlation-bar-fill"
                  :style="{ width: `${c.rate}%`, backgroundColor: '#6faf8e' }"
                />
              </div>
              <span class="correlation-pct">{{ c.rate }}%</span>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="chart-empty">
        <span>Sem registros de humor no período</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  distribution: Record<string, number>;
  energyDistribution: Record<string, number>;
  moodHabitCorrelation: Record<string, number>;
}

const props = defineProps<Props>();

const moodConfig: Record<string, { emoji: string; label: string; color: string }> = {
  HAPPY: { emoji: "😊", label: "Feliz", color: "#10b981" },
  CALMLY: { emoji: "😌", label: "Calmo", color: "#6faf8e" },
  OK: { emoji: "😐", label: "Ok", color: "#f59e0b" },
  SAD: { emoji: "😢", label: "Triste", color: "#6366f1" },
  TIRED: { emoji: "😴", label: "Cansado", color: "#8b5cf6" },
  OVERWHELMED: { emoji: "😰", label: "Sobrecarregado", color: "#ef4444" },
};

const energyConfig: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  HIGH: { icon: "⚡", label: "Alta", color: "#059669", bg: "#d1fae5" },
  MEDIUM: { icon: "🔋", label: "Média", color: "#92400e", bg: "#fef3c7" },
  LOW: { icon: "🪫", label: "Baixa", color: "#991b1b", bg: "#fee2e2" },
};

const hasMoodData = computed(() => Object.values(props.distribution).some(v => v > 0));
const hasEnergyData = computed(() => Object.values(props.energyDistribution).some(v => v > 0));
const hasCorrelation = computed(() => Object.keys(props.moodHabitCorrelation).length > 0);

const totalMoods = computed(() => Object.values(props.distribution).reduce((a, b) => a + b, 0));

const moodItems = computed(() => {
  return Object.entries(moodConfig)
    .map(([mood, cfg]) => ({
      mood,
      ...cfg,
      count: props.distribution[mood] || 0,
      pct: totalMoods.value > 0
        ? Math.round(((props.distribution[mood] || 0) / totalMoods.value) * 100)
        : 0,
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);
});

const energyItems = computed(() => {
  return Object.entries(energyConfig)
    .map(([level, cfg]) => ({
      level,
      ...cfg,
      count: props.energyDistribution[level] || 0,
    }))
    .filter(item => item.count > 0);
});

const correlationItems = computed(() => {
  return Object.entries(props.moodHabitCorrelation)
    .map(([mood, rate]) => ({
      mood,
      emoji: moodConfig[mood]?.emoji || "❓",
      rate,
    }))
    .sort((a, b) => b.rate - a.rate);
});
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-empty {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.mood-distribution {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mood-bar-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mood-bar-label {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 120px;
  flex-shrink: 0;
}

.mood-emoji {
  font-size: 16px;
}

.mood-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.mood-bar-track {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
}

.mood-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.mood-bar-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  width: 24px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.energy-section {
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.energy-title,
.correlation-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.energy-pills {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.energy-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.energy-icon {
  font-size: 14px;
}

.energy-count {
  font-weight: 700;
}

.correlation-section {
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.correlation-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.correlation-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.correlation-emoji {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.correlation-bar-track {
  flex: 1;
  height: 6px;
  background: var(--color-background);
  border-radius: 3px;
  overflow: hidden;
}

.correlation-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.correlation-pct {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  width: 32px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .chart-card {
    padding: var(--spacing-md);
  }

  .mood-bar-label {
    width: 90px;
  }
}
</style>
