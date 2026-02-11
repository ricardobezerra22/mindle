<template>
  <div class="dashboard">
    <section class="greeting-section">
      <div class="greeting-content">
        <h1 class="greeting-text">
          {{ greetingMessage }}, {{ userName }}
        </h1>
        <p class="context-line">
          {{ contextLine }}
        </p>
      </div>
      <div class="greeting-date">
        <span class="date-day">{{ todayFormatted.day }}</span>
        <span class="date-full">{{ todayFormatted.full }}</span>
      </div>
    </section>

    <div class="dashboard-grid">
      <div class="col-main">
        <section class="focus-section">
          <div class="section-label">
            <Icon name="lucide:target" size="16" />
            <span>Foco de hoje</span>
          </div>

          <div v-if="loadingTasks" class="loading-placeholder">
            <div
              v-for="i in 3"
              :key="i"
              class="skeleton-focus-task"
            >
              <UiSkeleton variant="circle" width="20px" height="20px" />
              <UiSkeleton height="14px" :width="['85%', '65%', '75%'][i - 1]" />
            </div>
          </div>

          <div v-else-if="todayTasks.length === 0" class="empty-focus">
            <p class="empty-message">Hoje está livre.</p>
            <p class="empty-hint">Escolha uma coisa ou descanse.</p>
          </div>

          <div v-else class="focus-tasks">
            <div
              v-for="task in todayTasks.slice(0, 5)"
              :key="task.id"
              :class="['focus-task', `status-${task.status.toLowerCase()}`]"
              @click="toggleTaskStatus(task.id, task.status)"
            >
              <Icon
                :name="task.status === 'DONE' ? 'lucide:check-circle-2' : 'lucide:circle'"
                size="20"
                class="task-icon"
              />
              <span class="task-name">{{ task.title }}</span>
              <span v-if="task.priority === 'HIGH'" class="priority-dot" />
            </div>
            <p v-if="todayTasks.length > 5" class="more-tasks">
              +{{ todayTasks.length - 5 }} mais
            </p>
          </div>

          <NuxtLink to="/focus" class="focus-action">
            <Icon name="lucide:play" size="16" />
            Iniciar foco
          </NuxtLink>
        </section>

        <section class="week-view-section">
          <div class="section-label">
            <Icon name="lucide:calendar-days" size="16" />
            <span>Visão semanal</span>
          </div>
          <div class="week-days-row">
            <NuxtLink
              v-for="day in weekDaysPreview"
              :key="day.date"
              to="/planner/week"
              :class="['week-day-cell', { 'today': day.isToday, 'has-tasks': day.taskCount > 0 }]"
            >
              <span class="week-day-name">{{ day.label }}</span>
              <span class="week-day-number">{{ day.dayNumber }}</span>
              <div class="task-dots">
                <span
                  v-for="n in Math.min(day.taskCount, 3)"
                  :key="n"
                  :class="['task-dot', { done: n <= day.doneCount }]"
                />
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>

      <div class="col-side">
        <section class="progress-section">
          <div class="section-label">
            <Icon name="lucide:bar-chart-3" size="16" />
            <span>Progresso semanal</span>
          </div>
          <div class="progress-cards">
            <div class="progress-card">
              <div class="progress-icon">
                <Icon name="lucide:list-checks" size="18" />
              </div>
              <div class="progress-info">
                <span class="progress-value">{{ weekPlanned }}</span>
                <span class="progress-label">planejadas</span>
              </div>
            </div>
            <div class="progress-card">
              <div class="progress-icon done">
                <Icon name="lucide:check-check" size="18" />
              </div>
              <div class="progress-info">
                <span class="progress-value">{{ weekCompleted }}</span>
                <span class="progress-label">concluídas</span>
              </div>
            </div>
            <div class="progress-card">
              <div class="progress-icon pending">
                <Icon name="lucide:clock" size="18" />
              </div>
              <div class="progress-info">
                <span class="progress-value">{{ weekPlanned - weekCompleted }}</span>
                <span class="progress-label">pendentes</span>
              </div>
            </div>
          </div>
          <div v-if="weekPlanned > 0" class="completion-bar-wrap">
            <div class="completion-bar">
              <div class="completion-fill" :style="{ width: completionPercent + '%' }" />
            </div>
            <span class="completion-text">{{ completionPercent }}% concluído</span>
          </div>
        </section>

        <section v-if="habits.length > 0" class="habits-section">
          <div class="section-label">
            <Icon name="lucide:heart" size="16" />
            <span>Hábitos de hoje</span>
          </div>
          <div class="habits-row">
            <button
              v-for="habit in habits"
              :key="habit.id"
              :class="['habit-bubble', { checked: isHabitCheckedToday(habit.id) }]"
              @click="toggleHabit(habit.id)"
            >
              <Icon :name="habit.icon || 'lucide:circle'" size="22" />
            </button>
          </div>
        </section>

        <section v-if="preferences.financeReminder && pendingFinanceCount > 0" class="finance-section">
          <NuxtLink to="/finance" class="finance-card">
            <Icon name="lucide:wallet" size="18" />
            <span>{{ pendingFinanceCount }} {{ pendingFinanceCount === 1 ? "item precisa" : "itens precisam" }} de atenção</span>
            <Icon name="lucide:arrow-right" size="14" />
          </NuxtLink>
        </section>

        <section class="quick-links">
          <NuxtLink to="/tasks" class="quick-link">
            <Icon name="lucide:list-checks" size="18" />
            <span>Todas as tarefas</span>
            <Icon name="lucide:chevron-right" size="14" />
          </NuxtLink>
          <NuxtLink to="/planner/week" class="quick-link">
            <Icon name="lucide:calendar-days" size="18" />
            <span>Planner semanal</span>
            <Icon name="lucide:chevron-right" size="14" />
          </NuxtLink>
          <NuxtLink to="/projects" class="quick-link">
            <Icon name="lucide:folder-kanban" size="18" />
            <span>Projetos</span>
            <Icon name="lucide:chevron-right" size="14" />
          </NuxtLink>
          <NuxtLink to="/metrics" class="quick-link">
            <Icon name="lucide:bar-chart-2" size="18" />
            <span>Métricas</span>
            <Icon name="lucide:chevron-right" size="14" />
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const toast = useToast();
const { playDone } = useSound();
const { preferences } = usePreferences();

