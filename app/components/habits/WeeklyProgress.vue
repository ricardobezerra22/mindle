<template>
  <div class="weekly-progress">
    <div class="progress-bar">
      <div
        v-for="i in goal"
        :key="i"
        :class="['progress-dot', { filled: i <= completed }]"
      />
    </div>
    <span class="progress-text">{{ completed }} / {{ goal }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  completed: number;
  goal: number;
}

defineProps<Props>();
</script>

<style scoped>
.weekly-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-bar {
  display: flex;
  gap: 3px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.2s ease;
}

.progress-dot.filled {
  background: var(--color-primary);
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
</style>
