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
            class="clear-search"
            @click="searchQuery = ''"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <div class="date-filter">
          <input
            v-model="dateFilter"
            type="date"
            class="date-input"
            placeholder="Filtrar por data"
          />
          <!-- <Icon name="lucide:calendar" /> -->
          <button
            v-if="dateFilter"
            class="clear-date"
            @click="dateFilter = ''"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <div
          v-if="categories.length > 0"
          class="category-filter"
          @click="showFilterDropdown = !showFilterDropdown"
        >
          <span
            v-if="selectedFilterCategory"
            class="filter-cat-dot"
            :style="{ backgroundColor: selectedFilterCategory.color }"
          />
          <Icon
            v-else
            name="lucide:tag"
          />
          <span class="filter-label">
            {{
              selectedFilterCategory
                ? selectedFilterCategory.name
                : "Todas categorias"
            }}
          </span>
          <Icon
            name="lucide:chevron-down"
            class="filter-chevron"
            :class="{ open: showFilterDropdown }"
          />

          <div
            v-if="showFilterDropdown"
            class="filter-dropdown"
            @click.stop
          >
            <div
              class="filter-option"
              :class="{ active: categoryFilter === '' }"
              @click="
                categoryFilter = '';
                showFilterDropdown = false;
              "
            >
              <Icon name="lucide:layers" />
              <span>Todas categorias</span>
            </div>
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="filter-option"
              :class="{ active: categoryFilter === cat.id }"
              @click="
                categoryFilter = cat.id;
                showFilterDropdown = false;
              "
            >
              <span
                class="filter-cat-dot"
                :style="{ backgroundColor: cat.color }"
              />
              <span>{{ cat.name }}</span>
            </div>
          </div>
        </div>

        <label class="priority-filter">
          <input
            v-model="favoriteFilter"
            type="checkbox"
            class="priority-checkbox"
          />
          <Icon name="lucide:star" />
          <span>Prioridade</span>
        </label>

        <div class="view-toggle">
          <button
            :class="['toggle-btn', { active: viewMode === 'kanban' }]"
            title="Kanban"
            @click="viewMode = 'kanban'"
          >
            <Icon name="lucide:columns-3" />
          </button>
          <button
            :class="['toggle-btn', { active: viewMode === 'categories' }]"
            title="Por Categoria"
            @click="viewMode = 'categories'"
          >
            <Icon name="lucide:folder-tree" />
          </button>
        </div>
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
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @complete="handleComplete"
                  @toggle-favorite="handleToggleFavorite"
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
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @complete="handleComplete"
                  @toggle-favorite="handleToggleFavorite"
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
                  :category-name="task.category?.name"
                  :category-color="task.category?.color"
                  :sub-tasks="task.subTasks"
                  @edit="handleEdit"
                  @delete="confirmDelete"
                  @toggle-favorite="handleToggleFavorite"
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
              :category-name="task.category?.name"
              :category-color="task.category?.color"
              :sub-tasks="task.subTasks"
              @edit="handleEdit"
              @delete="confirmDelete"
              @complete="handleComplete"
              @toggle-favorite="handleToggleFavorite"
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
              :sub-tasks="task.subTasks"
              @edit="handleEdit"
              @delete="confirmDelete"
              @complete="handleComplete"
              @toggle-favorite="handleToggleFavorite"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @add-sub-task="handleAddSubTask"
              @toggle-sub-task="handleToggleSubTask"
            />
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click.self="showCreateModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nova Tarefa</h2>
          <button
            class="close-btn"
            @click="showCreateModal = false"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <form
          class="task-form"
          @submit.prevent="handleCreate"
        >
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
              <select
                id="priority"
                v-model="newTask.priority"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dueDate">Data de Entrega</label>
              <input
                id="dueDate"
                v-model="newTask.dueDate"
                type="date"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Categoria</label>
            <div class="category-selector">
              <div class="category-input-wrapper">
                <input
                  v-if="!selectedCategory"
                  ref="categoryInputRef"
                  v-model="categorySearch"
                  type="text"
                  placeholder="Selecione ou crie uma categoria..."
                  class="category-search-input"
                  @focus="showCategoryDropdown = true"
                  @input="onCategoryInput"
                  @blur="onCategoryBlur"
                  @keydown="onCategoryKeydown"
                />
                <span
                  v-if="selectedCategory"
                  class="selected-category-badge"
                  :style="{
                    backgroundColor: selectedCategory.color + '20',
                    color: selectedCategory.color,
                    borderColor: selectedCategory.color + '40',
                  }"
                >
                  <span
                    class="cat-dot"
                    :style="{ backgroundColor: selectedCategory.color }"
                  />
                  {{ selectedCategory.name }}
                  <button
                    type="button"
                    class="remove-cat-btn"
                    @click="clearCategory"
                  >
                    <Icon name="lucide:x" />
                  </button>
                </span>
              </div>

              <div
                v-if="showCategoryDropdown && !selectedCategory"
                class="category-dropdown"
              >
                <div
                  v-for="(cat, idx) in dropdownItems"
                  :key="cat.id"
                  :class="[
                    'category-option',
                    {
                      active: idx === highlightedIndex,
                      'create-new': cat.id === '__create__',
                    },
                  ]"
                  @mousedown.prevent="onDropdownSelect(idx)"
                >
                  <template v-if="cat.id === '__create__'">
                    <Icon name="lucide:plus-circle" />
                    <span
                      >Criar "<strong>{{ categorySearch.trim() }}</strong
                      >"</span
                    >
                  </template>
                  <template v-else>
                    <span
                      class="cat-dot"
                      :style="{ backgroundColor: cat.color }"
                    />
                    {{ cat.name }}
                  </template>
                </div>

                <div
                  v-if="dropdownItems.length === 0 && !categorySearch.trim()"
                  class="category-empty"
                >
                  <Icon name="lucide:info" />
                  <span>Digite para criar uma nova categoria</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="showNewCategoryForm && !selectedCategory"
            class="form-group new-category-form"
          >
            <label>Cor da nova categoria</label>
            <div class="color-picker-row">
              <input
                v-model="newCategoryColor"
                type="color"
                class="color-input"
                :disabled="creatingCategory"
              />
              <input
                v-model="newCategoryColor"
                type="text"
                placeholder="#6FAF8E"
                class="color-text-input"
                :disabled="creatingCategory"
              />
              <button
                type="button"
                class="confirm-cat-btn"
                :disabled="creatingCategory"
                @click="handleCreateCategory"
              >
                <Icon
                  :name="creatingCategory ? 'lucide:loader-2' : 'lucide:check'"
                  :class="{ spinning: creatingCategory }"
                />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Subtarefas</label>
            <div class="subtasks-form-list">
              <div
                v-for="(st, idx) in newTask.subTasks"
                :key="idx"
                class="subtask-form-item"
              >
                <span class="subtask-form-bullet">{{ idx + 1 }}.</span>
                <span class="subtask-form-title">{{ st.title }}</span>
                <button
                  type="button"
                  class="subtask-remove-btn"
                  @click="newTask.subTasks.splice(idx, 1)"
                >
                  <Icon name="lucide:x" />
                </button>
              </div>
            </div>
            <div class="subtask-add-row">
              <input
                v-model="newSubTaskInput"
                type="text"
                placeholder="Adicionar subtarefa..."
                class="subtask-add-input"
                @keyup.enter="addSubTaskToForm"
              />
              <button
                type="button"
                class="subtask-add-btn"
                :disabled="!newSubTaskInput.trim()"
                @click="addSubTaskToForm"
              >
                <Icon name="lucide:plus" />
              </button>
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
            <UiButton
              :loading="loading"
              type="submit"
              :disabled="!newTask.title || !selectedCategory"
            >
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
import { TaskStatus } from "~/types";
import type { Task, TaskCategory, Groups } from "~/types";

