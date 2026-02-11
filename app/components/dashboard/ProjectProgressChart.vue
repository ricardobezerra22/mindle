<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-row">
        <Icon name="lucide:folder-kanban" size="16" />
        <h3 class="chart-title">Progresso dos Projetos</h3>
      </div>
      <span class="chart-subtitle">% de conclusão por projeto</span>
    </div>
    <div class="chart-body">
      <div
        v-if="projects.length > 0"
        class="project-bars"
      >
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-bar-row"
        >
          <div class="project-bar-info">
            <span
              v-if="project.category"
              class="project-cat-dot"
              :style="{ backgroundColor: project.category.color }"
            />
            <span class="project-bar-name">{{ project.title }}</span>
            <span class="project-bar-pct">{{ project.progress }}%</span>
          </div>
          <div class="project-bar-track">
            <div
              class="project-bar-fill"
              :style="{ width: `${project.progress}%`, backgroundColor: barColor(project.progress) }"
            />
          </div>
          <span class="project-bar-tasks">{{ project.doneTasks }}/{{ project.totalTasks }}</span>
        </div>
      </div>
      <div v-else class="chart-empty">
        <span>Sem projetos ativos</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProjectProgress {
  id: string;
  title: string;
  progress: number;
  totalTasks: number;
  doneTasks: number;
  category: { name: string; color: string } | null;
}

interface Props {
  projects: ProjectProgress[];
}

defineProps<Props>();

const barColor = (progress: number) => {
  if (progress >= 80) return "#10b981";
  if (progress >= 50) return "#6faf8e";
  if (progress >= 25) return "#f59e0b";
  return "#e3ece9";
};
</script>

<style scoped>
.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.chart-subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.chart-body {
  min-height: 120px;
}

.project-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.project-bar-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-bar-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.project-cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-bar-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-bar-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.project-bar-track {
  height: 6px;
  background: var(--color-background);
  border-radius: 3px;
  overflow: hidden;
}

.project-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.project-bar-tasks {
  font-size: 11px;
  color: var(--color-text-secondary);
  align-self: flex-end;
}

.chart-empty {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 13px;
}

@media (max-width: 640px) {
  .chart-card {
    padding: var(--spacing-md);
  }

  .project-bar-name {
    font-size: 12px;
  }
}
</style>