const loadingTasks = ref(true);
const tasks = ref<any[]>([]);
const habits = ref<any[]>([]);
const habitLogs = ref<any[]>([]);
const finances = ref<any[]>([]);
const toggleTimers = new Map<string, ReturnType<typeof setTimeout>>();
const toggleVersions = new Map<string, number>();
const toggleInFlight = new Set<string>();

const userName = computed(() => {
  const name = user.value?.name;
  return name ? name.split(" ")[0] : "";
});

const greetingMessage = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
});

const todayFormatted = computed(() => {
  const now = new Date();
  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  return {
    day: dayNames[now.getDay()],
    full: now.toLocaleDateString("pt-BR", { day: "numeric", month: "long" }),
  };
});

const todayStr = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const weekDaysPreview = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  const daysUntilSunday = 7 - currentDay;
  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  for (let i = 0; i <= daysUntilSunday; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayTasks = tasks.value.filter(
      t => t.dueDate && t.dueDate.split("T")[0] === dateStr,
    );

    days.push({
      date: dateStr,
      label: dayLabels[date.getDay()],
      dayNumber: date.getDate(),
      isToday: i === 0,
      taskCount: dayTasks.length,
      doneCount: dayTasks.filter(t => t.status === "DONE").length,
    });
  }

  return days;
});

