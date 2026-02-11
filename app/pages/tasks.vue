<template>
  <div class="tasks-page">
    <div class="page-header">
      <div class="filters-section">
        <TasksTaskSearchBox v-model="searchQuery" />
        <TasksTaskDateFilter v-model="dateFilter" />
        <TasksTaskCategoryFilter
          v-model="categoryFilter"
          :categories="categories"
        />
        <TasksTaskPriorityFilter v-model="favoriteFilter" />
        <TasksTaskViewToggle
          v-model="viewMode"
          :has-expanded-items="expandedCategories.size > 0"
          @reset-view="resetView"
        />
      </div>

      <UiButton @click="openCreateModal">
        <Icon name="lucide:plus" />
        Nova Tarefa
      </UiButton>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      <p>Carregando tarefas...</p>
    </div>

    <template v-else>
      <div
        v-if="viewMode === 'kanban'"
        class="kanban-board"
      >
        <TasksTaskColumn
          title="Não Iniciado"
          status="NOT_STARTED"
          :task-count="tasksByStatus.NOT_STARTED.length"
          icon="lucide:circle"
          @drop="handleDrop"
        >
          <template
            v-for="group in statusCategoryGroups.NOT_STARTED"
            :key="group.id"
          >
            <div class="column-category-group">
              <button
                class="column-category-header"
                :style="{
                  borderLeftColor: group.color,
                  backgroundColor: group.color + '15',
                }"
                @click="toggleCategoryAccordion('NOT_STARTED_' + group.id)"
              >
                <Icon
                  :name="
                    expandedCategories.has('NOT_STARTED_' + group.id)
                      ? 'lucide:chevron-down'
                      : 'lucide:chevron-right'
                  "
                />
                <span
                  class="column-cat-dot"
                  :style="{ backgroundColor: group.color }"
                />
                <span class="column-cat-name">{{ group.name }}</span>
                <span class="column-cat-count">{{ group.tasks.length }}</span>
              </button>
              <div
                v-if="expandedCategories.has('NOT_STARTED_' + group.id)"
                class="column-category-tasks"
              >
                <TasksTaskItem
                  v-for="task in group.tasks"
                  :id="task.id"
                  :key="task.id"
                  :title="task.title"
                  :description="task.description"
                  :status="task.status"
                  :priority="task.priority"
                  :is-favorite="task.isFavorite"
                  :due-date="task.dueDate"
                  :category-id="task.categoryId"
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :available-categories="categories"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @complete="handleComplete"
                  @toggle-favorite="handleToggleFavorite"
                  @update-priority="handleUpdatePriority"
                  @update-category="handleUpdateCategory"
                  @update-status="handleUpdateStatus"
                  @drag-start="handleDragStart"
                  @drag-end="handleDragEnd"
                  @add-sub-task="handleAddSubTask"
                  @toggle-sub-task="handleToggleSubTask"
                />
              </div>
            </div>
          </template>
        </TasksTaskColumn>

        <TasksTaskColumn
          title="Em Progresso"
          status="IN_PROGRESS"
          :task-count="tasksByStatus.IN_PROGRESS.length"
          icon="lucide:loader"
          @drop="handleDrop"
        >
          <template
            v-for="group in statusCategoryGroups.IN_PROGRESS"
            :key="group.id"
          >
            <div class="column-category-group">
              <button
                class="column-category-header"
                :style="{
                  borderLeftColor: group.color,
                  backgroundColor: group.color + '15',
                }"
                @click="toggleCategoryAccordion('IN_PROGRESS_' + group.id)"
              >
                <Icon
                  :name="
                    expandedCategories.has('IN_PROGRESS_' + group.id)
                      ? 'lucide:chevron-down'
                      : 'lucide:chevron-right'
                  "
                />
                <span
                  class="column-cat-dot"
                  :style="{ backgroundColor: group.color }"
                />
                <span class="column-cat-name">{{ group.name }}</span>
                <span class="column-cat-count">{{ group.tasks.length }}</span>
              </button>
              <div
                v-if="expandedCategories.has('IN_PROGRESS_' + group.id)"
                class="column-category-tasks"
              >
                <TasksTaskItem
                  v-for="task in group.tasks"
                  :id="task.id"
                  :key="task.id"
                  :title="task.title"
                  :description="task.description"
                  :status="task.status"
                  :priority="task.priority"
                  :is-favorite="task.isFavorite"
                  :due-date="task.dueDate"
                  :category-id="task.categoryId"
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :available-categories="categories"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @complete="handleComplete"
                  @toggle-favorite="handleToggleFavorite"
                  @update-priority="handleUpdatePriority"
                  @update-category="handleUpdateCategory"
                  @update-status="handleUpdateStatus"
                  @drag-start="handleDragStart"
                  @drag-end="handleDragEnd"
                  @add-sub-task="handleAddSubTask"
                  @toggle-sub-task="handleToggleSubTask"
                />
              </div>
            </div>
          </template>
        </TasksTaskColumn>

        <TasksTaskColumn
          title="Concluído"
          status="DONE"
          :task-count="tasksByStatus.DONE.length"
          icon="lucide:check-circle-2"
          @drop="handleDrop"
        >
          <template
            v-for="group in statusCategoryGroups.DONE"
            :key="group.id"
          >
            <div class="column-category-group">
              <button
                class="column-category-header"
                :style="{
                  borderLeftColor: group.color,
                  backgroundColor: group.color + '15',
                }"
                @click="toggleCategoryAccordion('DONE_' + group.id)"
              >
                <Icon
                  :name="
                    expandedCategories.has('DONE_' + group.id)
                      ? 'lucide:chevron-down'
                      : 'lucide:chevron-right'
                  "
                />
                <span
                  class="column-cat-dot"
                  :style="{ backgroundColor: group.color }"
                />
                <span class="column-cat-name">{{ group.name }}</span>
                <span class="column-cat-count">{{ group.tasks.length }}</span>
              </button>
              <div
                v-if="expandedCategories.has('DONE_' + group.id)"
                class="column-category-tasks"
              >
                <TasksTaskItem
                  v-for="task in group.tasks"
                  :id="task.id"
                  :key="task.id"
                  :title="task.title"
                  :description="task.description"
                  :status="task.status"
                  :priority="task.priority"
                  :is-favorite="task.isFavorite"
                  :due-date="task.dueDate"
                  :category-id="task.categoryId"
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :available-categories="categories"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @toggle-favorite="handleToggleFavorite"
                  @update-priority="handleUpdatePriority"
                  @update-category="handleUpdateCategory"
                  @update-status="handleUpdateStatus"
                  @drag-start="handleDragStart"
                  @drag-end="handleDragEnd"
                  @add-sub-task="handleAddSubTask"
                  @toggle-sub-task="handleToggleSubTask"
                />
              </div>
            </div>
          </template>
        </TasksTaskColumn>
      </div>

      <div
        v-else
        class="category-tree-view"
      >
        <div
          v-for="group in tasksByCategory"
          :key="group.id"
          class="category-accordion"
        >
          <button
            class="category-accordion-header"
            :style="{
              borderLeftColor: group.color,
              backgroundColor: group.color + '10',
            }"
            @click="toggleCategoryAccordion(group.id)"
          >
            <div class="category-header-left">
              <Icon
                :name="
                  expandedCategories.has(group.id)
                    ? 'lucide:chevron-down'
                    : 'lucide:chevron-right'
                "
              />
              <span
                class="category-color-dot"
                :style="{ backgroundColor: group.color }"
              />
              <span class="category-header-name">{{ group.name }}</span>
              <span class="category-task-count">{{ group.tasks.length }}</span>
            </div>
          </button>

          <div
            v-if="expandedCategories.has(group.id)"
            class="category-accordion-body"
            :style="{ borderLeftColor: group.color }"
          >
            <TasksTaskItem
              v-for="task in group.tasks"
              :id="task.id"
              :key="task.id"
              :title="task.title"
              :description="task.description"
              :status="task.status"
              :priority="task.priority"
              :is-favorite="task.isFavorite"
              :due-date="task.dueDate"
              :category-id="task.categoryId"
              :category-name="task.category?.name"
              :category-color="task.category?.color"
              :available-categories="categories"
              :sub-tasks="task.subTasks"
              @edit="handleEdit"
              @delete="confirmDelete"
              @complete="handleComplete"
              @toggle-favorite="handleToggleFavorite"
              @update-priority="handleUpdatePriority"
              @update-category="handleUpdateCategory"
              @update-status="handleUpdateStatus"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @add-sub-task="handleAddSubTask"
              @toggle-sub-task="handleToggleSubTask"
            />
          </div>
        </div>

        <div
          v-if="uncategorizedTasks.length > 0"
          class="category-accordion"
        >
          <button
            class="category-accordion-header"
            :style="{
              borderLeftColor: '#94a3b8',
              backgroundColor: '#94a3b810',
            }"
            @click="toggleCategoryAccordion('uncategorized')"
          >
            <div class="category-header-left">
              <Icon
                :name="
                  expandedCategories.has('uncategorized')
                    ? 'lucide:chevron-down'
                    : 'lucide:chevron-right'
                "
              />
              <span
                class="category-color-dot"
                :style="{ backgroundColor: '#94a3b8' }"
              />
              <span class="category-header-name">Sem Categoria</span>
              <span class="category-task-count">{{
                uncategorizedTasks.length
              }}</span>
            </div>
          </button>

          <div
            v-if="expandedCategories.has('uncategorized')"
            class="category-accordion-body"
            :style="{ borderLeftColor: '#94a3b8' }"
          >
            <TasksTaskItem
              v-for="task in uncategorizedTasks"
              :id="task.id"
              :key="task.id"
              :title="task.title"
              :description="task.description"
              :status="task.status"
              :priority="task.priority"
              :is-favorite="task.isFavorite"
              :due-date="task.dueDate"
              :available-categories="categories"
              :sub-tasks="task.subTasks"
              @edit="handleEdit"
              @delete="confirmDelete"
              @complete="handleComplete"
              @toggle-favorite="handleToggleFavorite"
              @update-priority="handleUpdatePriority"
              @update-category="handleUpdateCategory"
              @update-status="handleUpdateStatus"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @add-sub-task="handleAddSubTask"
              @toggle-sub-task="handleToggleSubTask"
            />
          </div>
        </div>
      </div>
    </template>

    <TasksTaskCreateModal
      v-model="showCreateModal"
      @created="fetchTasks(); fetchCategories()"
    />

    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button
            class="close-btn"
            @click="showDeleteModal = false"
          >
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
            class="action-button"
            @click="showDeleteModal = false"
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
import { TaskStatus, Priority } from "~/types";
import type { Task, TaskCategory, Groups } from "~/types";

