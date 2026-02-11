<template>
  <ProjectsExpandableSection
    :expanded="subtopic.expanded"
    :indent="16"
    @toggle="$emit('toggleExpand', subtopic.id, $event)"
  >
    <template #header>
      <div class="subtopic-header">
        <span
          v-if="!isEditing"
          class="subtopic-title"
          @dblclick="startEdit"
        >
          {{ subtopic.title }}
        </span>
        <input
          v-else
          ref="editInput"
          v-model="editTitle"
          class="inline-edit"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          @blur="saveEdit"
          @click.stop
        />

        <span
          v-if="taskCount > 0"
          class="task-counter"
        >
          {{ doneCount }}/{{ taskCount }}
        </span>

        <div class="subtopic-actions">
          <button
            class="action-btn"
            title="Adicionar tarefa"
            @click.stop="showAddTask = true"
          >
            <Icon name="lucide:plus" size="14" />
          </button>
          <button
            class="action-btn danger"
            title="Excluir subtópico"
            @click.stop="$emit('delete', subtopic.id)"
          >
            <Icon name="lucide:trash-2" size="14" />
          </button>
        </div>
      </div>
    </template>

    <div class="subtopic-body">
      <TransitionGroup
        name="task-list"
        tag="div"
        class="tasks-list"
      >
        <ProjectsProjectTaskItem
          v-for="task in subtopic.tasks"
          :key="task.id"
          :task="task"
          @toggle="(id: string, done: boolean) => $emit('toggleTask', id, done)"
          @delete="(id: string) => $emit('deleteTask', id)"
          @update="(id: string, title: string) => $emit('updateTask', id, title)"
        />
      </TransitionGroup>

      <div
        v-if="showAddTask"
        class="add-task-inline"
      >
        <input
          ref="newTaskInput"
          v-model="newTaskTitle"
          class="add-task-input"
          placeholder="Nova tarefa..."
          @keydown.enter="addTask"
          @keydown.escape="cancelAddTask"
          @blur="addTask"
        />
      </div>

      <button
        v-if="!showAddTask"
        class="add-task-btn"
        @click="showAddTask = true"
      >
        <Icon name="lucide:plus" size="14" />
        Tarefa
      </button>
    </div>
  </ProjectsExpandableSection>
</template>

<script setup lang="ts">
import type { Subtopic } from "~/types";

interface Props {
  subtopic: Subtopic;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [id: string];
  update: [id: string, updates: Partial<Subtopic>];
  toggleExpand: [id: string, expanded: boolean];
  addTask: [subtopicId: string, title: string];
  toggleTask: [id: string, done: boolean];
  deleteTask: [id: string];
  updateTask: [id: string, title: string];
}>();

const isEditing = ref(false);
const editTitle = ref("");
const editInput = ref<HTMLInputElement | null>(null);
const showAddTask = ref(false);
const newTaskTitle = ref("");
const newTaskInput = ref<HTMLInputElement | null>(null);

const taskCount = computed(() => props.subtopic.tasks?.length ?? 0);
const doneCount = computed(
  () => props.subtopic.tasks?.filter((t) => t.done).length ?? 0,
);

const startEdit = () => {
  editTitle.value = props.subtopic.title;
  isEditing.value = true;
  nextTick(() => editInput.value?.focus());
};

const saveEdit = () => {
  if (!isEditing.value) return;
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.subtopic.title) {
    emit("update", props.subtopic.id, { title: trimmed });
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const addTask = () => {
  const trimmed = newTaskTitle.value.trim();
  if (trimmed) {
    emit("addTask", props.subtopic.id, trimmed);
  }
  newTaskTitle.value = "";
  showAddTask.value = false;
};

const cancelAddTask = () => {
  newTaskTitle.value = "";
  showAddTask.value = false;
};

watch(showAddTask, (val) => {
  if (val) nextTick(() => newTaskInput.value?.focus());
});
</script>

<style scoped>
.subtopic-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.subtopic-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.inline-edit {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  padding: 2px 6px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  min-width: 0;
}

.task-counter {
  font-size: 11px;
  color: var(--color-text-secondary);
  background: var(--color-background);
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.subtopic-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.subtopic-header:hover .subtopic-actions,
.expandable-header:hover .subtopic-actions {
  opacity: 1;
}

:deep(.expandable-header:hover) .subtopic-actions {
  opacity: 1;
}

.action-btn {
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.action-btn.danger:hover {
  color: #dc2626;
  background: #fee2e2;
}

.subtopic-body {
  padding-top: var(--spacing-xs);
}

.tasks-list {
  display: flex;
  flex-direction: column;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.2s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.add-task-inline {
  padding: 4px 0;
}

.add-task-input {
  width: 100%;
  padding: 6px var(--spacing-sm);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
}

.add-task-input::placeholder {
  color: var(--color-text-secondary);
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--spacing-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  margin-top: 2px;
}

.add-task-btn:hover {
  color: var(--color-primary);
  background: var(--color-background);
}
</style>
