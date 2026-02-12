<template>
  <div class="planner-page">
    <div class="planner-container">
      <div class="week-header">
        <div class="week-header-top">
          <div>
            <h1 class="page-title">
              Esta semana
            </h1>
            <p class="date-range">
              {{ weekDateRange }}
            </p>
          </div>
          <UiButton @click="showCreateModal = true">
            <Icon name="lucide:plus" />
            Nova Tarefa
          </UiButton>
        </div>

        <div class="week-toolbar">
          <TasksTaskPriorityFilter v-model="favoriteFilter" />
          <TasksTaskSortFilter v-model="sortBy" />
        </div>
      </div>

      <div
        v-if="usedCategories.length > 0"
        class="category-legend"
      >
        <span
          v-for="cat in usedCategories"
          :key="cat.id"
          class="legend-item"
        >
          <span
            class="legend-dot"
            :style="{ backgroundColor: cat.color }"
          />
          <span class="legend-name">{{ cat.name }}</span>
        </span>
      </div>

      <div class="weekly-overview-toggle">
        <button
          class="overview-btn"
          @click="showOverview = !showOverview"
        >
          <Icon
            :name="showOverview ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            size="18"
          />
          Visão geral
        </button>
      </div>

      <div
        v-if="showOverview"
        class="weekly-overview"
      >
        <div class="overview-card">
          <h4>Tarefas planejadas</h4>
          <p class="overview-value">
            {{ totalPlannedTasks }}
          </p>
        </div>
        <div class="overview-card">
          <h4>Concluídas</h4>
          <p class="overview-value">
            {{ completedTasks }}
          </p>
        </div>
      </div>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="skeleton-days-grid">
          <div
            v-for="i in 7"
            :key="i"
            class="skeleton-day-column"
          >
            <div class="skeleton-day-header">
              <UiSkeleton height="16px" :width="['50%', '60%', '45%', '55%', '50%', '60%', '40%'][i - 1]" />
              <UiSkeleton height="12px" width="40%" />
            </div>
            <div class="skeleton-day-tasks">
              <div
                v-for="j in (i % 2 === 0 ? 2 : 1)"
                :key="j"
                class="skeleton-task"
              >
                <UiSkeleton variant="circle" width="20px" height="20px" />
                <div class="skeleton-task-lines">
                  <UiSkeleton height="12px" width="85%" />
                  <UiSkeleton height="10px" width="50%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="days-grid"
      >
        <div
          v-for="day in weekDays"
          :key="day.date"
          :class="['day-column', { today: day.isToday, 'drag-over': dragOverDay === day.date }]"
          @dragover.prevent="handleDragOver(day.date)"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop(day.date)"
        >
          <div class="day-header">
            <div class="day-info">
              <h2 class="day-label">
                {{ day.label }}
              </h2>
              <span class="day-date">{{ day.dateFormatted }}</span>
            </div>
          </div>

          <div
            v-if="getTasksForDay(day.date).length === 0"
            class="empty-day"
          >
            <p>Nada planejado ainda.</p>
          </div>

          <div
            v-else
            class="tasks-list"
          >
            <div
              v-for="task in getTasksForDay(day.date)"
              :key="task.id"
              :class="['task-card', `status-${task.status.toLowerCase()}`, { dragging: draggedTaskId === task.id }]"
              :style="getTaskCardStyle(task)"
              draggable="true"
              @dragstart="handleDragStart(task.id, day.date)"
              @dragend="handleDragEnd"
            >
              <button
                class="task-check"
                @click="toggleTaskStatus(task.id, task.status)"
              >
                <Icon
                  :name="
                    task.status === 'DONE'
                      ? 'lucide:check-circle-2'
                      : 'lucide:circle'
                  "
                />
              </button>

              <div class="task-content">
                <h3 class="task-title">
                  {{ task.title }}
                </h3>
                <div class="task-meta">
                  <span
                    :class="[
                      'status-badge',
                      `status-${task.status.toLowerCase()}`,
                    ]"
                  >
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span
                    v-if="task.priority"
                    class="priority-badge"
                    :class="`priority-${task.priority.toLowerCase()}`"
                  >
                    {{
                      task.priority === "HIGH"
                        ? "Alta"
                        : task.priority === "MEDIUM"
                          ? "Média"
                          : "Baixa"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TasksTaskCreateModal
      v-model="showCreateModal"
      @created="fetchTasks"
    />
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const { playDone } = useSound();
const { preferences } = usePreferences();

const loading = ref(false);
const showOverview = ref(false);
const showCreateModal = ref(false);
const favoriteFilter = ref(false);
const sortBy = ref<"HIGHEST_PRIORITY" | "LOWEST_PRIORITY" | "">("HIGHEST_PRIORITY");

const tasks = ref<any[]>([]);
const toggleTimers = new Map<string, ReturnType<typeof setTimeout>>();
const toggleVersions = new Map<string, number>();
const toggleInFlight = new Set<string>();
const draggedTaskId = ref<string | null>(null);
const dragSourceDay = ref<string | null>(null);
const dragOverDay = ref<string | null>(null);

const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = preferences.value.weekStart === "sunday" ? 0 : 1;
  const currentDay = today.getDay();
  const diff = (currentDay - startDay + 7) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);

    const todayStr = today.toISOString().split("T")[0];
    const dateStr = date.toISOString().split("T")[0];
    const isToday = dateStr === todayStr;

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = dateStr === tomorrow.toISOString().split("T")[0];

    let label = "";
    if (isToday) {
      label = "Hoje";
    } else if (isTomorrow) {
      label = "Amanhã";
    } else {
      label = date.toLocaleDateString("pt-PT", { weekday: "long" });
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }

    days.push({
      date: dateStr,
      dateFormatted: date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
      }),
      label,
      isToday,
    });
  }

  return days;
});

