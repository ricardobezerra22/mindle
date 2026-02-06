<template>
  <div class="tasks-page">
    <div class="page-header">
      <div class="filters-section">
        <div class="search-box">
          <Icon name="lucide:search" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar tarefa por nome..."
            class="search-input"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="clear-search"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <div class="date-filter">
          <Icon name="lucide:calendar" />
          <input
            v-model="dateFilter"
            type="date"
            class="date-input"
            placeholder="Filtrar por data"
          />
          <button
            v-if="dateFilter"
            @click="dateFilter = ''"
            class="clear-date"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <div v-if="availableCategories.length > 0" class="category-filter">
          <Icon name="lucide:tag" />
          <select v-model="categoryFilter" class="category-select">
            <option value="">Todas categorias</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

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
        @drop="handleDrop"
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
          :category="task.category"
          :category-color="task.categoryColor"
          @edit="handleEdit"
          @delete="confirmDelete"
          @complete="handleComplete"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
        />
      </TasksTaskColumn>

      <TasksTaskColumn
        title="Em Progresso"
        status="IN_PROGRESS"
        :task-count="tasksByStatus.IN_PROGRESS.length"
        icon="lucide:loader"
        @drop="handleDrop"
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
          :category="task.category"
          :category-color="task.categoryColor"
          @edit="handleEdit"
          @delete="confirmDelete"
          @complete="handleComplete"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
        />
      </TasksTaskColumn>

      <TasksTaskColumn
        title="Concluído"
        status="DONE"
        :task-count="tasksByStatus.DONE.length"
        icon="lucide:check-circle-2"
        @drop="handleDrop"
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
          :category="task.category"
          :category-color="task.categoryColor"
          @edit="handleEdit"
          @delete="confirmDelete"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
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

          <div class="form-row">
            <div class="form-group">
              <label for="category">Categoria</label>
              <input
                id="category"
                v-model="newTask.category"
                type="text"
                placeholder="ex: Trabalho, Pessoal"
              />
            </div>

            <div class="form-group">
              <label for="categoryColor">Cor da categoria</label>
              <div class="color-picker-row">
                <input
                  id="categoryColor"
                  v-model="newTask.categoryColor"
                  type="color"
                  class="color-input"
                />
                <input
                  v-model="newTask.categoryColor"
                  type="text"
                  placeholder="#6FAF8E"
                  class="color-text-input"
                />
              </div>
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

    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button @click="showDeleteModal = false" class="close-btn">
            <Icon name="lucide:x" />
          </button>
        </div>

        <div class="modal-body">
          <div class="delete-icon">
            <Icon name="lucide:alert-triangle" />
          </div>
          <h3 class="delete-title">Excluir Tarefa</h3>
          <p class="delete-message">
            Tem certeza que deseja excluir esta tarefa?
          </p>
          <p class="delete-warning">Esta ação não pode ser desfeita.</p>
        </div>

        <div class="modal-actions delete-actions">
          <UiButton
            type="button"
            variant="secondary"
            @click="showDeleteModal = false"
            class="action-button"
          >
            Cancelar
          </UiButton>
          <UiButton
            type="button"
            class="delete-button action-button"
            @click="handleDelete"
          >
            <Icon name="lucide:trash-2" />
            Excluir
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus } from "~/types";
import type { Task } from "~/types";

const {
  tasks,
  loading,
  error,
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = useTasks();

const toast = useToast();

const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const taskToDelete = ref<string | null>(null);
const draggedTaskId = ref<string | null>(null);

const searchQuery = ref('');
const dateFilter = ref('');
const categoryFilter = ref('');

const newTask = ref({
  title: "",
  description: "",
  priority: "MEDIUM" as const,
  dueDate: "",
  category: "",
  categoryColor: "#6FAF8E",
});

const availableCategories = computed(() => {
  const cats = new Set<string>();
  tasks.value.forEach(t => {
    if (t.category) cats.add(t.category);
  });
  return Array.from(cats).sort();
});

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    );
  }

  if (dateFilter.value) {
    filtered = filtered.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDate === dateFilter.value;
    });
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(t => t.category === categoryFilter.value);
  }

  return filtered;
});

