<template>
  <div
    :class="['task-item', `priority-${priority.toLowerCase()}`]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="task-wrapper">
      <div
        v-if="status !== 'DONE'"
        class="task-checkbox"
        @click.stop="handleComplete"
        :class="{ completing: isCompleting }"
      >
        <div class="checkbox-inner">
          <Icon v-if="isCompleting" name="lucide:check" class="check-icon" />
        </div>
      </div>

      <div class="task-content">
        <input
          v-if="editMode"
          v-model="editData.title"
          type="text"
          class="edit-input title-input"
          placeholder="Título da tarefa"
          @click.stop
        />
        <h4 v-else class="task-title">{{ title }}</h4>

        <textarea
          v-if="editMode"
          v-model="editData.description"
          class="edit-input description-input"
          placeholder="Descrição da tarefa"
          rows="2"
          @click.stop
        />
        <p v-else-if="description" class="task-description">
          {{ description }}
        </p>

        <div class="task-meta">
          <div v-if="editMode" class="edit-date-wrapper">
            <Icon name="lucide:calendar" />
            <input
              v-model="editData.dueDate"
              type="date"
              class="edit-input date-input"
              @click.stop
            />
          </div>
          <span v-else-if="dueDate" class="task-date">
            <Icon name="lucide:calendar" />
            {{ formatDate(dueDate) }}
          </span>
          <span
            :class="['task-priority', `priority-${priority.toLowerCase()}`]"
          >
            {{ priorityLabel }}
          </span>
          <span
            v-if="categoryName"
            class="category-badge"
            :style="categoryBadgeStyle"
          >
            {{ categoryName }}
          </span>
        </div>

        <div v-if="subTasks && subTasks.length > 0" class="subtasks-section">
          <button
            class="subtasks-toggle"
            @click.stop="showSubTasks = !showSubTasks"
          >
            <Icon :name="showSubTasks ? 'lucide:chevron-down' : 'lucide:chevron-right'" />
            <span>{{ completedSubTasks }}/{{ subTasks.length }} subtarefas</span>
          </button>
          <div v-if="showSubTasks" class="subtasks-list">
            <div
              v-for="st in subTasks"
              :key="st.id"
              class="subtask-item"
              @click.stop="$emit('toggleSubTask', st.id, !st.done)"
            >
              <div :class="['subtask-check', { done: st.done }]">
                <Icon v-if="st.done" name="lucide:check" />
              </div>
              <span :class="['subtask-title', { done: st.done }]">{{ st.title }}</span>
            </div>
          </div>
        </div>

        <div v-if="showSubTasks || (!subTasks?.length && !editMode)" class="add-subtask-row">
          <div v-if="addingSubTask" class="add-subtask-input-row" @click.stop>
            <input
              v-model="newSubTaskTitle"
              type="text"
              class="edit-input subtask-input"
              placeholder="Nome da subtarefa"
              @keyup.enter="handleAddSubTask"
              @keyup.escape="addingSubTask = false"
            />
            <button class="action-btn save" @click.stop="handleAddSubTask" title="Adicionar">
              <Icon name="lucide:plus" />
            </button>
            <button class="action-btn cancel" @click.stop="addingSubTask = false" title="Cancelar">
              <Icon name="lucide:x" />
            </button>
          </div>
          <button
            v-else
            class="add-subtask-btn"
            @click.stop="addingSubTask = true"
          >
            <Icon name="lucide:plus" />
            <span>Subtarefa</span>
          </button>
        </div>
      </div>

      <div class="task-actions">
        <button
          v-if="!editMode"
          @click.stop="toggleEditMode"
          class="action-btn"
          title="Editar"
        >
          <Icon name="lucide:pencil" />
        </button>
        <button
          v-if="editMode"
          @click.stop="saveEdit"
          class="action-btn save"
          title="Salvar"
        >
          <Icon name="lucide:check" />
        </button>
        <button
          v-if="editMode"
          @click.stop="cancelEdit"
          class="action-btn cancel"
          title="Cancelar"
        >
          <Icon name="lucide:x" />
        </button>
        <button
          v-if="!editMode"
          @click.stop="$emit('delete', id)"
          class="action-btn delete"
          title="Excluir"
        >
          <Icon name="lucide:trash-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus, Priority, SubTask } from "~/types";

