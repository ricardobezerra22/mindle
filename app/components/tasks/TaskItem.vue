<template>
  <div :class="['task-item', `priority-${priority.toLowerCase()}`]">
    <div class="task-header">
      <div class="task-status">
        <Icon 
          :name="statusIcon" 
          :class="['status-icon', `status-${status.toLowerCase()}`]"
        />
      </div>
      
      <div class="task-content">
        <h4 class="task-title">{{ title }}</h4>
        <p v-if="description" class="task-description">{{ description }}</p>
        
        <div class="task-meta">
          <span v-if="dueDate" class="task-date">
            <Icon name="lucide:calendar" />
            {{ formatDate(dueDate) }}
          </span>
          <span :class="['task-priority', `priority-${priority.toLowerCase()}`]">
            {{ priorityLabel }}
          </span>
        </div>
      </div>
      
      <div class="task-actions">
        <button @click="$emit('edit', id)" class="action-btn" title="Editar">
          <Icon name="lucide:pencil" />
        </button>
        <button @click="$emit('delete', id)" class="action-btn delete" title="Excluir">
          <Icon name="lucide:trash-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus, Priority } from '~/types'

interface Props {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: Date
}

const props = defineProps<Props>()

defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const statusIcon = computed(() => {
  const icons = {
    NOT_STARTED: 'lucide:circle',
    IN_PROGRESS: 'lucide:circle-dot',
    DONE: 'lucide:check-circle'
  }
  return icons[props.status]
})

const priorityLabel = computed(() => {
  const labels = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta'
  }
  return labels[props.priority]
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}
</script>

<style scoped>
.task-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
  cursor: pointer;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.task-item.priority-high {
  border-left: 3px solid #ef4444;
}

.task-item.priority-medium {
  border-left: 3px solid #f59e0b;
}

.task-item.priority-low {
  border-left: 3px solid #10b981;
}

.task-header {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.task-status {
  flex-shrink: 0;
  padding-top: 2px;
}

.status-icon {
  width: 20px;
  height: 20px;
}

.status-icon.status-not_started {
  color: var(--color-text-secondary);
}

.status-icon.status-in_progress {
  color: #3b82f6;
}

.status-icon.status-done {
  color: #10b981;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.task-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.task-date :deep(svg) {
  width: 14px;
  height: 14px;
}

.task-priority {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-priority.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.task-priority.priority-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.task-priority.priority-low {
  background-color: #d1fae5;
  color: #065f46;
}

.task-actions {
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.action-btn.delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