const todayTasks = computed(() => {
  return tasks.value
    .filter(t => t.dueDate && t.dueDate.split("T")[0] === todayStr.value)
    .sort((a, b) => {
      if (a.status === "DONE" && b.status !== "DONE") return 1;
      if (a.status !== "DONE" && b.status === "DONE") return -1;
      if (a.priority === "HIGH" && b.priority !== "HIGH") return -1;
      if (a.priority !== "HIGH" && b.priority === "HIGH") return 1;
      return 0;
    });
});

const contextLine = computed(() => {
  const pending = todayTasks.value.filter(t => t.status !== "DONE").length;
  if (pending === 0 && todayTasks.value.length === 0)
    return "Nenhuma tarefa para hoje. Aproveite o momento.";
  if (pending === 0) return "Tudo concluído. Você merece descansar.";
  if (pending === 1) return "Só 1 coisa para hoje. Você consegue.";
  return `${pending} coisas planejadas. Um passo de cada vez.`;
});

const weekPlanned = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  const daysUntilSunday = 7 - currentDay;

  const weekDates = new Set<string>();
  for (let i = 0; i <= daysUntilSunday; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    weekDates.add(date.toISOString().split("T")[0]);
  }

  return tasks.value.filter(
    t => t.dueDate && weekDates.has(t.dueDate.split("T")[0]),
  ).length;
});

const weekCompleted = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  const daysUntilSunday = 7 - currentDay;

  const weekDates = new Set<string>();
  for (let i = 0; i <= daysUntilSunday; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    weekDates.add(date.toISOString().split("T")[0]);
  }

  return tasks.value.filter(
    t =>
      t.dueDate
      && weekDates.has(t.dueDate.split("T")[0])
      && t.status === "DONE",
  ).length;
});

const completionPercent = computed(() => {
  if (weekPlanned.value === 0) return 0;
  return Math.round((weekCompleted.value / weekPlanned.value) * 100);
});

const pendingFinanceCount = computed(() => {
  return finances.value.filter(f => f.status !== "PAID" && !f.archived)
    .length;
});

const isHabitCheckedToday = (habitId: string) => {
  const today = new Date().toDateString();
  return habitLogs.value.some(
    log =>
      log.habitId === habitId
      && new Date(log.date).toDateString() === today
      && log.done,
  );
};

const fetchTasks = async () => {
  loadingTasks.value = true;
  try {
    const response = await $fetch("/api/tasks");
    if (response.success) {
      tasks.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    loadingTasks.value = false;
  }
};

const fetchHabits = async () => {
  try {
    const response = await $fetch("/api/habits");
    if (response.success) {
      habits.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
};

const fetchHabitLogs = async () => {
  try {
    const response = await $fetch("/api/habits/logs");
    if (response.success) {
      habitLogs.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching habit logs:", error);
  }
};

const fetchFinances = async () => {
  try {
    const response = await $fetch("/api/finance");
    if (response.success) {
      finances.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching finances:", error);
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
    toast.success({
      title: "Tarefa concluída",
      message: "Continue assim!",
    });
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
      toast.error({
        title: "Erro ao atualizar tarefa",
        message: "Tente novamente mais tarde",
      });
    } finally {
      toggleInFlight.delete(taskId);
      toggleVersions.delete(taskId);
    }
  }, 500);

  toggleTimers.set(taskId, timer);
};

const toggleHabit = async (habitId: string) => {
  const isChecked = isHabitCheckedToday(habitId);
  const today = new Date().toISOString();

  try {
    if (isChecked) {
      const log = habitLogs.value.find(
        l =>
          l.habitId === habitId
          && new Date(l.date).toDateString() === new Date().toDateString(),
      );
      if (log) {
        await $fetch(`/api/habits/log-${log.id}`, { method: "DELETE" });
        habitLogs.value = habitLogs.value.filter(l => l.id !== log.id);
      }
    } else {
      const response = await $fetch("/api/habits/logs", {
        method: "POST",
        body: { habitId, date: today, done: true },
      });
      if (response.success) {
        habitLogs.value.push(response.data);
        playDone();
        toast.success({
          title: "Hábito registrado",
          message: "Continue assim!",
        });
      }
    }
  } catch (error) {
    console.error("Error toggling habit:", error);
    toast.error({
      title: "Erro ao registrar hábito",
      message: "Tente novamente mais tarde",
    });
  }
};

onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchHabits(),
    fetchHabitLogs(),
    fetchFinances(),
  ]);
});
</script>

