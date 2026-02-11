<template>
  <div
    class="kpi-card"
    :style="accentStyle"
  >
    <div class="kpi-header">
      <div
        class="kpi-icon"
        :style="iconStyle"
      >
        <Icon
          :name="icon"
          size="18"
        />
      </div>
      <span
        v-if="growth !== undefined && growth !== 0"
        :class="['kpi-growth', growth > 0 ? 'positive' : 'negative']"
      >
        <Icon
          :name="growth > 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
          size="12"
        />
        {{ Math.abs(growth) }}%
      </span>
    </div>

    <div class="kpi-body">
      <span class="kpi-value">{{ formattedValue }}</span>
      <span class="kpi-label">{{ label }}</span>
    </div>

    <p
      v-if="subtitle"
      class="kpi-subtitle"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  value: number | string;
  label: string;
  subtitle?: string;
  growth?: number;
  color?: string;
  format?: "number" | "percent" | "minutes" | "currency";
}

const props = withDefaults(defineProps<Props>(), {
  color: "#6faf8e",
  format: "number",
});

const formattedValue = computed(() => {
  const val = typeof props.value === "string" ? props.value : props.value;
  if (typeof val === "string") return val;

  switch (props.format) {
    case "percent":
      return `${val}%`;
    case "minutes": {
      if (val >= 60) {
        const h = Math.floor(val / 60);
        const m = val % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
      }
      return `${val}m`;
    }
    case "currency":
      return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    default:
      return val.toLocaleString("pt-BR");
  }
});

const accentStyle = computed(() => ({
  borderTopColor: `${props.color}40`,
}));

const iconStyle = computed(() => ({
  backgroundColor: `${props.color}15`,
  color: props.color,
}));
</script>

<style scoped>
.kpi-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: all 0.25s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-growth {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.kpi-growth.positive {
  color: #059669;
  background: #d1fae5;
}

.kpi-growth.negative {
  color: #dc2626;
  background: #fee2e2;
}

.kpi-body {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.kpi-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.kpi-subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .kpi-card {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .kpi-value {
    font-size: 22px;
  }

  .kpi-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }
}
</style>