const {
  tasks,
  categories,
  loading,
  error,
  fetchTasks,
  fetchCategories,
  createCategory,
  createTask,
  updateTask,
  updateTaskStatus,
  toggleFavorite,
  deleteTask,
  addSubTask,
  toggleSubTask,
} = useTasks();

const toast = useToast();
const inputDate = useTemplateRef("inputDate");
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const taskToDelete = ref<string | null>(null);
const draggedTaskId = ref<string | null>(null);
const viewMode = ref<"kanban" | "categories">("kanban");
const searchQuery = ref("");
const dateFilter = ref("");
const categoryFilter = ref("");
const favoriteFilter = ref(false);
const showFilterDropdown = ref(false);

const selectedFilterCategory = computed(() => {
  if (!categoryFilter.value) return null;
  return categories.value.find((c) => c.id === categoryFilter.value) || null;
});

const categorySearch = ref("");
const showCategoryDropdown = ref(false);
const showNewCategoryForm = ref(false);
const newCategoryColor = ref("#6FAF8E");
const selectedCategory = ref<TaskCategory | null>(null);
const newSubTaskInput = ref("");
const expandedCategories = ref(new Set<string>());
const highlightedIndex = ref(-1);
const creatingCategory = ref(false);
const categoryInputRef = ref<HTMLInputElement | null>(null);