const {
  tasks,
  categories,
  loading,
  error,
  fetchTasks,
  fetchCategories,
  updateTask,
  updateTaskStatus,
  toggleFavorite,
  deleteTask,
  addSubTask,
  toggleSubTask,
} = useTasks();

const toast = useToast();
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const taskToDelete = ref<string | null>(null);
const draggedTaskId = ref<string | null>(null);
const viewMode = ref<"kanban" | "categories">("kanban");
const searchQuery = ref("");
const dateFilter = ref("");
const categoryFilter = ref("");
const favoriteFilter = ref(false);

const expandedCategories = ref(new Set<string>());

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)),
    );
  }

  if (dateFilter.value) {
    filtered = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
      return taskDate === dateFilter.value;
    });
  }

  if (categoryFilter.value) {
    filtered = filtered.filter((t) => t.categoryId === categoryFilter.value);
  }

  if (favoriteFilter.value) {
    filtered = filtered.filter((t) => t.isFavorite);
  }

  return filtered;
});

const tasksByStatus = computed(() => {
  return {
    NOT_STARTED: filteredTasks.value.filter(
      (t) => t.status === TaskStatus.NOT_STARTED,
    ),
    IN_PROGRESS: filteredTasks.value.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS,
    ),
    DONE: filteredTasks.value.filter((t) => t.status === TaskStatus.DONE),
  };
});

