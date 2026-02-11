<template>
  <div class="search-box">
    <Icon name="lucide:search" />
    <input
      :value="modelValue"
      type="text"
      placeholder="Buscar tarefa por nome..."
      class="search-input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="modelValue"
      class="clear-btn"
      @click="emit('update:modelValue', '')"
    >
      <Icon name="lucide:x" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: all 0.2s ease;
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
}

.search-box:focus-within {
  border-color: var(--color-primary);
}

.search-box :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--color-text-primary);
  outline: none;
  padding: var(--spacing-xs) 0;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.clear-btn :deep(svg) {
  width: 14px;
  height: 14px;
}

@media (min-width: 640px) {
  .search-box {
    width: auto;
    min-width: 200px;
    padding: var(--spacing-xs) var(--spacing-md);
  }
}
</style>