const newTask = ref({
  title: "",
  description: "",
  priority: "MEDIUM" as const,
  dueDate: "",
  subTasks: [] as { title: string }[],
});

const filteredCategories = computed(() => {
  if (!categorySearch.value.trim()) return categories.value;
  const q = categorySearch.value.toLowerCase();
  return categories.value.filter((c) => c.name.toLowerCase().includes(q));
});

const exactCategoryMatch = computed(() => {
  const q = categorySearch.value.trim().toLowerCase();
  return categories.value.some((c) => c.name.toLowerCase() === q);
});

const dropdownItems = computed(() => {
  const items: { id: string; name: string; color: string }[] =
    filteredCategories.value.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
    }));
  if (categorySearch.value.trim() && !exactCategoryMatch.value) {
    items.push({
      id: "__create__",
      name: categorySearch.value.trim(),
      color: "",
    });
  }
  return items;
});

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

const selectCategory = (category: TaskCategory) => {
  selectedCategory.value = category;
  categorySearch.value = "";
  showCategoryDropdown.value = false;
  showNewCategoryForm.value = false;
  highlightedIndex.value = -1;
};

const clearCategory = () => {
  selectedCategory.value = null;
  categorySearch.value = "";
  nextTick(() => categoryInputRef.value?.focus());
};

const onCategoryInput = () => {
  showCategoryDropdown.value = true;
  highlightedIndex.value = -1;
  showNewCategoryForm.value = false;
};

const onCategoryBlur = () => {
  setTimeout(() => {
    showCategoryDropdown.value = false;
    highlightedIndex.value = -1;
  }, 150);
};

const onCategoryKeydown = (e: KeyboardEvent) => {
  const items = dropdownItems.value;
  if (!showCategoryDropdown.value || items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex.value = (highlightedIndex.value + 1) % items.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex.value =
      highlightedIndex.value <= 0
        ? items.length - 1
        : highlightedIndex.value - 1;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (highlightedIndex.value >= 0 && highlightedIndex.value < items.length) {
      onDropdownSelect(highlightedIndex.value);
    }
  } else if (e.key === "Escape") {
    showCategoryDropdown.value = false;
    highlightedIndex.value = -1;
  }
};

const onDropdownSelect = (idx: number) => {
  const item = dropdownItems.value[idx];
  if (!item) return;
  if (item.id === "__create__") {
    showNewCategoryForm.value = true;
    showCategoryDropdown.value = false;
    highlightedIndex.value = -1;
  } else {
    const cat = categories.value.find((c) => c.id === item.id);
    if (cat) selectCategory(cat);
  }
};

const handleCreateCategory = async () => {
  const name = categorySearch.value.trim();
  if (!name || creatingCategory.value) return;

  const colorExists = categories.value.some(
    (c) => c.color.toUpperCase() === newCategoryColor.value.toUpperCase(),
  );
  if (colorExists) {
    toast.error({ title: "Já existe uma categoria com essa cor" });
    return;
  }

  creatingCategory.value = true;
  try {
    const cat = await createCategory(name, newCategoryColor.value);
    if (cat) {
      toast.success({ title: "Categoria criada com sucesso" });
      selectCategory(cat);
      showNewCategoryForm.value = false;
      newCategoryColor.value = "#6FAF8E";
    }
  } catch (e: any) {
    toast.error({ title: e.message || "Erro ao criar categoria" });
  } finally {
    creatingCategory.value = false;
  }
};

const addSubTaskToForm = () => {
  const title = newSubTaskInput.value.trim();
  if (!title) return;
  newTask.value.subTasks.push({ title });
  newSubTaskInput.value = "";
};

const openCreateModal = () => {
  showCreateModal.value = true;
  fetchCategories();
};

const resetForm = () => {
  newTask.value = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    subTasks: [],
  };
  selectedCategory.value = null;
  categorySearch.value = "";
  showCategoryDropdown.value = false;
  showNewCategoryForm.value = false;
  newCategoryColor.value = "#6FAF8E";
  newSubTaskInput.value = "";
  highlightedIndex.value = -1;
  creatingCategory.value = false;
};

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
      categoryId: selectedCategory.value?.id || undefined,
      subTasks:
        newTask.value.subTasks.length > 0 ? newTask.value.subTasks : undefined,
    });

    if (result) {
      toast.success({ title: "Tarefa Criada" });
    } else {
      toast.error({ title: "Erro ao criar tarefa" });
    }
  } catch (e) {
    toast.error({ title: "Erro ao criar tarefa" });
  } finally {
    showCreateModal.value = false;
    resetForm();
  }
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
  } catch (e) {
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

const handleToggleSubTask = async (subTaskId: string, done: boolean) => {
  console.log("subtaskID", subTaskId);
  console.log("done", done);
  try {
    await toggleSubTask(subTaskId, done);
  } catch (e) {
    toast.error({ title: "Erro ao atualizar subtarefa" });
  }
};

const closeFilterDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".category-filter")) {
    showFilterDropdown.value = false;
  }
};

