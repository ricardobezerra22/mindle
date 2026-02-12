<template>
  <ProjectsExpandableSection
    :expanded="topic.expanded"
    :indent="20"
    @toggle="$emit('toggleExpand', topic.id, $event)"
  >
    <template #header>
      <div class="topic-header">
        <span
          v-if="!isEditing"
          class="topic-title"
          @dblclick="startEdit"
        >
          {{ topic.title }}
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
          v-if="totalTasks > 0"
          class="topic-progress"
        >
          <span class="progress-bar-container">
            <span
              class="progress-bar-fill"
              :style="{ width: `${progressPercent}%` }"
            />
          </span>
          <span class="progress-text">{{ doneTasks }}/{{ totalTasks }}</span>
        </span>

        <div class="topic-actions">
          <button
            class="action-btn"
            title="Adicionar subtópico"
            @click.stop="showAddSubtopic = true"
          >
            <Icon name="lucide:plus" size="14" />
          </button>
          <button
            class="action-btn danger"
            title="Excluir tópico"
            @click.stop="$emit('delete', topic.id)"
          >
            <Icon name="lucide:trash-2" size="14" />
          </button>
        </div>
      </div>
    </template>

    <div class="topic-body">
      <ProjectsSubtopicSection
        v-for="subtopic in topic.subtopics"
        :key="subtopic.id"
        :subtopic="subtopic"
        @delete="(id: string) => $emit('deleteSubtopic', id)"
        @update="(id: string, u: any) => $emit('updateSubtopic', id, u)"
        @toggle-expand="(id: string, v: boolean) => $emit('toggleSubtopicExpand', id, v)"
        @add-task="(sid: string, t: string) => $emit('addTask', sid, t, 'subtopic')"
        @toggle-task="(id: string, d: boolean) => $emit('toggleTask', id, d)"
        @delete-task="(id: string) => $emit('deleteTask', id)"
        @update-task="(id: string, t: string) => $emit('updateTask', id, t)"
      />

      <div
        v-if="showAddSubtopic"
        class="add-inline"
      >
        <input
          ref="newSubtopicInput"
          v-model="newSubtopicTitle"
          class="add-input"
          placeholder="Novo subtópico..."
          @keydown.enter="addSubtopic"
          @keydown.escape="cancelAdd"
          @blur="addSubtopic"
        />
      </div>

      <div
        v-if="topic.tasks && topic.tasks.length > 0"
        class="topic-tasks-list"
      >
        <ProjectsProjectTaskItem
          v-for="task in topic.tasks"
          :key="task.id"
          :task="task"
          @toggle="(id: string, done: boolean) => $emit('toggleTask', id, done)"
          @delete="(id: string) => $emit('deleteTask', id)"
          @update="(id: string, title: string) => $emit('updateTask', id, title)"
        />
      </div>

      <div
        v-if="showAddTopicTask"
        class="add-inline"
      >
        <input
          ref="newTopicTaskInput"
          v-model="newTopicTaskTitle"
          class="add-input"
          placeholder="Nova tarefa..."
          @keydown.enter="addTopicTask"
          @keydown.escape="cancelAddTopicTask"
          @blur="addTopicTask"
        />
      </div>

      <div class="topic-add-actions">
        <button
          v-if="!showAddTopicTask"
          class="add-btn"
          @click="showAddTopicTask = true"
        >
          <Icon name="lucide:plus" size="14" />
          Tarefa
        </button>
        <button
          v-if="!showAddSubtopic"
          class="add-btn"
          @click="showAddSubtopic = true"
        >
          <Icon name="lucide:plus" size="14" />
          Subtópico
        </button>
      </div>
    </div>
  </ProjectsExpandableSection>
</template>

<script setup lang="ts">
import type { Topic, Subtopic } from "~/types";

interface Props {
  topic: Topic;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [id: string];
  update: [id: string, updates: Partial<Topic>];
  toggleExpand: [id: string, expanded: boolean];
  addSubtopic: [topicId: string, title: string];
  deleteSubtopic: [id: string];
  updateSubtopic: [id: string, updates: Partial<Subtopic>];
  toggleSubtopicExpand: [id: string, expanded: boolean];
  addTask: [parentId: string, title: string, level: "topic" | "subtopic"];
  toggleTask: [id: string, done: boolean];
  deleteTask: [id: string];
  updateTask: [id: string, title: string];
}>();

const isEditing = ref(false);
const editTitle = ref("");
const editInput = ref<HTMLInputElement | null>(null);
const showAddSubtopic = ref(false);
const newSubtopicTitle = ref("");
const newSubtopicInput = ref<HTMLInputElement | null>(null);

const showAddTopicTask = ref(false);
const newTopicTaskTitle = ref("");
const newTopicTaskInput = ref<HTMLInputElement | null>(null);

const totalTasks = computed(() => {
  let count = props.topic.tasks?.length ?? 0;
  for (const sub of props.topic.subtopics || []) {
    count += sub.tasks?.length ?? 0;
  }
  return count;
});

const doneTasks = computed(() => {
  let count = props.topic.tasks?.filter((t) => t.done).length ?? 0;
  for (const sub of props.topic.subtopics || []) {
    count += sub.tasks?.filter((t) => t.done).length ?? 0;
  }
  return count;
});

const progressPercent = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((doneTasks.value / totalTasks.value) * 100);
});

const startEdit = () => {
  editTitle.value = props.topic.title;
  isEditing.value = true;
  nextTick(() => editInput.value?.focus());
};

const saveEdit = () => {
  if (!isEditing.value) return;
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.topic.title) {
    emit("update", props.topic.id, { title: trimmed });
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const addSubtopic = () => {
  const trimmed = newSubtopicTitle.value.trim();
  if (trimmed) {
    emit("addSubtopic", props.topic.id, trimmed);
  }
  newSubtopicTitle.value = "";
  showAddSubtopic.value = false;
};

const cancelAdd = () => {
  newSubtopicTitle.value = "";
  showAddSubtopic.value = false;
};

const addTopicTask = () => {
  const trimmed = newTopicTaskTitle.value.trim();
  if (trimmed) {
    emit("addTask", props.topic.id, trimmed, "topic");
  }
  newTopicTaskTitle.value = "";
  showAddTopicTask.value = false;
};

const cancelAddTopicTask = () => {
  newTopicTaskTitle.value = "";
  showAddTopicTask.value = false;
};

watch(showAddSubtopic, (val) => {
  if (val) nextTick(() => newSubtopicInput.value?.focus());
});

watch(showAddTopicTask, (val) => {
  if (val) nextTick(() => newTopicTaskInput.value?.focus());
});
</script>

<style scoped>
.topic-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.topic-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.inline-edit {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  padding: 2px 6px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  min-width: 0;
}

.topic-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.progress-bar-container {
  width: 48px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.topic-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

:deep(.expandable-header:hover) .topic-actions {
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

.topic-body {
  padding-top: var(--spacing-xs);
}

.add-inline {
  padding: 4px 0;
}

.add-input {
  width: 100%;
  padding: 6px var(--spacing-sm);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
}

.add-input::placeholder {
  color: var(--color-text-secondary);
}

.add-btn {
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

.add-btn:hover {
  color: var(--color-primary);
  background: var(--color-background);
}

.topic-tasks-list {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
  border-top: 1px dashed var(--color-border);
}

.topic-add-actions {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
