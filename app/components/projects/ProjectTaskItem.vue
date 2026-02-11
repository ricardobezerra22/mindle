<template>
  <div
    class="project-task-item"
    :class="{ done: task.done }"
  >
    <button
      class="task-check"
      :class="{ checked: task.done }"
      @click="$emit('toggle', task.id, !task.done)"
    >
      <Transition name="check-fade">
        <Icon
          v-if="task.done"
          name="lucide:check"
          size="12"
        />
      </Transition>
    </button>

    <span
      v-if="!isEditing"
      class="task-title"
      @dblclick="startEdit"
    >
      {{ task.title }}
    </span>

    <input
      v-else
      ref="editInput"
      v-model="editTitle"
      class="task-edit-input"
      @keydown.enter="saveEdit"
      @keydown.escape="cancelEdit"
      @blur="saveEdit"
    />

    <button
      class="task-delete"
      @click="$emit('delete', task.id)"
    >
      <Icon
        name="lucide:x"
        size="12"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProjectTask } from "~/types";

interface Props {
  task: ProjectTask;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggle: [id: string, done: boolean];
  delete: [id: string];
  update: [id: string, title: string];
}>();

const isEditing = ref(false);
const editTitle = ref("");
const editInput = ref<HTMLInputElement | null>(null);

const startEdit = () => {
  editTitle.value = props.task.title;
  isEditing.value = true;
  nextTick(() => editInput.value?.focus());
};

const saveEdit = () => {
  if (!isEditing.value) return;
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.task.title) {
    emit("update", props.task.id, trimmed);
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};
</script>

<style scoped>
.project-task-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 6px var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

.project-task-item:hover {
  background: var(--color-background);
}

.project-task-item:hover .task-delete {
  opacity: 1;
}

.task-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
}

.task-check:hover {
  border-color: var(--color-primary);
}

.task-check.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.check-fade-enter-active,
.check-fade-leave-active {
  transition: all 0.2s ease;
}

.check-fade-enter-from,
.check-fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.task-title {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-primary);
  line-height: 1.4;
  cursor: default;
  transition: all 0.2s ease;
}

.done .task-title {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.task-edit-input {
  flex: 1;
  font-size: 13px;
  padding: 2px 6px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
}

.task-delete {
  opacity: 0;
  padding: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.task-delete:hover {
  color: #dc2626;
  background: #fee2e2;
}
</style>