const weekDateRange = computed(() => {
  if (weekDays.value.length === 0) return "";
  const first = weekDays.value[0];
  const last = weekDays.value[weekDays.value.length - 1];
  return `${first.dateFormatted} - ${last.dateFormatted}`;
});

const totalPlannedTasks = computed(() => {
  const weekTaskIds = new Set<string>();
  weekDays.value.forEach((day) => {
    getTasksForDay(day.date).forEach(task => weekTaskIds.add(task.id));
  });
  return weekTaskIds.size;
});

const completedTasks = computed(() => {
  const weekTasks = new Set<string>();
  weekDays.value.forEach((day) => {
    getTasksForDay(day.date).forEach((task) => {
      if (task.status === "DONE") weekTasks.add(task.id);
    });
  });
  return weekTasks.size;
});

const usedCategories = computed(() => {
  const catMap = new Map<string, { id: string; name: string; color: string }>();
  tasks.value.forEach((t) => {
    if (t.category?.id) {
      catMap.set(t.category.id, { id: t.category.id, name: t.category.name, color: t.category.color });
    }
  });
  return Array.from(catMap.values());
});

const getTaskCardStyle = (task: any) => {
  if (!task.category?.color) return {};
  const color = task.category.color;
  return {
    backgroundColor: `${color}12`,
    borderLeftColor: color,
    borderLeftWidth: '3px',
  };
};

const getTasksForDay = (date: string) => {
  let filtered = tasks.value.filter(
    t => t.dueDate && t.dueDate.split("T")[0] === date,
  );

  if (favoriteFilter.value) {
    filtered = filtered.filter(t => t.isFavorite);
  }

  const priorityWeight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  return filtered.sort((a, b) => {
    if (a.status === "DONE" && b.status !== "DONE") return 1;
    if (a.status !== "DONE" && b.status === "DONE") return -1;

    if (sortBy.value) {
      const dir = sortBy.value === "HIGHEST_PRIORITY" ? -1 : 1;
      const diff = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
      if (diff !== 0) return dir * diff;
    }

    return 0;
  });
};

const handleDragStart = (taskId: string, date: string) => {
  draggedTaskId.value = taskId;
  dragSourceDay.value = date;
};

const handleDragOver = (date: string) => {
  dragOverDay.value = date;
};

const handleDragLeave = () => {
  dragOverDay.value = null;
};

const handleDragEnd = () => {
  draggedTaskId.value = null;
  dragSourceDay.value = null;
  dragOverDay.value = null;
};

const handleDrop = async (targetDate: string) => {
  dragOverDay.value = null;
  const taskId = draggedTaskId.value;
  const sourceDate = dragSourceDay.value;
  draggedTaskId.value = null;
  dragSourceDay.value = null;

  if (!taskId || sourceDate === targetDate) return;

  const index = tasks.value.findIndex(t => t.id === taskId);
  if (index === -1) return;

  const oldDueDate = tasks.value[index].dueDate;
  tasks.value[index] = { ...tasks.value[index], dueDate: `${targetDate}T${oldDueDate?.split("T")[1] || "12:00:00.000Z"}` };

  try {
    const response = await $fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: { dueDate: new Date(`${targetDate}T12:00:00.000Z`) },
    });
    if (response.success) {
      const i = tasks.value.findIndex(t => t.id === taskId);
      if (i !== -1) tasks.value[i] = response.data;
    }
  } catch (error) {
    tasks.value[index] = { ...tasks.value[index], dueDate: oldDueDate };
    console.error("Error moving task:", error);
    toast.error({ title: "Erro ao mover tarefa" });
  }
};

const fetchTasks = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/tasks");
    if (response.success) {
      tasks.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    loading.value = false;
  }
};