<style scoped lang="css">
.dashboard {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.greeting-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.greeting-content {
  flex: 1;
}

.greeting-text {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.context-line {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: 1.5;
}

.greeting-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.date-day {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.date-full {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.dashboard-grid {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.col-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-width: 0;
}

.col-side {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-md);
}

.section-label :deep(svg) {
  color: var(--color-text-secondary);
}

.focus-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.skeleton-focus-task {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border-radius: 12px;
}

.empty-focus {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.empty-message {
  font-size: 17px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
}

.focus-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.focus-task {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.focus-task:hover {
  background: #f0f9f4;
}

.focus-task.status-done {
  opacity: 0.5;
}

.task-icon {
  flex-shrink: 0;
  color: var(--color-border);
  transition: all 0.2s ease;
}

.focus-task.status-done .task-icon {
  color: var(--color-primary);
}

.task-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.focus-task.status-done .task-name {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  flex-shrink: 0;
}

.more-tasks {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  padding-left: var(--spacing-md);
}

.focus-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  margin-top: var(--spacing-sm);
}

.focus-action:hover {
  background: var(--color-primary-dark);
}

.week-view-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.week-days-row {
  display: flex;
  gap: var(--spacing-xs);
}

.week-day-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-xs);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: var(--color-background);
  min-width: 0;
}

.week-day-cell:hover {
  background: #f0f9f4;
}

.week-day-cell.today {
  background: var(--color-primary);
}

.week-day-cell.today .week-day-name,
.week-day-cell.today .week-day-number {
  color: white;
}

.week-day-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.week-day-number {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.task-dots {
  display: flex;
  gap: 3px;
  min-height: 8px;
  align-items: center;
}

.task-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border);
  transition: all 0.2s ease;
}

.task-dot.done {
  background: var(--color-primary);
}

.week-day-cell.today .task-dot {
  background: rgba(255, 255, 255, 0.4);
}

.week-day-cell.today .task-dot.done {
  background: white;
}

.progress-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.progress-cards {
  display: flex;
  gap: var(--spacing-sm);
}

.progress-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.progress-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.progress-icon.done {
  background: #e8f5e9;
  color: #2e7d32;
}

.progress-icon.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.progress-info {
  display: flex;
  flex-direction: column;
}

.progress-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.progress-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.completion-bar-wrap {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.completion-bar {
  height: 6px;
  background: var(--color-background);
  border-radius: 3px;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.completion-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
}

.habits-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.habits-row {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.habit-bubble {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--color-text-secondary);
}

.habit-bubble:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.habit-bubble.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.finance-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-md) var(--spacing-lg);
  text-decoration: none;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.finance-card:hover {
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.finance-card :deep(svg:first-child) {
  flex-shrink: 0;
}

.finance-card span {
  flex: 1;
}

.finance-card :deep(svg:last-child) {
  flex-shrink: 0;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quick-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 14px;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.quick-link:hover {
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.quick-link span {
  flex: 1;
}

.quick-link :deep(svg:last-child) {
  opacity: 0.4;
}

@media (max-width: 900px) {
  .dashboard-grid {
    flex-direction: column;
  }

  .col-side {
    width: 100%;
  }

  .progress-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .greeting-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .greeting-date {
    align-items: flex-start;
  }

  .greeting-text {
    font-size: 24px;
  }

  .habit-bubble {
    width: 42px;
    height: 42px;
  }
}
</style>