type CategoryGroup = { id: string; name: string; color: string; tasks: Task[] };

const groupByCategory = (taskList: Task[]): CategoryGroup[] => {
  const catMap = new Map<string, CategoryGroup>();
  const uncategorized: Task[] = [];

  for (const task of taskList) {
    if (task.categoryId && task.category) {
      const existing = catMap.get(task.categoryId);
      if (existing) {
        existing.tasks.push(task);
      } else {
        catMap.set(task.categoryId, {
          id: task.categoryId,
          name: task.category.name,
          color: task.category.color,
          tasks: [task],
        });
      }
    } else {
      uncategorized.push(task);
    }
  }

  const groups = Array.from(catMap.values());
  if (uncategorized.length > 0) {
    groups.push({
      id: "uncategorized",
      name: "Sem Categoria",
      color: "#94a3b8",
      tasks: uncategorized,
    });
  }
  return groups;
};

const statusCategoryGroups = computed(() => {
  return {
    NOT_STARTED: groupByCategory(tasksByStatus.value.NOT_STARTED),
    IN_PROGRESS: groupByCategory(tasksByStatus.value.IN_PROGRESS),
    DONE: groupByCategory(tasksByStatus.value.DONE),
  };
});

const tasksByCategory = computed(() => {
  const groups: Groups[] = [];
  for (const cat of categories.value) {
    const catTasks = filteredTasks.value.filter((t) => t.categoryId === cat.id);
    if (catTasks.length > 0) {
      groups.push({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        tasks: catTasks,
      });
    }
  }

  return groups;
});

const uncategorizedTasks = computed(() => {
  return filteredTasks.value.filter((t) => !t.categoryId);
});

const toggleCategoryAccordion = (id: string) => {
  const set = new Set(expandedCategories.value);
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  expandedCategories.value = set;
};

const expandAllCategories = () => {
  const set = new Set<string>();
  for (const status of ["NOT_STARTED", "IN_PROGRESS", "DONE"] as const) {
    for (const group of statusCategoryGroups.value[status]) {
      set.add(`${status}_${group.id}`);
    }
  }
  for (const group of tasksByCategory.value) {
    set.add(group.id);
  }
  if (uncategorizedTasks.value.length > 0) {
    set.add("uncategorized");
  }
  expandedCategories.value = set;
};

