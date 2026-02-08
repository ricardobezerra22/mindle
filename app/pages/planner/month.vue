<template>
  <div class="planner-page">
    <div class="planner-container">
      <div class="month-header">
        <button
          class="nav-btn"
          @click="previousMonth"
        >
          <Icon
            name="lucide:chevron-left"
            size="20"
          />
        </button>
        <div class="month-info">
          <h1 class="page-title">
            {{ currentMonthName }}
          </h1>
          <p class="month-year">
            {{ currentYear }}
          </p>
        </div>
        <button
          class="nav-btn"
          @click="nextMonth"
        >
          <Icon
            name="lucide:chevron-right"
            size="20"
          />
        </button>
      </div>

      <div class="monthly-overview">
        <div class="overview-card">
          <h4>Tarefas do mês</h4>
          <p class="overview-value">
            {{ monthlyTasksCount }}
          </p>
        </div>
        <div class="overview-card">
          <h4>Concluídas</h4>
          <p class="overview-value">
            {{ completedTasksCount }}
          </p>
        </div>
        <div class="overview-card">
          <h4>Pendentes</h4>
          <p class="overview-value">
            {{ pendingTasksCount }}
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
        class="calendar-container"
      >
        <div class="calendar-grid">
          <div
            v-for="day in weekDays"
            :key="day"
            class="calendar-header-cell"
          >
            {{ day }}
          </div>

          <div
            v-for="day in calendarDays"
            :key="day.date"
            :class="[
              'calendar-day',
              {
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'weekend': day.isWeekend,
              },
            ]"
          >
            <div class="day-number">
              {{ day.dayNumber }}
            </div>

            <div
              v-if="day.isCurrentMonth"
              class="day-tasks"
            >
              <div
                v-for="task in getTasksForDay(day.date)"
                :key="task.id"
                :class="['task-item', `status-${task.status.toLowerCase()}`]"
                @click="toggleTaskStatus(task.id, task.status)"
              >
                <Icon
                  :name="
                    task.status === 'DONE'
                      ? 'lucide:check-circle-2'
                      : 'lucide:circle'
                  "
                  size="12"
                />
                <span class="task-title">{{ task.title }}</span>
                <span
                  v-if="task.priority === 'HIGH'"
                  class="priority-indicator"
                />
              </div>

              <div
                v-if="getTasksForDay(day.date).length === 0"
                class="empty-day"
              >
                <span>—</span>
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
const tasks = ref<any[]>([]);
const currentDate = ref(new Date());
const toggleTimers = new Map<string, ReturnType<typeof setTimeout>>();
const toggleVersions = new Map<string, number>();
const toggleInFlight = new Set<string>();

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString("pt-PT", { month: "long" });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  const daysToAdd = 6 - lastDay.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);

  const days = [];
  const currentDateObj = new Date(startDate);

  while (currentDateObj <= endDate) {
    const date = new Date(currentDateObj);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.toDateString() === new Date().toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    days.push({
      date: date.toISOString().split("T")[0],
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday,
      isWeekend,
    });

    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  return days;
});

const monthlyTasksCount = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  return tasks.value.filter((t) => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  }).length;
});

const completedTasksCount = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  return tasks.value.filter((t) => {
    if (!t.dueDate || t.status !== "DONE") return false;
    const taskDate = new Date(t.dueDate);
    return taskDate.getFullYear() === year && taskDate.getMonth() === month;
  }).length;
});

const pendingTasksCount = computed(() => {
  return monthlyTasksCount.value - completedTasksCount.value;
});

const getTasksForDay = (date: string) => {
  const tasksWithDueDate = tasks.value.filter(
    t => t.dueDate && t.dueDate.split("T")[0] === date,
  );

  return tasksWithDueDate.sort((a, b) => {
    if (a.status === "DONE" && b.status !== "DONE") return 1;
    if (a.status !== "DONE" && b.status === "DONE") return -1;
    if (a.priority === "HIGH" && b.priority !== "HIGH") return -1;
    if (a.priority !== "HIGH" && b.priority === "HIGH") return 1;
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

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
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

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.month-info {
  text-align: center;
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: capitalize;
}

.month-year {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.monthly-overview {
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

.calendar-container {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-md);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header-cell {
  background: var(--color-surface);
  padding: var(--spacing-sm);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-day {
  background: var(--color-surface);
  min-height: 100px;
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
}

.calendar-day:hover {
  background: #f7fbf9;
}

.calendar-day.other-month {
  background: #fafafa;
  opacity: 0.5;
}

.calendar-day.today {
  background: #f0f9f4;
  border: 2px solid var(--color-primary);
}

.calendar-day.weekend {
  background: #fafafa;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.calendar-day.today .day-number {
  color: var(--color-primary-dark);
}

.calendar-day.other-month .day-number {
  color: var(--color-text-secondary);
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.task-item:hover {
  background: #f7fbf9;
  border-color: var(--color-primary);
}

.task-item.status-done {
  opacity: 0.6;
}

.task-item :deep(svg) {
  flex-shrink: 0;
  color: var(--color-border);
}

.task-item.status-done :deep(svg) {
  color: var(--color-primary);
}

.task-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.task-item.status-done .task-title {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.priority-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  flex-shrink: 0;
}

.empty-day {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--color-text-secondary);
  font-size: 18px;
  opacity: 0.3;
}

@media (max-width: 1024px) {
  .calendar-day {
    min-height: 80px;
  }

  .task-item {
    font-size: 10px;
    padding: 3px 4px;
  }

  .task-item :deep(svg) {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 768px) {
  .planner-page {
    padding: var(--spacing-md);
  }

  .calendar-day {
    min-height: 60px;
  }

  .day-number {
    font-size: 12px;
  }

  .task-item {
    font-size: 9px;
    padding: 2px 3px;
    gap: 2px;
  }

  .task-title {
    max-width: 50px;
  }

  .priority-indicator {
    width: 4px;
    height: 4px;
  }

  .monthly-overview {
    grid-template-columns: 1fr;
  }
}
</style>
