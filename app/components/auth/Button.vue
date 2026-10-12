<template>
  <button
    :type="type"
    :class="['auth-btn', variant]"
    :disabled="disabled || loading"
  >
    <Icon
      v-if="loading"
      name="lucide:loader-2"
      size="20"
      class="spinning"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "main" | "ghost";
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "main",
  type: "button",
  loading: false,
  disabled: false,
});
</script>

<style scoped>
.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  border-radius: 16px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-btn:focus-visible {
  outline: 3px solid var(--auth-sand);
  outline-offset: 3px;
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main {
  border: 0;
  background: var(--auth-green);
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--auth-green) 28%, transparent);
}

.main:hover:not(:disabled) {
  background: var(--auth-green-dark);
  transform: translateY(-1px);
}

.main:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: none;
}

.ghost {
  border: 2px solid var(--auth-line);
  background: #ffffff;
  color: var(--auth-ink);
  font-size: 16px;
  font-weight: 500;
}

.ghost:hover:not(:disabled) {
  border-color: var(--auth-line-hover);
  background: #f4f9f6;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-btn,
  .spinning {
    transition: none;
    animation: none;
  }
}
</style>