interface Props {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  categoryName?: string;
  categoryColor?: string;
  subTasks?: SubTask[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [
    id: string,
    data: { title: string; description?: string; dueDate?: Date },
  ];
  delete: [id: string];
  complete: [id: string];
  dragStart: [id: string];
  dragEnd: [];
  addSubTask: [taskId: string, title: string];
  toggleSubTask: [subTaskId: string, done: boolean];
}>();

const { playDone } = useSound();
const toast = useToast();

const editMode = ref(false);
const isCompleting = ref(false);
const showSubTasks = ref(false);
const addingSubTask = ref(false);
const newSubTaskTitle = ref("");

const completedSubTasks = computed(() => {
  return props.subTasks?.filter(st => st.done).length || 0;
});

const categoryBadgeStyle = computed(() => {
  if (!props.categoryColor) return {};
  const color = props.categoryColor;
  return {
    backgroundColor: color.startsWith("rgba") ? color : `${color}20`,
    color: color.startsWith("rgba") ? undefined : color,
    borderColor: color.startsWith("rgba") ? "transparent" : `${color}40`,
  };
});

const editData = ref({
  title: "",
  description: "",
  dueDate: "",
});

const handleAddSubTask = () => {
  const title = newSubTaskTitle.value.trim();
  if (!title) return;
  emit("addSubTask", props.id, title);
  newSubTaskTitle.value = "";
};

const handleComplete = async () => {
  if (props.status === "DONE" || isCompleting.value) return;

  isCompleting.value = true;

  playDone();
  toast.success({
    title: "Tarefa concluída",
    message: "Parabéns!",
  });

  setTimeout(() => {
    emit("complete", props.id);
    isCompleting.value = false;
  }, 600);
};

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
  editData.value = {
    title: "",
    description: "",
    dueDate: "",
  };
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

const priorityLabel = computed(() => {
  const labels = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };
  return labels[props.priority];
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.task-item {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
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
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: var(--spacing-sm);
  background-color: var(--color-surface);
}

.task-checkbox:hover {
  border-color: #10b981;
  transform: scale(1.1);
}

.task-checkbox.completing {
  background-color: #10b981;
  border-color: #10b981;
  animation: checkboxPulse 0.6s ease;
}

@keyframes checkboxPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.checkbox-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.check-icon {
  color: white;
  width: 14px;
  height: 14px;
  animation: checkAppear 0.3s ease;
}

@keyframes checkAppear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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

.status-text {
  font-size: 10px;
}

.task-content {
  flex: 1;
  min-width: 0;
  padding-right: 80px;
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
  white-space: pre-wrap;
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

.category-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.subtasks-section {
  margin-top: var(--spacing-sm);
}

.subtasks-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 2px 0;
  transition: color 0.2s ease;
}

.subtasks-toggle:hover {
  color: var(--color-text-primary);
}

.subtasks-toggle :deep(svg) {
  width: 14px;
  height: 14px;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--spacing-xs);
  padding-left: 4px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 3px 4px;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

.subtask-item:hover {
  background-color: var(--color-background);
}

.subtask-check {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.subtask-check.done {
  background-color: #10b981;
  border-color: #10b981;
}

.subtask-check :deep(svg) {
  width: 10px;
  height: 10px;
  color: white;
}

.subtask-title {
  font-size: 12px;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.subtask-title.done {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.add-subtask-row {
  margin-top: var(--spacing-xs);
}

.add-subtask-input-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.subtask-input {
  flex: 1;
  font-size: 12px;
  padding: 4px 8px;
  margin-bottom: 0;
}

.add-subtask-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 11px;
  color: var(--color-text-secondary);
  padding: 4px 8px;
  transition: all 0.2s ease;
}

.add-subtask-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-background);
}

.add-subtask-btn :deep(svg) {
  width: 12px;
  height: 12px;
}

.task-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.2s ease;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.task-item:hover .task-actions {
  opacity: 1;
}

@media (max-width: 768px) {
  .task-actions {
    opacity: 1;
  }

  .task-content {
    padding-right: 60px;
  }
}

.action-btn.save {
  color: #10b981;
}

.action-btn.save:hover {
  background-color: #d1fae5;
  color: #065f46;
}

.action-btn.cancel {
  color: #f59e0b;
}

.action-btn.cancel:hover {
  background-color: #fef3c7;
  color: #92400e;
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
