<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button
          v-if="isMobile"
          class="menu-toggle"
          aria-label="Abrir menu"
          @click="openSidebar"
        >
          <Icon name="lucide:menu" size="22" />
        </button>
        <div class="header-title">
          <slot name="title">
            <h1>{{ title }}</h1>
          </slot>
        </div>
      </div>

      <div class="header-actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
});

const { isMobile, open: openSidebar } = useSidebar();
</script>

<style scoped>
.header {
  height: 59px;
  background-color: var(--color-surface);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  z-index: 100;
  width: 100%;
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
  width: 36px;
  height: 36px;
}

.menu-toggle:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.menu-toggle:active {
  background-color: var(--color-border);
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