onMounted(() => {
  fetchTasks();
  fetchCategories();
  document.addEventListener("click", closeFilterDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeFilterDropdown);
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.search-box,
.date-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: all 0.2s ease;
  width: 100%;
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
  display: flex;
  align-items: center;
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
  min-width: 0;
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

.category-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: all 0.2s ease;
  position: relative;
  width: 100%;
}

.category-filter :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.filter-label {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.filter-cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.filter-chevron {
  transition: transform 0.2s ease;
}

.filter-chevron.open {
  transform: rotate(180deg);
}

.filter-chevron :deep(svg) {
  width: 14px;
  height: 14px;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease;
}

.filter-option:hover {
  background-color: var(--color-background);
}

.filter-option.active {
  background-color: var(--color-primary);
  color: white;
}

.filter-option.active :deep(svg) {
  color: white;
}

.filter-option :deep(svg) {
  width: 15px;
  height: 15px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.priority-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  width: 100%;
}

.priority-filter:hover {
  border-color: var(--color-text-secondary);
}

.priority-filter:has(.priority-checkbox:checked) {
  border-color: #eab308;
  background: #fefce8;
  color: #a16207;
}

.priority-filter :deep(svg) {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.priority-filter:has(.priority-checkbox:checked) :deep(svg) {
  color: #eab308;
}

.priority-checkbox {
  display: none;
}

.view-toggle {
  display: flex;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  @media (max-width: 768px) {
    justify-content: space-between;
  }
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  @media (max-width: 768px) {
    width: 50%;
  }
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
}

.toggle-btn:hover:not(.active) {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.toggle-btn :deep(svg) {
  width: 18px;
  height: 18px;
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.category-accordion {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
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

.category-selector {
  position: relative;
}

.category-input-wrapper {
  position: relative;
}

.category-search-input {
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

.category-search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.selected-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid;
  margin-top: var(--spacing-xs);
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.remove-cat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  padding: 0;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.remove-cat-btn:hover {
  opacity: 1;
}

.remove-cat-btn :deep(svg) {
  width: 12px;
  height: 12px;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease;
}

.category-option:hover,
.category-option.active {
  background-color: var(--color-background);
}

.category-option.active {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

.confirm-cat-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.category-option.create-new {
  color: var(--color-primary);
  border-top: 1px solid var(--color-border);
  font-weight: 500;
}

.category-option.create-new :deep(svg) {
  width: 16px;
  height: 16px;
}

.category-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.category-empty :deep(svg) {
  width: 14px;
  height: 14px;
}

.new-category-form {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--color-primary);
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

.confirm-cat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.confirm-cat-btn:hover {
  opacity: 0.9;
}

.confirm-cat-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.subtasks-form-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
}

.subtask-form-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--color-background);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.subtask-form-bullet {
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 12px;
  min-width: 18px;
}

.subtask-form-title {
  flex: 1;
  color: var(--color-text-primary);
}

.subtask-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 50%;
  padding: 0;
  transition: all 0.2s ease;
}

.subtask-remove-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.subtask-remove-btn :deep(svg) {
  width: 14px;
  height: 14px;
}

.subtask-add-row {
  display: flex;
  gap: var(--spacing-xs);
}

.subtask-add-input {
  flex: 1;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-primary);
  background: transparent;
  transition: border-color 0.2s ease;
}

.subtask-add-input:focus {
  outline: none;
  border-color: var(--color-primary);
  border-style: solid;
}

.subtask-add-input::placeholder {
  color: var(--color-text-secondary);
}

.subtask-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.subtask-add-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.subtask-add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.subtask-add-btn :deep(svg) {
  width: 16px;
  height: 16px;
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

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .filters-section {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    flex: 1;
  }

  .search-box,
  .date-filter {
    width: auto;
    min-width: 200px;
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .category-filter {
    width: auto;
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .priority-filter {
    width: auto;
    padding: var(--spacing-xs) var(--spacing-md);
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
