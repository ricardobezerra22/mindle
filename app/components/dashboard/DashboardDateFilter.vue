<template>
  <div class="date-filter">
    <div class="filter-pills">
      <button
        v-for="opt in periodOptions"
        :key="opt.value"
        :class="['pill', { active: period === opt.value }]"
        @click="setPeriod(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <Transition name="slide">
      <div
        v-if="period === 'custom'"
        class="custom-range"
      >
        <div class="range-field">
          <label>De</label>
          <input
            :value="customRange.start"
            type="date"
            class="date-input"
            @change="handleStartChange"
          />
        </div>
        <span class="range-sep">→</span>
        <div class="range-field">
          <label>Até</label>
          <input
            :value="customRange.end"
            type="date"
            class="date-input"
            @change="handleEndChange"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { PeriodOption } from "~/composables/useDashboardMetrics";

const { period, customRange, setPeriod, setCustomRange } = useDashboardMetrics();

const periodOptions: { value: PeriodOption; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "this-month", label: "Este mês" },
  { value: "last-month", label: "Mês passado" },
  { value: "custom", label: "Personalizado" },
];

const handleStartChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val && customRange.value.end) {
    setCustomRange(val, customRange.value.end);
  } else {
    customRange.value = { ...customRange.value, start: val };
  }
};

const handleEndChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val && customRange.value.start) {
    setCustomRange(customRange.value.start, val);
  } else {
    customRange.value = { ...customRange.value, end: val };
  }
};
</script>

<style scoped>
.date-filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pill {
  padding: 6px 14px;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.pill:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pill.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.custom-range {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.range-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.range-field label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.date-input {
  padding: 6px 10px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.date-input:focus {
  border-color: var(--color-primary);
}

.range-sep {
  font-size: 14px;
  color: var(--color-text-secondary);
  padding-bottom: 8px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 640px) {
  .filter-pills {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .filter-pills::-webkit-scrollbar {
    display: none;
  }

  .custom-range {
    flex-wrap: wrap;
  }

  .range-sep {
    display: none;
  }
}
</style>
