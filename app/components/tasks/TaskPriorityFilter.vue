<template>
  <label class="priority-filter">
    <input
      :checked="modelValue"
      type="checkbox"
      class="priority-checkbox"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <Icon name="lucide:star" />
    <span>Prioridade</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<style scoped>
.priority-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
}

.priority-filter:hover {
  border-color: var(--color-text-secondary);
}

.priority-filter:has(.priority-checkbox:checked) {
  border-color: #eab308;
  background: #fefce8;
  color: #a16207;
}

.priority-filter :deep(svg) {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.priority-filter:has(.priority-checkbox:checked) :deep(svg) {
  color: #eab308;
}

.priority-checkbox {
  display: none;
}

@media (min-width: 640px) {
  .priority-filter {
    width: auto;
    padding: var(--spacing-xs) var(--spacing-md);
  }
}
</style>
