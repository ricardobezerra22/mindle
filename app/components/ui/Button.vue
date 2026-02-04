<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">import { withDefaults } from 'vue';

interface Props {
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: var(--color-background);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(.btn-disabled) {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
