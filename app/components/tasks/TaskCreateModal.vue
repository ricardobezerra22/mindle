<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click.self="close"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nova Tarefa</h2>
        <button
          class="close-btn"
          @click="close"
        >
          <Icon name="lucide:x" />
        </button>
      </div>

      <form
        class="task-form"
        @submit.prevent="handleCreate"
      >
        <div class="form-group">
          <label for="create-title">Título *</label>
          <input
            id="create-title"
            v-model="newTask.title"
            type="text"
            placeholder="Nome da tarefa"
            required
          />
        </div>

        <div class="form-group">
          <label for="create-description">Descrição</label>
          <textarea
            id="create-description"
            v-model="newTask.description"
            placeholder="Detalhes da tarefa"
            rows="3"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="create-priority">Prioridade</label>
            <select
              id="create-priority"
              v-model="newTask.priority"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          <div class="form-group">
            <label for="create-dueDate">Data de Entrega</label>
            <input
              id="create-dueDate"
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
                  <span>Criar "<strong>{{ categorySearch.trim() }}</strong>"</span>
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
            @click="close"
          >
            Cancelar
          </UiButton>
          <UiButton
            :loading="isCreating"
            type="submit"
            :disabled="!newTask.title || !selectedCategory"
          >
            Criar Tarefa
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus } from "~/types";
import type { TaskCategory } from "~/types";

interface Props {
  modelValue: boolean;
  defaultDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultDate: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [];
}>();

const { categories, fetchCategories, createTask, createCategory } = useTasks();
const toast = useToast();

const isCreating = ref(false);
const categorySearch = ref("");
const showCategoryDropdown = ref(false);
const showNewCategoryForm = ref(false);
const newCategoryColor = ref("#6FAF8E");
const selectedCategory = ref<TaskCategory | null>(null);
const newSubTaskInput = ref("");
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

const resetForm = () => {
  newTask.value = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: props.defaultDate || "",
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

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const handleCreate = async () => {
  isCreating.value = true;
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
      emit("created");
    } else {
      toast.error({ title: "Erro ao criar tarefa" });
    }
  } catch {
    toast.error({ title: "Erro ao criar tarefa" });
  } finally {
    isCreating.value = false;
    close();
  }
};

watch(() => props.modelValue, (open) => {
  if (open) {
    fetchCategories();
    if (props.defaultDate) {
      newTask.value.dueDate = props.defaultDate;
    }
  }
});
</script>

<style scoped>
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

.confirm-cat-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-cat-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 1s linear infinite;
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
</style>