const resetView = () => {
  expandedCategories.value = new Set();
};

watch(favoriteFilter, (active) => {
  if (active) expandAllCategories();
});

const openCreateModal = () => {
  showCreateModal.value = true;
};

const handleEdit = async (
  id: string,
  data: { title: string; description?: string; dueDate?: Date },
) => {
  try {
    await updateTask(id, data);
  } catch (e) {
    toast.error({ title: "Erro ao atualizar tarefa" });
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
      toast.success({ title: "Tarefa excluída" });
    } catch (e) {
      toast.error({ title: "Erro ao excluir tarefa" });
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
  } catch {
    toast.error({ title: "Erro ao concluir tarefa" });
  }
};

const handleToggleFavorite = async (id: string) => {
  try {
    await toggleFavorite(id);
  } catch (e) {
    toast.error({ title: "Erro ao atualizar prioridade" });
  }
};

const handleUpdatePriority = async (id: string, priority: Priority) => {
  try {
    await updateTask(id, { priority });
    toast.success({ title: "Prioridade atualizada" });
  } catch {
    toast.error({ title: "Erro ao atualizar prioridade" });
  }
};

const handleUpdateCategory = async (id: string, categoryId: string | null) => {
  try {
    const category = categoryId
      ? categories.value.find((c) => c.id === categoryId) || undefined
      : undefined;
    await updateTask(id, {
      categoryId: categoryId ?? undefined,
      category,
    });
    toast.success({
      title: categoryId ? "Categoria atualizada" : "Categoria removida",
    });
  } catch {
    toast.error({ title: "Erro ao atualizar categoria" });
  }
};

const handleUpdateStatus = async (id: string, status: TaskStatus) => {
  try {
    await updateTaskStatus(id, status);
  } catch {
    toast.error({ title: "Erro ao atualizar status" });
  }
};

const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task && task.status !== newStatus) {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (e) {
      toast.error({ title: "Erro ao alterar status da tarefa" });
    }
  }
};

const handleAddSubTask = async (taskId: string, title: string) => {
  try {
    await addSubTask(taskId, title);
  } catch (e) {
    toast.error({ title: "Erro ao adicionar subtarefa" });
  }
};
function shouldMoveToInProgress(done: boolean, task?: Task): task is Task {
  if (!done) return false;
  if (!task) return false;

  return ![TaskStatus.DONE, TaskStatus.IN_PROGRESS].includes(task.status);
}

const handleToggleSubTask = async (subTaskId: string, done: boolean) => {
  const desiredTask = tasks.value.find((task) =>
    task.subTasks?.find((st) => st.id === subTaskId),
  );
  if (!desiredTask) return;

  const subTask = desiredTask.subTasks?.find((st) => st.id === subTaskId);
  if (!subTask) return;

  const previousDone = subTask.done;
  const previousStatus = desiredTask.status;

  subTask.done = done;
  if (shouldMoveToInProgress(done, desiredTask)) {
    desiredTask.status = TaskStatus.IN_PROGRESS;
  }

  try {
    await toggleSubTask(subTaskId, done);
    if (previousStatus !== desiredTask.status) {
      await updateTaskStatus(desiredTask.id, TaskStatus.IN_PROGRESS);
    }
  } catch {
    subTask.done = previousDone;
    desiredTask.status = previousStatus;
    toast.error({ title: "Erro ao atualizar subtarefa" });
  }
};

onMounted(() => {
  fetchTasks();
  fetchCategories();
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
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.filters-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs);
  align-items: stretch;
}

.filters-section > :first-child {
  grid-column: 1 / -1;
}


.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.kanban-board {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.column-category-group {
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.column-category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-left: 3px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.column-category-header:hover {
  filter: brightness(0.96);
}

.column-category-header :deep(svg) {
  width: 14px;
  height: 14px;
}

.column-cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.column-cat-name {
  flex: 1;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.column-cat-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background-color: var(--color-surface);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.column-category-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
}

.category-tree-view {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.category-accordion {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  height: min-content;
}

.category-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.category-accordion-header:hover {
  filter: brightness(0.97);
}

.category-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.category-header-left :deep(svg) {
  width: 16px;
  height: 16px;
}

.category-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-header-name {
  font-size: 14px;
  font-weight: 600;
}

.category-task-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background-color: var(--color-surface);
  border-radius: 11px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.category-accordion-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-left: 4px solid;
  background-color: var(--color-surface);
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
  max-width: 540px;
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

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .filters-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .filters-section > :first-child {
    grid-column: unset;
  }

}

@media (min-width: 1024px) {
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
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
</style>
