<template>
  <div class="task-column">
    <div class="column-header">
      <div class="column-title">
        <Icon :name="icon" :class="`status-${status.toLowerCase()}`" />
        <h3>{{ title }}</h3>
        <span class="task-count">{{ taskCount }}</span>
      </div>
    </div>
    
    <div class="column-content">
      <slot />
      
      <div v-if="taskCount === 0" class="empty-state">
        <Icon name="lucide:inbox" />
        <p>Nenhuma tarefa</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus } from '~/types'

interface Props {
  title: string
  status: TaskStatus
  taskCount: number
  icon: string
}

defineProps<Props>()
</script>

<style scoped>
.task-column {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.column-header {
  margin-bottom: var(--spacing-md);
}

.column-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.column-title :deep(svg) {
  width: 20px;
  height: 20px;
}

.column-title :deep(svg.status-not_started) {
  color: var(--color-text-secondary);
}

.column-title :deep(svg.status-in_progress) {
  color: #3b82f6;
}

.column-title :deep(svg.status-done) {
  color: #10b981;
}

.column-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
}

.task-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background-color: var(--color-surface);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.column-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state :deep(svg) {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-sm);
  opacity: 0.3;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>
