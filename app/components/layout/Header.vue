<template>
  <header class="header">
    <div class="header-content">
      <div class="header-title">
        <button class="menu-toggle" @click="drawer.toggle()">
          <Icon name="lucide:arrow-right-from-line" />
        </button>
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </div>

      <div class="header-actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDrawerStore } from "../../stores/useDrawerStore";

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
});

const drawer = useDrawerStore();
</script>

<style scoped>
.header {
  height: 64px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 20px;
}

.header-content {
  height: 100%;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}
.header-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