const tasksByStatus = computed(() => {
  return {
    NOT_STARTED: filteredTasks.value.filter((t) => t.status === TaskStatus.NOT_STARTED),
    IN_PROGRESS: filteredTasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    DONE: filteredTasks.value.filter((t) => t.status === TaskStatus.DONE),
  };
});

const handleCreate = async () => {
  try {
    const result = await createTask({
      title: newTask.value.title,
      description: newTask.value.description || undefined,
      priority: newTask.value.priority,
      dueDate: newTask.value.dueDate
        ? new Date(newTask.value.dueDate)
        : undefined,
      status: TaskStatus.NOT_STARTED,
      category: newTask.value.category || undefined,
      categoryColor: newTask.value.category ? newTask.value.categoryColor : undefined,
    });

    if (result) {
      toast.success("Tarefa criada");
    } else {
      toast.error("Erro ao criar tarefa");
    }
  } catch (e) {
    toast.error("Erro ao criar tarefa");
  } finally {
    showCreateModal.value = false;
    newTask.value = {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      category: "",
      categoryColor: "#6FAF8E",
    };
  }
};

const handleEdit = async (
  id: string,
  data: { title: string; description?: string; dueDate?: Date },
) => {
  try {
    await updateTask(id, data);
  } catch (e) {
    toast.error("Erro ao atualizar tarefa");
  }
};

const confirmDelete = (id: string) => {
  taskToDelete.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (taskToDelete.value) {
    try {
      await deleteTask(taskToDelete.value);
      showDeleteModal.value = false;
      toast.success("Tarefa excluída");
    } catch (e) {
      toast.error("Erro ao excluir tarefa");
    } finally {
      taskToDelete.value = null;
    }
  }
};

const handleDragStart = (id: string) => {
  draggedTaskId.value = id;
};

const handleDragEnd = () => {
  draggedTaskId.value = null;
};

const handleComplete = async (taskId: string) => {
  try {
    await updateTaskStatus(taskId, TaskStatus.DONE);
  } catch (e) {
    toast.error("Erro ao concluir tarefa");
  }
};

const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task && task.status !== newStatus) {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (e) {
      toast.error("Erro ao alterar status da tarefa");
    }
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
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.filters-section {
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
  flex-wrap: wrap;
}

.search-box,
.date-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-md);
  transition: all 0.2s ease;
  min-width: 250px;
}

.search-box:focus-within,
.date-filter:focus-within {
  border-color: var(--color-primary);
}

.search-box :deep(svg),
.date-filter :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.search-input,
.date-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  padding: var(--spacing-xs) 0;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.clear-search,
.clear-date {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.clear-search:hover,
.clear-date:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.clear-search :deep(svg),
.clear-date :deep(svg) {
  width: 14px;
  height: 14px;
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

.delete-modal {
  max-width: 440px;
}

.modal-body {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
}

.delete-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin: 0 auto var(--spacing-lg);
  background-color: #fee2e2;
  border-radius: 50%;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.delete-icon :deep(svg) {
  width: 36px;
  height: 36px;
  color: #dc2626;
}

.delete-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.delete-message {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.delete-warning {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.delete-actions {
  padding: var(--spacing-lg);
  margin-top: 0;
  padding-top: var(--spacing-lg);
}

.action-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.delete-button {
  background-color: #dc2626;
}

.delete-button:hover {
  background-color: #b91c1c;
}

.delete-button :deep(svg) {
  width: 16px;
  height: 16px;
}

@media (max-width: 1024px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}

:deep(.delete-button) {
  background-color: #dc2626 !important;
  color: white !important;
}

:deep(.delete-button:hover) {
  background-color: #b91c1c !important;
  color: white !important;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-md);
  transition: all 0.2s ease;
}

.category-filter:focus-within {
  border-color: var(--color-primary);
}

.category-filter :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.category-select {
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  padding: var(--spacing-xs) 0;
  cursor: pointer;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.color-input {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 2px;
  cursor: pointer;
  background: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-text-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: monospace;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  transition: border-color 0.2s ease;
}

.color-text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
