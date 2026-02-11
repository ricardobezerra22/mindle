<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:wallet" size="16" />
        <h3 class="chart-title">Finanças por Status</h3>
      </div>
      <span class="chart-subtitle">Distribuição de valores</span>
    </div>
    <div class="chart-body">
      <Doughnut
        v-if="hasData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="chart-empty">
        <span>Sem registros financeiros</span>
      </div>
    </div>
    <div
      v-if="hasData"
      class="chart-legend"
    >
      <div class="legend-item">
        <span class="legend-dot paid" />
        <span class="legend-label">Pago</span>
        <span class="legend-value">{{ formatCurrency(totalPaid) }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot pending" />
        <span class="legend-label">Pendente</span>
        <span class="legend-value">{{ formatCurrency(totalPending) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  totalPaid: number;
  totalPending: number;
}

const props = defineProps<Props>();

const hasData = computed(() => props.totalPaid + props.totalPending > 0);

const formatCurrency = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const chartData = computed(() => ({
  labels: ["Pago", "Pendente"],
  datasets: [
    {
      data: [props.totalPaid, props.totalPending],
      backgroundColor: ["#10b981", "#f59e0b"],
      borderColor: ["#fff", "#fff"],
      borderWidth: 3,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",
  plugins: {
    tooltip: {
      backgroundColor: "#1f2d2b",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => {
          const val = ctx.parsed;
          return ` ${val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
        },
      },
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
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.paid {
  background: #10b981;
}

.legend-dot.pending {
  background: #f59e0b;
}

.legend-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.legend-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
}

@media (max-width: 640px) {
  .chart-card {
    padding: var(--spacing-md);
  }

  .chart-body {
    height: 150px;
  }

  .chart-legend {
    gap: var(--spacing-md);
  }
}
</style>
