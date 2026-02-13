<template>
  <div
    class="project-card"
    :style="cardBorderStyle"
  >
    <ProjectsExpandableSection
      :expanded="isExpanded"
      :indent="0"
      @toggle="isExpanded = $event"
    >
      <template #header>
        <div class="project-header">
          <div class="project-info">
            <span
              v-if="project.category"
              class="category-badge"
              :style="categoryBadgeStyle"
            >
              {{ project.category.name }}
            </span>
            <span
              v-if="!isEditingTitle"
              class="project-title"
              @dblclick="startEditTitle"
            >
              {{ project.title }}
            </span>
            <input
              v-else
              ref="titleInput"
              v-model="editTitle"
              class="title-edit"
              @keydown.enter="saveTitle"
              @keydown.escape="cancelEditTitle"
              @blur="saveTitle"
              @click.stop
            />
          </div>

          <div class="project-meta">
            <span
              v-if="totalTasks > 0"
              class="project-progress"
            >
              <span class="progress-bar-outer">
                <span
                  class="progress-bar-inner"
                  :style="{ width: `${progressPercent}%` }"
                />
              </span>
              <span class="progress-label">{{ progressPercent }}%</span>
            </span>

            <div class="project-actions">
              <button
                class="action-btn"
                title="Adicionar tópico"
                @click.stop="showAddTopic = true"
              >
                <Icon name="lucide:plus" size="16" />
              </button>
              <button
                class="action-btn"
                title="Editar projeto"
                @click.stop="$emit('edit', project.id)"
              >
                <Icon name="lucide:pencil" size="14" />
              </button>
              <button
                class="action-btn"
                title="Arquivar projeto"
                @click.stop="$emit('archive', project.id)"
              >
                <Icon name="lucide:archive" size="14" />
              </button>
              <button
                class="action-btn danger"
                title="Excluir projeto"
                @click.stop="$emit('delete', project.id)"
              >
                <Icon name="lucide:trash-2" size="14" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <div class="project-body">
        <p
          v-if="project.description"
          class="project-description"
        >
          {{ project.description }}
        </p>

        <div
          v-if="project.dueDate"
          :class="['project-deadline', { overdue: isOverdue }]"
        >
          <Icon name="lucide:calendar-clock" size="14" />
          <span>{{ formatDeadline(project.dueDate) }}</span>
          <span
            v-if="daysRemaining !== null"
            class="deadline-badge"
          >{{ deadlineLabel }}</span>
        </div>

        <div class="topics-list">
          <ProjectsTopicSection
            v-for="topic in project.topics"
            :key="topic.id"
            :topic="topic"
            @delete="(id: string) => $emit('deleteTopic', id)"
            @update="(id: string, u: any) => $emit('updateTopic', id, u)"
            @toggle-expand="handleTopicExpand"
            @add-subtopic="(tid: string, t: string) => $emit('addSubtopic', tid, t)"
            @delete-subtopic="(id: string) => $emit('deleteSubtopic', id)"
            @update-subtopic="(id: string, u: any) => $emit('updateSubtopic', id, u)"
            @toggle-subtopic-expand="handleSubtopicExpand"
            @add-task="(parentId: string, t: string, level: 'topic' | 'subtopic') => $emit('addTask', parentId, t, level)"
            @toggle-task="(id: string, d: boolean) => $emit('toggleTask', id, d)"
            @delete-task="(id: string) => $emit('deleteTask', id)"
            @update-task="(id: string, t: string) => $emit('updateTask', id, t)"
          />
        </div>

        <div
          v-if="showAddTopic"
          class="add-inline"
        >
          <input
            ref="newTopicInput"
            v-model="newTopicTitle"
            class="add-input"
            placeholder="Novo tópico..."
            @keydown.enter="addTopic"
            @keydown.escape="cancelAddTopic"
            @blur="addTopic"
          />
        </div>

        <div
          v-if="project.tasks && project.tasks.length > 0"
          class="project-tasks-list"
        >
          <ProjectsProjectTaskItem
            v-for="task in project.tasks"
            :key="task.id"
            :task="task"
            @toggle="(id: string, done: boolean) => $emit('toggleTask', id, done)"
            @delete="(id: string) => $emit('deleteTask', id)"
            @update="(id: string, title: string) => $emit('updateTask', id, title)"
          />
        </div>

        <div
          v-if="showAddProjectTask"
          class="add-inline"
        >
          <input
            ref="newProjectTaskInput"
            v-model="newProjectTaskTitle"
            class="add-input"
            placeholder="Nova tarefa..."
            @keydown.enter="addProjectTask"
            @keydown.escape="cancelAddProjectTask"
            @blur="addProjectTask"
          />
        </div>

        <div class="project-add-actions">
          <button
            v-if="!showAddProjectTask"
            class="add-topic-btn"
            @click="showAddProjectTask = true"
          >
            <Icon name="lucide:plus" size="14" />
            Tarefa
          </button>
          <button
            v-if="!showAddTopic"
            class="add-topic-btn"
            @click="showAddTopic = true"
          >
            <Icon name="lucide:plus" size="14" />
            Tópico
          </button>
        </div>
      </div>
    </ProjectsExpandableSection>
  </div>
</template>

<script setup lang="ts">
import type { Project, Topic, Subtopic } from "~/types";

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
  archive: [id: string];
  update: [id: string, updates: Partial<Project>];
  addTopic: [projectId: string, title: string];
  deleteTopic: [id: string];
  updateTopic: [id: string, updates: Partial<Topic>];
  addSubtopic: [topicId: string, title: string];
  deleteSubtopic: [id: string];
  updateSubtopic: [id: string, updates: Partial<Subtopic>];
  addTask: [parentId: string, title: string, level: "project" | "topic" | "subtopic"];
  toggleTask: [id: string, done: boolean];
  deleteTask: [id: string];
  updateTask: [id: string, title: string];
}>();

