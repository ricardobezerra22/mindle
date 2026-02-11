<template>
  <div class="view-toggle-wrapper">
    <button
      v-if="hasExpandedItems"
      class="reset-view-btn"
      title="Fechar todos os cards"
      @click="emit('resetView')"
    >
      <Icon name="lucide:minimize-2" />
    </button>

    <div class="view-toggle">
      <button
        :class="['toggle-btn', { active: modelValue === 'kanban' }]"
        title="Kanban"
        @click="emit('update:modelValue', 'kanban')"
      >
        <Icon name="lucide:columns-3" />
      </button>
      <button
        :class="['toggle-btn', { active: modelValue === 'categories' }]"
        title="Por Categoria"
        @click="emit('update:modelValue', 'categories')"
      >
        <Icon name="lucide:folder-tree" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: "kanban" | "categories";
  hasExpandedItems: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: "kanban" | "categories"];
  resetView: [];
}>();
</script>

<style scoped>
.view-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.reset-view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.reset-view-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-background);
}

.reset-view-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.view-toggle {
  display: flex;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
}

.toggle-btn:hover:not(.active) {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.toggle-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .view-toggle {
    justify-content: space-between;
  }

  .toggle-btn {
    width: 50%;
  }
}
</style>
