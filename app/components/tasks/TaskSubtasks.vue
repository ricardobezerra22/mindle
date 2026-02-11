<template>
  <div>
    <div
      v-if="subTasks && subTasks.length > 0"
      class="subtasks-section"
    >
      <button
        class="subtasks-toggle"
        @click.stop="showSubTasks = !showSubTasks"
      >
        <Icon
          :name="showSubTasks ? 'lucide:chevron-down' : 'lucide:chevron-right'"
        />
        <span>{{ completedCount }}/{{ subTasks.length }} subtarefas</span>
      </button>
      <div
        v-if="showSubTasks"
        class="subtasks-list"
      >
        <div
          v-for="st in subTasks"
          :key="st.id"
          class="subtask-item"
          @click.stop="emit('toggleSubTask', st.id, !st.done)"
        >
          <div :class="['subtask-check', { done: st.done }]">
            <Icon
              v-if="st.done"
              name="lucide:check"
            />
          </div>
          <span :class="['subtask-title', { done: st.done }]">
            {{ st.title }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="showSubTasks || (!subTasks?.length && !editMode)"
      class="add-subtask-row"
    >
      <div
        v-if="addingSubTask"
        class="add-subtask-input-row"
        @click.stop
      >
        <input
          v-model="newTitle"
          type="text"
          class="edit-input subtask-input"
          placeholder="Nome da subtarefa"
          @keyup.enter="handleAdd"
          @keyup.escape="addingSubTask = false"
        />
        <button
          class="action-btn save"
          title="Adicionar"
          @click.stop="handleAdd"
        >
          <Icon name="lucide:plus" />
        </button>
        <button
          class="action-btn cancel"
          title="Cancelar"
          @click.stop="addingSubTask = false"
        >
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
</template>

<script setup lang="ts">
import type { SubTask } from "~/types";

interface Props {
  subTasks?: SubTask[];
  taskId: string;
  editMode: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addSubTask: [taskId: string, title: string];
  toggleSubTask: [subTaskId: string, done: boolean];
}>();

const showSubTasks = ref(false);
const addingSubTask = ref(false);
const newTitle = ref("");

const completedCount = computed(() => {
  return props.subTasks?.filter((st) => st.done).length || 0;
});

const handleAdd = () => {
  const title = newTitle.value.trim();
  if (!title) return;
  emit("addSubTask", props.taskId, title);
  newTitle.value = "";
};
</script>

<style scoped>
.subtasks-section {
  margin-top: var(--spacing-xs);
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
}

.edit-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.subtask-input {
  flex: 1;
  font-size: 12px;
  padding: 4px 8px;
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

.action-btn {
  width: 26px;
  height: 26px;
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

.action-btn :deep(svg) {
  width: 15px;
  height: 15px;
}
</style>
