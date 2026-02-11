<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:target" size="16" />
        <h3 class="chart-title">Evolução do Foco</h3>
      </div>
      <span class="chart-subtitle">Minutos por dia</span>
    </div>
    <div class="chart-body">
      <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="chart-empty">
        <span>Sem dados de foco no período</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  dailyData: Record<string, number>;
}

const props = defineProps<Props>();

const chartData = computed(() => {
  const entries = Object.entries(props.dailyData).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return null;

  return {
    labels: entries.map(([date]) => {
      const d = new Date(date + "T12:00:00");
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    }),
    datasets: [
      {
        label: "Minutos",
        data: entries.map(([, val]) => val),
        borderColor: "#6faf8e",
        backgroundColor: "rgba(111, 175, 142, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#6faf8e",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };
});

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
      callbacks: {
        label: (ctx: any) => `${ctx.parsed.y} min`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: "#6b7c7a" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(227, 236, 233, 0.5)" },
      ticks: { font: { size: 11 }, color: "#6b7c7a" },
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
