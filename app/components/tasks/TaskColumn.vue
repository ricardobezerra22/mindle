<template>
  <div
    class="task-column"
    :class="[`column-${status.toLowerCase()}`, { 'drag-over': isDragOver }]"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="column-header">
      <div
        class="column-title"
        :class="['task-status-badge', `status-${status.toLowerCase()}`]"
      >
        <Icon
          :name="icon"
          :class="`status-${status.toLowerCase()}`"
        />
        <h3>{{ title }}</h3>
        <span class="task-count">{{ taskCount }}</span>
      </div>
    </div>

    <div class="column-content">
      <slot />

      <div
        v-if="taskCount === 0"
        class="empty-state"
      >
        <Icon name="lucide:inbox" />
        <p>Nenhuma tarefa</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus } from "~/types";

interface Props {
  title: string;
  status: TaskStatus;
  taskCount: number;
  icon: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  drop: [taskId: string, newStatus: TaskStatus];
}>();

const isDragOver = ref(false);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
};

const handleDragLeave = (e: DragEvent) => {
  const target = e.currentTarget as HTMLElement;
  const relatedTarget = e.relatedTarget as HTMLElement;

  if (!target.contains(relatedTarget)) {
    isDragOver.value = false;
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;

  if (e.dataTransfer) {
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      emit("drop", taskId, props.status);
    }
  }
};
</script>

<style scoped>
.task-column {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  border: 2px solid var(--color-border);
}

.task-column.drag-over {
  border-color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05);
}

.column-header {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
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
.task-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-status-badge :deep(svg) {
  width: 14px;
  height: 14px;
}

.task-status-badge.status-not_started {
  background-color: var(--status-not-started-bg, #dbeafe);
  color: var(--status-not-started-color, #1e40af);
}

.task-status-badge.status-in_progress {
  background-color: var(--status-in-progress-bg, #fef3c7);
  color: var(--status-in-progress-color, #92400e);
}

.task-status-badge.status-done {
  background-color: var(--status-done-bg, #d1fae5);
  color: var(--status-done-color, #065f46);
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
