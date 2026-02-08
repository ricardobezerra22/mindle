<template>
  <div class="planner-page">
    <div class="planner-container">
      <div class="week-header">
        <h1 class="page-title">
          Esta semana
        </h1>
        <p class="date-range">
          {{ weekDateRange }}
        </p>
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
        <Icon
          name="lucide:loader-2"
          class="spinning"
        />
        <p>Carregando...</p>
      </div>

      <div
        v-else
        class="days-grid"
      >
        <div
          v-for="day in weekDays"
          :key="day.date"
          :class="['day-column', { today: day.isToday }]"
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
              :class="['task-card', `status-${task.status.toLowerCase()}`]"
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
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const { playDone } = useSound();

const loading = ref(false);
const showOverview = ref(false);

const tasks = ref<any[]>([]);
const toggleTimers = new Map<string, ReturnType<typeof setTimeout>>();
const toggleVersions = new Map<string, number>();
const toggleInFlight = new Set<string>();

const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDay();
  const daysUntilSunday = 7 - currentDay;

  for (let i = 0; i <= daysUntilSunday; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const isToday = i === 0;
    const isTomorrow = i === 1;

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
      date: date.toISOString().split("T")[0],
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

const getTasksForDay = (date: string) => {
  const tasksWithDueDate = tasks.value.filter(
    t => t.dueDate && t.dueDate.split("T")[0] === date,
  );

  return tasksWithDueDate.sort((a, b) => {
    if (a.status === "DONE" && b.status !== "DONE") return 1;
    if (a.status !== "DONE" && b.status === "DONE") return -1;
    return 0;
  });
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
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.loading-state :deep(svg) {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  background: #f7fbf9;
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
  background: #ffebee;
  color: #c62828;
}

.priority-badge.priority-medium {
  background: #fff3e0;
  color: #ef6c00;
}

.priority-badge.priority-low {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.status-not_started {
  background: #e8eaed;
  color: #5f6368;
}

.status-badge.status-in_progress {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.status-done {
  background: #d1f4e0;
  color: #2d7a4f;
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
