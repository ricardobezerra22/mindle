<template>
  <div class="project-list">
    <div class="list-header">
      <h2 class="list-title">
        <Icon name="lucide:folder" size="18" />
        Projetos vinculados
      </h2>
      <button
        class="link-btn"
        @click="emit('linkProject')"
      >
        <Icon name="lucide:plus" size="16" />
        Vincular projeto
      </button>
    </div>

    <div
      v-if="projects.length === 0"
      class="empty-state"
    >
      <Icon name="lucide:folder-open" size="32" />
      <p>Nenhum projeto vinculado a esta meta.</p>
      <button class="empty-btn" @click="emit('linkProject')">
        <Icon name="lucide:plus" size="14" />
        Vincular projeto
      </button>
    </div>

    <TransitionGroup
      v-else
      name="list"
      tag="div"
      class="projects-grid"
    >
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-top">
          <div class="project-info">
            <span
              v-if="project.category"
              class="category-badge"
              :style="{ backgroundColor: `${project.category.color}18`, color: project.category.color }"
            >{{ project.category.name }}</span>
            <h3 class="project-name">{{ project.title }}</h3>
          </div>
          <button
            class="unlink-btn"
            title="Desvincular"
            @click.stop="emit('unlinkProject', project.id)"
          >
            <Icon name="lucide:x" size="14" />
          </button>
        </div>

        <GoalsGoalProgressBar
          :value="getProgress(project)"
          :color="project.category?.color"
          size="sm"
        />

        <div class="project-meta">
          <span class="contribution">
            Contribuição: <strong>{{ getContribution(project) }}%</strong>
          </span>
          <span class="task-count">
            {{ getCompletedTasks(project) }}/{{ getTotalTasks(project) }} tarefas
          </span>
        </div>

        <div class="project-actions">
          <NuxtLink
            :to="`/projects?open=${project.id}`"
            class="view-link"
          >
            Ver projeto
            <Icon name="lucide:arrow-right" size="13" />
          </NuxtLink>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types";

interface Props {
  projects: Project[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  linkProject: [];
  unlinkProject: [projectId: string];
}>();

const getTotalTasks = (project: Project) => {
  let total = 0;
  for (const topic of project.topics || []) {
    for (const subtopic of topic.subtopics || []) {
      total += subtopic.tasks?.length || 0;
    }
  }
  return total;
};

const getCompletedTasks = (project: Project) => {
  let done = 0;
  for (const topic of project.topics || []) {
    for (const subtopic of topic.subtopics || []) {
      done += subtopic.tasks?.filter(t => t.done).length || 0;
    }
  }
  return done;
};

const getProgress = (project: Project) => {
  const total = getTotalTasks(project);
  if (total === 0) return 0;
  return Math.round((getCompletedTasks(project) / total) * 100);
};

const totalWeight = computed(() =>
  props.projects.reduce((sum, p) => sum + (p.weight || 1), 0),
);

const getContribution = (project: Project) => {
  if (totalWeight.value === 0) return 0;
  return Math.round(((project.weight || 1) / totalWeight.value) * 100);
};
</script>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.link-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.link-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(111, 175, 142, 0.06);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl) var(--spacing-lg);
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.empty-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-primary);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.empty-btn:hover {
  background: var(--color-primary-dark);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease;
}

.project-card:hover {
  border-color: var(--color-text-secondary);
}

.project-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.category-badge {
  display: inline-flex;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.project-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unlink-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
  opacity: 0;
}

.project-card:hover .unlink-btn {
  opacity: 1;
}

.unlink-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.project-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.contribution strong {
  color: var(--color-text-primary);
}

.project-actions {
  padding-top: var(--spacing-xs);
}

.view-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.view-link:hover {
  gap: 6px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .unlink-btn {
    opacity: 1;
  }
}
</style>