const toggleTaskStatus = (taskId: string, _currentStatus: string) => {
  if (toggleInFlight.has(taskId)) return;

  const index = tasks.value.findIndex(t => t.id === taskId);
  if (index === -1) return;

  const current = tasks.value[index].status;
  const newStatus = current === "DONE" ? "IN_PROGRESS" : "DONE";

  tasks.value[index] = { ...tasks.value[index], status: newStatus };

  if (newStatus === "DONE") {
    playDone();
    toast.success({ title: "Tarefa concluída" });
  }

  const version = (toggleVersions.get(taskId) || 0) + 1;
  toggleVersions.set(taskId, version);

  if (toggleTimers.has(taskId)) {
    clearTimeout(toggleTimers.get(taskId)!);
  }

  const timer = setTimeout(async () => {
    toggleTimers.delete(taskId);

    if (toggleVersions.get(taskId) !== version) return;

    const idx = tasks.value.findIndex(t => t.id === taskId);
    if (idx === -1) return;
    const finalStatus = tasks.value[idx].status;

    toggleInFlight.add(taskId);
    try {
      const response = await $fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: { status: finalStatus },
      });

      if (response.success && toggleVersions.get(taskId) === version) {
        const i = tasks.value.findIndex(t => t.id === taskId);
        if (i !== -1) tasks.value[i] = response.data;
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error({ title: "Erro ao atualizar tarefa" });
    } finally {
      toggleInFlight.delete(taskId);
      toggleVersions.delete(taskId);
    }
  }, 500);

  toggleTimers.set(taskId, timer);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    NOT_STARTED: "Não iniciado",
    IN_PROGRESS: "Em progresso",
    DONE: "Concluído",
  };
  return labels[status] || status;
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.planner-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.planner-container {
  max-width: 100%;
  margin: 0 auto;
}

.week-header {
  margin-bottom: var(--spacing-lg);
}

.week-header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.week-toolbar {
  display: flex;
  gap: var(--spacing-sm);
  max-width: 360px;
}

.category-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  white-space: nowrap;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.date-range {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.weekly-overview-toggle {
  margin-bottom: var(--spacing-md);
}

.overview-btn {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.overview-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.weekly-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.overview-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
}

.overview-card h4 {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
}

.overview-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.loading-state {
  padding: var(--spacing-md) 0;
}

.skeleton-days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.skeleton-day-column {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-md);
  min-height: 300px;
}

.skeleton-day-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.skeleton-day-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-task {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: 10px;
}

.skeleton-task-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  overflow-x: auto;
}

.day-column {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-md);
  transition: all 0.2s ease;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.day-column.today {
  border-color: var(--color-primary);
  background: var(--color-today-bg);
}

.day-column.drag-over {
  border-color: var(--color-primary);
  background: rgba(111, 175, 142, 0.06);
}

.task-card.dragging {
  opacity: 0.4;
}

.task-card[draggable="true"] {
  cursor: grab;
}

.task-card[draggable="true"]:active {
  cursor: grabbing;
}

.day-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.day-column.today .day-label {
  color: var(--color-primary-dark);
}

.day-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.add-task-btn {
  width: 100%;
  padding: var(--spacing-xs);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.add-task-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.empty-day {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-style: italic;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-day p {
  margin: 0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.task-card.status-done {
  opacity: 0.6;
}

.task-card:hover {
  box-shadow: 0 2px 8px rgba(111, 175, 142, 0.08);
}

.task-check {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.task-check :deep(svg) {
  width: 20px;
  height: 20px;
  color: var(--color-border);
  transition: all 0.2s ease;
}

.task-card.status-done .task-check :deep(svg) {
  color: var(--color-primary);
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.task-card.status-done .task-title {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.status-badge {
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.priority-badge {
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.priority-badge.priority-high {
  background: var(--status-not-started-bg, #ffebee);
  color: #ef5350;
}

.priority-badge.priority-medium {
  background: var(--status-in-progress-bg, #fff3e0);
  color: var(--status-in-progress-color, #ef6c00);
}

.priority-badge.priority-low {
  background: var(--status-done-bg, #e8f5e9);
  color: var(--status-done-color, #2e7d32);
}

.status-badge.status-not_started {
  background: var(--status-not-started-bg, #e8eaed);
  color: var(--status-not-started-color, #5f6368);
}

.status-badge.status-in_progress {
  background: var(--status-in-progress-bg, #e3f2fd);
  color: var(--status-in-progress-color, #1976d2);
}

.status-badge.status-done {
  background: var(--status-done-bg, #d1f4e0);
  color: var(--status-done-color, #2d7a4f);
}

@media (max-width: 1200px) {
  .days-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .planner-page {
    padding: var(--spacing-md);
  }

  .days-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .day-column {
    min-height: 300px;
  }

  .weekly-overview {
    grid-template-columns: 1fr;
  }
}
</style>
