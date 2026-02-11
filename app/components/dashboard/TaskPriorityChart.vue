<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:list-checks" size="16" />
        <h3 class="chart-title">Tarefas por Prioridade</h3>
      </div>
      <span class="chart-subtitle">Criadas vs concluídas</span>
    </div>
    <div class="chart-body">
      <Bar
        v-if="hasData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="chart-empty">
        <span>Sem tarefas no período</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface PriorityData {
  HIGH: { total: number; done: number };
  MEDIUM: { total: number; done: number };
  LOW: { total: number; done: number };
}

interface Props {
  byPriority: PriorityData;
}

const props = defineProps<Props>();

const hasData = computed(() => {
  const p = props.byPriority;
  return p.HIGH.total + p.MEDIUM.total + p.LOW.total > 0;
});

const chartData = computed(() => ({
  labels: ["Alta", "Média", "Baixa"],
  datasets: [
    {
      label: "Total",
      data: [props.byPriority.HIGH.total, props.byPriority.MEDIUM.total, props.byPriority.LOW.total],
      backgroundColor: ["#fca5a5", "#fcd34d", "#86efac"],
      borderRadius: 6,
      barPercentage: 0.6,
    },
    {
      label: "Concluídas",
      data: [props.byPriority.HIGH.done, props.byPriority.MEDIUM.done, props.byPriority.LOW.done],
      backgroundColor: ["#dc2626", "#f59e0b", "#10b981"],
      borderRadius: 6,
      barPercentage: 0.6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "#1f2d2b",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 }, color: "#6b7c7a" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(227, 236, 233, 0.5)" },
      ticks: { font: { size: 11 }, color: "#6b7c7a", stepSize: 1 },
    },
  },
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
  height: 200px;
  position: relative;
  min-width: 0;
}

.chart-empty {
  height: 100%;
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

  .chart-body {
    height: 160px;
  }
}
</style>
