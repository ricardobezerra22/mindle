<template>
  <div class="energy-level">
    <label class="energy-label">Nível de energia</label>
    <div class="energy-bar">
      <button
        v-for="level in levels"
        :key="level.value"
        :class="['energy-segment', level.class, { active: isActive(level.value) }]"
        @click="emit('update:modelValue', level.value)"
      >
        <span class="segment-label">{{ level.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EnergyLevel } from "~/types";

interface Props {
  modelValue: EnergyLevel | null | undefined;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: EnergyLevel];
}>();

const levels = [
  { value: EnergyLevel.LOW, label: "Baixa", class: "low" },
  { value: EnergyLevel.MEDIUM, label: "Média", class: "medium" },
  { value: EnergyLevel.HIGH, label: "Alta", class: "high" },
];

const energyRank: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

const isActive = (value: EnergyLevel) => {
  if (!props.modelValue) return false;
  return energyRank[value] <= energyRank[props.modelValue];
};
</script>

<style scoped>
.energy-level {
  margin-top: var(--spacing-md);
}

.energy-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.energy-bar {
  display: flex;
  gap: 4px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.energy-segment {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-xs);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.energy-segment:first-child {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.energy-segment:last-child {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.segment-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.energy-segment:hover {
  border-color: var(--color-text-secondary);
}

.energy-segment.low.active {
  background: #fee2e2;
  border-color: #fca5a5;
}

.energy-segment.low.active .segment-label {
  color: #991b1b;
}

.energy-segment.medium.active {
  background: #fef3c7;
  border-color: #fcd34d;
}

.energy-segment.medium.active .segment-label {
  color: #92400e;
}

.energy-segment.high.active {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.energy-segment.high.active .segment-label {
  color: #065f46;
}
</style>
