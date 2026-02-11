<template>
  <div class="progress-wrapper">
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${clampedValue}%`, backgroundColor: fillColor }"
      />
    </div>
    <span
      v-if="showLabel"
      class="progress-label"
    >{{ clampedValue }}%</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  color: undefined,
  showLabel: true,
  size: "md",
});

const clampedValue = computed(() => Math.min(100, Math.max(0, Math.round(props.value))));

const fillColor = computed(() => {
  if (props.color) return props.color;
  if (clampedValue.value >= 80) return "#10b981";
  if (clampedValue.value >= 40) return "#6faf8e";
  return "#f59e0b";
});
</script>

<style scoped>
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: v-bind("props.size === 'sm' ? '4px' : props.size === 'lg' ? '10px' : '6px'");
  background: var(--color-border);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  min-width: 0;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
