<template>
  <div
    v-if="projects.length > 0"
    class="contribution-card"
  >
    <div class="contribution-header">
      <Icon name="lucide:pie-chart" size="16" />
      <h3 class="contribution-title">Contribuição dos projetos</h3>
    </div>

    <div class="segmented-bar">
      <div
        v-for="seg in segments"
        :key="seg.id"
        class="segment"
        :style="{ width: `${seg.percent}%`, backgroundColor: seg.color }"
        :title="`${seg.title}: ${seg.percent}%`"
      />
    </div>

    <div class="contribution-legend">
      <div
        v-for="seg in segments"
        :key="seg.id"
        class="legend-row"
      >
        <span
          class="legend-dot"
          :style="{ backgroundColor: seg.color }"
        />
        <span class="legend-name">{{ seg.title }}</span>
        <span class="legend-pct">{{ seg.percent }}%</span>
        <span class="legend-progress">{{ seg.progress }}% concluído</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types";

interface Props {
  projects: Project[];
}

const props = defineProps<Props>();

const defaultColors = [
  "#6faf8e", "#5b9bd5", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

const totalWeight = computed(() =>
  props.projects.reduce((sum, p) => sum + (p.weight || 1), 0),
);

const segments = computed(() =>
  props.projects.map((project, index) => {
    const weight = project.weight || 1;
    const percent = totalWeight.value > 0 ? Math.round((weight / totalWeight.value) * 100) : 0;

    let total = 0;
    let done = 0;
    for (const topic of project.topics || []) {
      for (const subtopic of topic.subtopics || []) {
        for (const task of subtopic.tasks || []) {
          total++;
          if (task.done) done++;
        }
      }
    }
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      id: project.id,
      title: project.title,
      color: project.category?.color || defaultColors[index % defaultColors.length],
      percent,
      progress,
    };
  }),
);
</script>

<style scoped>
.contribution-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.contribution-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
}

.contribution-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.segmented-bar {
  display: flex;
  height: 10px;
  border-radius: 100px;
  overflow: hidden;
  gap: 2px;
}

.segment {
  min-width: 4px;
  border-radius: 100px;
  transition: width 0.5s ease;
}

.contribution-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-pct {
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 36px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.legend-progress {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 90px;
}

@media (max-width: 640px) {
  .contribution-card {
    padding: var(--spacing-md);
  }

  .legend-progress {
    display: none;
  }
}
</style>