const isExpanded = ref(true);
const isEditingTitle = ref(false);
const editTitle = ref("");
const titleInput = ref<HTMLInputElement | null>(null);
const showAddTopic = ref(false);
const newTopicTitle = ref("");
const newTopicInput = ref<HTMLInputElement | null>(null);
const showAddProjectTask = ref(false);
const newProjectTaskTitle = ref("");
const newProjectTaskInput = ref<HTMLInputElement | null>(null);

const totalTasks = computed(() => {
  let count = props.project.tasks?.length ?? 0;
  for (const topic of props.project.topics || []) {
    count += topic.tasks?.length ?? 0;
    for (const sub of topic.subtopics || []) {
      count += sub.tasks?.length ?? 0;
    }
  }
  return count;
});

const doneTasks = computed(() => {
  let count = props.project.tasks?.filter((t) => t.done).length ?? 0;
  for (const topic of props.project.topics || []) {
    count += topic.tasks?.filter((t) => t.done).length ?? 0;
    for (const sub of topic.subtopics || []) {
      count += sub.tasks?.filter((t) => t.done).length ?? 0;
    }
  }
  return count;
});

const progressPercent = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((doneTasks.value / totalTasks.value) * 100);
});

const daysRemaining = computed(() => {
  if (!props.project.dueDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(props.project.dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
});

const isOverdue = computed(() => daysRemaining.value !== null && daysRemaining.value < 0);

const deadlineLabel = computed(() => {
  if (daysRemaining.value === null) return "";
  if (daysRemaining.value < 0) return `${Math.abs(daysRemaining.value)}d atrasado`;
  if (daysRemaining.value === 0) return "Hoje";
  if (daysRemaining.value === 1) return "Amanhã";
  return `${daysRemaining.value}d restantes`;
});

const formatDeadline = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};

const cardBorderStyle = computed(() => {
  if (!props.project.category?.color) return {};
  return { borderLeftColor: props.project.category.color };
});

const categoryBadgeStyle = computed(() => {
  if (!props.project.category?.color) return {};
  const color = props.project.category.color;
  return {
    backgroundColor: `${color}15`,
    color,
    borderColor: `${color}30`,
  };
});

const startEditTitle = () => {
  editTitle.value = props.project.title;
  isEditingTitle.value = true;
  nextTick(() => titleInput.value?.focus());
};

const saveTitle = () => {
  if (!isEditingTitle.value) return;
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.project.title) {
    emit("update", props.project.id, { title: trimmed });
  }
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
};

const addTopic = () => {
  const trimmed = newTopicTitle.value.trim();
  if (trimmed) {
    emit("addTopic", props.project.id, trimmed);
  }
  newTopicTitle.value = "";
  showAddTopic.value = false;
};

const cancelAddTopic = () => {
  newTopicTitle.value = "";
  showAddTopic.value = false;
};

const addProjectTask = () => {
  const trimmed = newProjectTaskTitle.value.trim();
  if (trimmed) {
    emit("addTask", props.project.id, trimmed, "project");
  }
  newProjectTaskTitle.value = "";
  showAddProjectTask.value = false;
};

const cancelAddProjectTask = () => {
  newProjectTaskTitle.value = "";
  showAddProjectTask.value = false;
};

const handleTopicExpand = (topicId: string, expanded: boolean) => {
  const topic = props.project.topics?.find((t) => t.id === topicId);
  if (topic) topic.expanded = expanded;
};

const handleSubtopicExpand = (subtopicId: string, expanded: boolean) => {
  for (const topic of props.project.topics || []) {
    const sub = topic.subtopics?.find((s) => s.id === subtopicId);
    if (sub) {
      sub.expanded = expanded;
      break;
    }
  }
};

watch(showAddTopic, (val) => {
  if (val) nextTick(() => newTopicInput.value?.focus());
});

watch(showAddProjectTask, (val) => {
  if (val) nextTick(() => newProjectTaskInput.value?.focus());
});
</script>

<style scoped>
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.project-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.category-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.project-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.title-edit {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  padding: 2px 8px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  min-width: 0;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-outer {
  width: 60px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 28px;
}

.project-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.project-card:hover .project-actions {
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

.project-body {
  padding: 0 var(--spacing-sm) var(--spacing-sm);
}

.project-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
}

.project-deadline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  padding: 6px 10px;
  background: var(--color-background);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.project-deadline.overdue {
  color: #dc2626;
  background: #fee2e2;
}

.deadline-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
}

.project-deadline.overdue .deadline-badge {
  background: rgba(220, 38, 38, 0.15);
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.add-inline {
  padding: var(--spacing-xs) 0;
}

.add-input {
  width: 100%;
  padding: 8px var(--spacing-sm);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
}

.add-input::placeholder {
  color: var(--color-text-secondary);
}

.add-topic-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px var(--spacing-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  margin-top: var(--spacing-xs);
}

.add-topic-btn:hover {
  color: var(--color-primary);
  background: var(--color-background);
}

.project-tasks-list {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
  border-top: 1px dashed var(--color-border);
}

.project-add-actions {
  display: flex;
  gap: var(--spacing-xs);
}

@media (max-width: 640px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .project-meta {
    width: 100%;
    justify-content: space-between;
  }

  .project-actions {
    opacity: 1;
  }
}
</style>
