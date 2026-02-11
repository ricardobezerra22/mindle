<template>
  <div
    :class="['task-item', `priority-${priority.toLowerCase()}`]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="task-wrapper">
      <TasksTaskStatusToggle
        :status="status"
        @update-status="(s) => emit('updateStatus', id, s)"
      />

      <div class="task-content">
        <input
          v-if="editMode"
          v-model="editData.title"
          type="text"
          class="edit-input title-input"
          placeholder="Título da tarefa"
          @click.stop
        />
        <h4
          v-else
          class="task-title"
        >
          {{ title }}
        </h4>

        <textarea
          v-if="editMode"
          v-model="editData.description"
          class="edit-input description-input"
          placeholder="Descrição da tarefa"
          rows="2"
          @click.stop
        />
        <p
          v-else-if="description"
          class="task-description"
        >
          {{ description }}
        </p>

        <div class="task-meta">
          <div
            v-if="editMode"
            class="edit-date-wrapper"
          >
            <Icon name="lucide:calendar" />
            <input
              v-model="editData.dueDate"
              type="date"
              class="edit-input date-input"
              @click.stop
            />
          </div>
          <span
            v-else-if="dueDate"
            class="task-date"
          >
            <Icon name="lucide:calendar" />
            {{ formatDate(dueDate) }}
          </span>

          <TasksTaskPrioritySelect
            :priority="priority"
            @update-priority="(p) => emit('updatePriority', id, p)"
          />

          <TasksTaskCategorySelect
            :category-name="categoryName"
            :category-color="categoryColor"
            :category-id="categoryId"
            :categories="availableCategories"
            @update-category="(cId) => emit('updateCategory', id, cId)"
          />
        </div>

        <TasksTaskSubtasks
          :sub-tasks="subTasks"
          :task-id="id"
          :edit-mode="editMode"
          @add-sub-task="(taskId, title) => emit('addSubTask', taskId, title)"
          @toggle-sub-task="(stId, done) => emit('toggleSubTask', stId, done)"
        />
      </div>

      <TasksTaskActions
        :edit-mode="editMode"
        :is-favorite="isFavorite"
        @edit="toggleEditMode"
        @save="saveEdit"
        @cancel="cancelEdit"
        @delete="emit('delete', id)"
        @toggle-favorite="emit('toggleFavorite', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus, Priority, SubTask, TaskCategory } from "~/types";
import { formatDate, formatDateForInput } from "~/utils/formatters";

interface Props {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  isFavorite: boolean;
  dueDate?: Date;
  categoryName?: string;
  categoryColor?: string;
  categoryId?: string;
  subTasks?: SubTask[];
  availableCategories?: TaskCategory[];
}

const props = withDefaults(defineProps<Props>(), {
  availableCategories: () => [],
});

const emit = defineEmits<{
  edit: [
    id: string,
    data: { title: string; description?: string; dueDate?: Date },
  ];
  delete: [id: string];
  complete: [id: string];
  toggleFavorite: [id: string];
  updatePriority: [id: string, priority: Priority];
  updateCategory: [id: string, categoryId: string | null];
  updateStatus: [id: string, status: TaskStatus];
  dragStart: [id: string];
  dragEnd: [];
  addSubTask: [taskId: string, title: string];
  toggleSubTask: [subTaskId: string, done: boolean];
}>();

const editMode = ref(false);

const editData = ref({
  title: "",
  description: "",
  dueDate: "",
});

const toggleEditMode = () => {
  editMode.value = true;
  editData.value = {
    title: props.title,
    description: props.description || "",
    dueDate: props.dueDate ? formatDateForInput(props.dueDate) : "",
  };
};

const saveEdit = () => {
  if (!editData.value.title.trim()) return;
  emit("edit", props.id, {
    title: editData.value.title,
    description: editData.value.description || undefined,
    dueDate: editData.value.dueDate
      ? new Date(editData.value.dueDate)
      : undefined,
  });
  editMode.value = false;
};

const cancelEdit = () => {
  editMode.value = false;
};

const handleDragStart = (e: DragEvent) => {
  if (editMode.value) {
    e.preventDefault();
    return;
  }
  emit("dragStart", props.id);
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", props.id);
  }
};

const handleDragEnd = () => {
  emit("dragEnd");
};
</script>

<style scoped>
.task-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  transition: all 0.2s ease;
  cursor: grab;
  position: relative;
}

.task-item:active {
  cursor: grabbing;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.task-wrapper {
  display: flex;
  gap: var(--spacing-xs);
  align-items: flex-start;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
  word-break: break-word;
}

.task-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.edit-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-primary);
  background-color: var(--color-background);
  transition: border-color 0.2s ease;
  margin-bottom: var(--spacing-xs);
}

.edit-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.title-input {
  font-size: 14px;
  font-weight: 500;
}

.description-input {
  resize: vertical;
  min-height: 50px;
}

.edit-date-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-date-wrapper :deep(svg) {
  width: 14px;
  height: 14px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.date-input {
  margin-bottom: 0;
  padding: 2px var(--spacing-xs);
  font-size: 12px;
  max-width: 140px;
}

.task-meta {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.task-date :deep(svg) {
  width: 12px;
  height: 12px;
}

@media (min-width: 768px) {
  .task-item {
    padding: var(--spacing-md);
  }

  .task-wrapper {
    gap: var(--spacing-sm);
  }

  .task-title {
    font-size: 14px;
    margin: 0 0 var(--spacing-xs) 0;
  }

  .task-description {
    font-size: 13px;
    margin: 0 0 var(--spacing-sm) 0;
  }

  .task-meta {
    gap: var(--spacing-sm);
  }

  .task-date {
    font-size: 12px;
  }

  .task-date :deep(svg) {
    width: 14px;
    height: 14px;
  }
}
</style>
