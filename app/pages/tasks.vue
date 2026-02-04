<template>
  <div class="tasks-page">
    <div class="page-header">
      <UiButton @click="showCreateModal = true">
        <Icon name="lucide:plus" />
        Nova Tarefa
      </UiButton>
    </div>

    <div v-if="loading" class="loading-state">
      <p>Carregando tarefas...</p>
    </div>

    <div v-else class="kanban-board">
      <TasksTaskColumn
        title="Não Iniciado"
        status="NOT_STARTED"
        :task-count="tasksByStatus.NOT_STARTED.length"
        icon="lucide:circle"
      >
        <TasksTaskItem
          v-for="task in tasksByStatus.NOT_STARTED"
          :key="task.id"
          :id="task.id"
          :title="task.title"
          :description="task.description"
          :status="task.status"
          :priority="task.priority"
          :due-date="task.dueDate"
          @click="changeStatus(task.id, 'IN_PROGRESS')"
          @delete="handleDelete(task.id)"
        />
      </TasksTaskColumn>

      <TasksTaskColumn
        title="Em Progresso"
        status="IN_PROGRESS"
        :task-count="tasksByStatus.IN_PROGRESS.length"
        icon="lucide:circle-dot"
      >
        <TasksTaskItem
          v-for="task in tasksByStatus.IN_PROGRESS"
          :key="task.id"
          :id="task.id"
          :title="task.title"
          :description="task.description"
          :status="task.status"
          :priority="task.priority"
          :due-date="task.dueDate"
          @click="changeStatus(task.id, 'DONE')"
          @delete="handleDelete(task.id)"
        />
      </TasksTaskColumn>

      <TasksTaskColumn
        title="Concluído"
        status="DONE"
        :task-count="tasksByStatus.DONE.length"
        icon="lucide:check-circle"
      >
        <TasksTaskItem
          v-for="task in tasksByStatus.DONE"
          :key="task.id"
          :id="task.id"
          :title="task.title"
          :description="task.description"
          :status="task.status"
          :priority="task.priority"
          :due-date="task.dueDate"
          @click="changeStatus(task.id, 'NOT_STARTED')"
          @delete="handleDelete(task.id)"
        />
      </TasksTaskColumn>
    </div>

    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click.self="showCreateModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nova Tarefa</h2>
          <button @click="showCreateModal = false" class="close-btn">
            <Icon name="lucide:x" />
          </button>
        </div>

        <form @submit.prevent="handleCreate" class="task-form">
          <div class="form-group">
            <label for="title">Título *</label>
            <input
              id="title"
              v-model="newTask.title"
              type="text"
              placeholder="Nome da tarefa"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Descrição</label>
            <textarea
              id="description"
              v-model="newTask.description"
              placeholder="Detalhes da tarefa"
              rows="3"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Prioridade</label>
              <select id="priority" v-model="newTask.priority">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dueDate">Data de Entrega</label>
              <input id="dueDate" v-model="newTask.dueDate" type="date" />
            </div>
          </div>

          <div class="modal-actions">
            <UiButton
              type="button"
              variant="secondary"
              @click="showCreateModal = false"
            >
              Cancelar
            </UiButton>
            <UiButton type="submit" :disabled="!newTask.title">
              Criar Tarefa
            </UiButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus } from "~/types";
import type { Task } from "~/types";

const { tasks, loading, fetchTasks, createTask, updateTaskStatus, deleteTask } =
  useTasks();

const showCreateModal = ref(false);
const newTask = ref({
  title: "",
  description: "",
  priority: "MEDIUM" as const,
  dueDate: "",
});

const tasksByStatus = computed(() => {
  return {
    NOT_STARTED: tasks.value.filter((t) => t.status === TaskStatus.NOT_STARTED),
    IN_PROGRESS: tasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    DONE: tasks.value.filter((t) => t.status === TaskStatus.DONE),
  };
});

const handleCreate = async () => {
  await createTask({
    title: newTask.value.title,
    description: newTask.value.description || undefined,
    priority: newTask.value.priority,
    dueDate: newTask.value.dueDate
      ? new Date(newTask.value.dueDate)
      : undefined,
    status: TaskStatus.NOT_STARTED,
  });

  showCreateModal.value = false;
  newTask.value = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  };
};

const changeStatus = async (id: string, newStatus: TaskStatus) => {
  await updateTaskStatus(id, newStatus);
};

const handleDelete = async (id: string) => {
  if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
    await deleteTask(id);
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.tasks-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-lg);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  flex: 1;
  overflow-x: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.close-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.task-form {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 1024px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
