<template>
  <div
    v-if="modelValue"
    class="dlg-overlay"
    @pointerdown.self="close"
  >
    <div
      ref="dialogRef"
      class="dlg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-dialog-title"
      @keydown="onDialogKeydown"
    >
      <form
        class="card"
        novalidate
        @submit.prevent="handleCreate"
      >
        <header class="dlg-head">
          <h2 id="task-dialog-title">
            {{ $t("taskForm.title") }}
          </h2>
          <button
            type="button"
            class="icon-btn"
            :aria-label="$t('taskForm.closeDialog')"
            :title="$t('taskForm.closeDialog')"
            @click="close"
          >
            <Icon name="lucide:x" />
          </button>
        </header>

        <div class="dlg-body">
          <div class="field">
            <label for="create-title">{{ $t("taskForm.titleLabel") }}</label>
            <input
              id="create-title"
              ref="titleRef"
              v-model="newTask.title"
              type="text"
              autocomplete="off"
              required
              :placeholder="$t('taskForm.titlePlaceholder')"
            />
          </div>

          <div class="field">
            <label for="create-description">{{
              $t("taskForm.descLabel")
            }}</label>
            <textarea
              id="create-description"
              v-model="newTask.description"
              rows="3"
              :placeholder="$t('taskForm.descPlaceholder')"
            />
          </div>

          <div class="row2">
            <div class="field">
              <label for="create-priority">{{
                $t("taskForm.priorityLabel")
              }}</label>
              <div class="control">
                <select
                  id="create-priority"
                  v-model="newTask.priority"
                >
                  <option value="LOW">
                    {{ $t("shared.priorities.low") }}
                  </option>
                  <option value="MEDIUM">
                    {{ $t("shared.priorities.medium") }}
                  </option>
                  <option value="HIGH">
                    {{ $t("shared.priorities.high") }}
                  </option>
                </select>
                <Icon
                  name="lucide:chevron-down"
                  class="chev"
                />
              </div>
            </div>

            <TasksDatePicker
              id="create-dueDate"
              v-model="newTask.dueDate"
              align="right"
              :label="$t('taskForm.dueDateLabel')"
              :placeholder="$t('taskForm.datePlaceholder')"
              :week-start="weekStart"
              @update:invalid="dueInvalid = $event"
            />
          </div>

          <div class="field">
            <label :for="selectedCategory ? undefined : 'create-category'">
              {{ $t("taskForm.categoryLabel") }}
              <span
                class="req"
                aria-hidden="true"
              >*</span>
            </label>
            <div :class="['control', { dotted: !!selectedCategory }]">
              <div
                v-if="selectedCategory"
                class="selected-cat"
              >
                <span
                  class="dot"
                  :style="{ '--dot': selectedCategory.color }"
                />
                <span class="selected-name">{{ selectedCategory.name }}</span>
                <button
                  type="button"
                  class="icon-btn small"
                  :aria-label="$t('taskForm.removeCategory')"
                  :title="$t('taskForm.removeCategory')"
                  @click="clearCategory"
                >
                  <Icon name="lucide:x" />
                </button>
              </div>
              <template v-else>
                <input
                  id="create-category"
                  ref="categoryInputRef"
                  v-model="categorySearch"
                  type="text"
                  autocomplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="create-category-list"
                  :aria-expanded="showCategoryDropdown"
                  :aria-activedescendant="
                    highlightedIndex >= 0
                      ? `create-category-o${highlightedIndex}`
                      : undefined
                  "
                  :placeholder="$t('taskForm.categoryPlaceholder')"
                  @focus="showCategoryDropdown = true"
                  @input="onCategoryInput"
                  @blur="onCategoryBlur"
                  @keydown="onCategoryKeydown"
                />
                <ul
                  v-if="showCategoryDropdown"
                  id="create-category-list"
                  class="combo-list"
                  role="listbox"
                  :aria-label="$t('taskForm.categoriesList')"
                >
                  <li
                    v-for="(cat, idx) in dropdownItems"
                    :id="`create-category-o${idx}`"
                    :key="cat.id"
                    role="option"
                    :aria-selected="idx === highlightedIndex"
                    :class="{ create: cat.id === '__create__' }"
                    @mousedown.prevent="onDropdownSelect(idx)"
                  >
                    <template v-if="cat.id === '__create__'">
                      <Icon name="lucide:plus-circle" />
                      <i18n-t
                        keypath="taskForm.createCategory"
                        tag="span"
                      >
                        <template #name>
                          <strong>{{ categorySearch.trim() }}</strong>
                        </template>
                      </i18n-t>
                    </template>
                    <template v-else>
                      <span
                        class="dot"
                        :style="{ '--dot': cat.color }"
                      />
                      <span>{{ cat.name }}</span>
                    </template>
                  </li>
                  <li
                    v-if="dropdownItems.length === 0 && !categorySearch.trim()"
                    class="empty"
                    role="presentation"
                  >
                    {{ $t("taskForm.newCategoryPlaceholder") }}
                  </li>
                </ul>
              </template>
            </div>
          </div>

          <div
            v-if="showNewCategoryForm && !selectedCategory"
            class="field"
          >
            <label for="create-category-color">{{
              $t("taskForm.newCategoryColor")
            }}</label>
            <div class="color-row">
              <input
                id="create-category-color"
                v-model="newCategoryColor"
                type="color"
                class="color-input"
                :disabled="creatingCategory"
              />
              <input
                v-model="newCategoryColor"
                type="text"
                placeholder="#6FAF8E"
                class="color-text"
                :aria-label="$t('taskForm.newCategoryColor')"
                :disabled="creatingCategory"
              />
              <button
                type="button"
                class="btn primary square"
                :aria-label="$t('shared.add')"
                :title="$t('shared.add')"
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

          <div class="field">
            <label for="create-subtask">{{
              $t("taskForm.subtasksLabel")
            }}</label>
            <div class="sub-add">
              <input
                id="create-subtask"
                v-model="newSubTaskInput"
                type="text"
                autocomplete="off"
                :placeholder="$t('taskForm.subtaskPlaceholder')"
                @keydown.enter.prevent="addSubTaskToForm"
              />
              <button
                type="button"
                class="btn square"
                :aria-label="$t('taskForm.addSubtask')"
                :title="$t('taskForm.addSubtask')"
                :disabled="!newSubTaskInput.trim()"
                @click="addSubTaskToForm"
              >
                <Icon name="lucide:plus" />
              </button>
            </div>
            <ul
              v-if="newTask.subTasks.length"
              class="sub-list"
              :aria-label="$t('taskForm.subtasksList')"
            >
              <li
                v-for="(st, idx) in newTask.subTasks"
                :key="idx"
              >
                <span>{{ st.title }}</span>
                <button
                  type="button"
                  class="icon-btn small"
                  :aria-label="
                    $t('taskForm.removeSubtask', { title: st.title })
                  "
                  :title="$t('taskForm.removeSubtask', { title: st.title })"
                  @click="removeSubTask(idx)"
                >
                  <Icon name="lucide:x" />
                </button>
              </li>
            </ul>
          </div>

          <template v-if="calendarConnected">
            <div class="switch-row">
              <span
                id="create-sync-label"
                class="lbl"
              >{{ $t("taskForm.syncToCalendar") }}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-labelledby="create-sync-label"
                :aria-checked="newTask.syncToCalendar"
                @click="newTask.syncToCalendar = !newTask.syncToCalendar"
              />
            </div>

            <div
              v-if="newTask.syncToCalendar"
              class="sync-fields"
            >
              <div class="field">
                <TasksDatePicker
                  id="create-scheduledAt"
                  v-model="newTask.scheduledAt"
                  with-time
                  :label="$t('taskForm.scheduledAt')"
                  :placeholder="$t('taskForm.dateTimePlaceholder')"
                  :week-start="weekStart"
                  :error="scheduledError"
                  @update:invalid="schedInvalid = $event"
                />
                <p class="hint">
                  {{ $t("taskForm.timeHint15Min") }}
                </p>
              </div>
              <div class="field">
                <label for="create-scheduledDuration">{{
                  $t("taskForm.scheduledDuration")
                }}</label>
                <input
                  id="create-scheduledDuration"
                  v-model.number="newTask.scheduledDuration"
                  type="number"
                  min="1"
                  inputmode="numeric"
                />
              </div>
            </div>
          </template>

          <div
            v-else
            class="connect-cta"
          >
            <Icon
              name="lucide:calendar"
              class="cta-icon"
            />
            <div class="cta-text">
              <span class="cta-title">{{
                $t("taskForm.calendarNotConnected")
              }}</span>
              <span class="hint">{{ $t("taskForm.calendarConnectHint") }}</span>
            </div>
            <button
              type="button"
              class="btn"
              @click="connectCalendar"
            >
              {{ $t("taskForm.calendarConnectCta") }}
            </button>
          </div>
        </div>

        <footer class="dlg-foot">
          <button
            type="button"
            class="btn"
            @click="close"
          >
            {{ $t("shared.cancel") }}
          </button>
          <button
            type="submit"
            class="btn primary"
            :disabled="!canSubmit"
          >
            <Icon
              v-if="isCreating"
              name="lucide:loader-2"
              class="spinning"
            />
            {{ $t("shared.create") }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskStatus, Priority } from "~/types";
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
  "created": [];
}>();

const { categories, fetchCategories, createTask, createCategory } = useTasks();
const { calendarConnected, connectCalendar } = useCalendar();
const { preferences } = usePreferences();
const toast = useToast();
const { t } = useI18n();

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
const dialogRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLInputElement | null>(null);
const dueInvalid = ref(false);
const schedInvalid = ref(false);
const scheduledError = ref("");
let previousFocus: HTMLElement | null = null;

const weekStart = computed<0 | 1>(() =>
  preferences.value.weekStart === "sunday" ? 0 : 1,
);

const newTask = ref({
  title: "",
  description: "",
  priority: Priority.MEDIUM,
  dueDate: "",
  subTasks: [] as { title: string }[],
  syncToCalendar: false,
  scheduledAt: "",
  scheduledDuration: 60,
});

const canSubmit = computed(
  () =>
    !!newTask.value.title.trim()
    && !!selectedCategory.value
    && !isCreating.value
    && !dueInvalid.value
    && !(newTask.value.syncToCalendar && schedInvalid.value),
);

const filteredCategories = computed(() => {
  if (!categorySearch.value.trim()) return categories.value;
  const q = categorySearch.value.toLowerCase();
  return categories.value.filter(c => c.name.toLowerCase().includes(q));
});

const exactCategoryMatch = computed(() => {
  const q = categorySearch.value.trim().toLowerCase();
  return categories.value.some(c => c.name.toLowerCase() === q);
});

const dropdownItems = computed(() => {
  const items: { id: string; name: string; color: string }[]
    = filteredCategories.value.map(c => ({
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
  if (e.key === "ArrowDown" && !showCategoryDropdown.value) {
    e.preventDefault();
    showCategoryDropdown.value = true;
    return;
  }
  if (!showCategoryDropdown.value || items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex.value = (highlightedIndex.value + 1) % items.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex.value
      = highlightedIndex.value <= 0
        ? items.length - 1
        : highlightedIndex.value - 1;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (highlightedIndex.value >= 0 && highlightedIndex.value < items.length) {
      onDropdownSelect(highlightedIndex.value);
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
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
    const cat = categories.value.find(c => c.id === item.id);
    if (cat) selectCategory(cat);
  }
};

const handleCreateCategory = async () => {
  const name = categorySearch.value.trim();
  if (!name || creatingCategory.value) return;

  const colorExists = categories.value.some(
    c => c.color.toUpperCase() === newCategoryColor.value.toUpperCase(),
  );
  if (colorExists) {
    toast.error({ title: t("taskForm.toasts.categoryColorExists") });
    return;
  }

  creatingCategory.value = true;
  try {
    const cat = await createCategory(name, newCategoryColor.value);
    if (cat) {
      toast.success({ title: t("taskForm.toasts.categoryCreated") });
      selectCategory(cat);
      showNewCategoryForm.value = false;
      newCategoryColor.value = "#6FAF8E";
    }
  } catch (e) {
    toast.error({
      title:
        (e instanceof Error && e.message) || t("taskForm.toasts.categoryError"),
    });
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

const removeSubTask = (idx: number) => {
  newTask.value.subTasks.splice(idx, 1);
};

const resetForm = () => {
  newTask.value = {
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    dueDate: props.defaultDate || "",
    subTasks: [],
    syncToCalendar: false,
    scheduledAt: "",
    scheduledDuration: 60,
  };
  selectedCategory.value = null;
  categorySearch.value = "";
  showCategoryDropdown.value = false;
  showNewCategoryForm.value = false;
  newCategoryColor.value = "#6FAF8E";
  newSubTaskInput.value = "";
  highlightedIndex.value = -1;
  creatingCategory.value = false;
  dueInvalid.value = false;
  schedInvalid.value = false;
  scheduledError.value = "";
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const FOCUSABLE
  = "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";

const onDialogKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  if (e.key !== "Tab") return;
  const nodes = Array.from(
    dialogRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
  ).filter(n => n.getClientRects().length > 0);
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
};

const handleCreate = async () => {
  if (!canSubmit.value) return;
  if (newTask.value.syncToCalendar && !newTask.value.scheduledAt) {
    scheduledError.value = t("taskForm.scheduledRequired");
    document.getElementById("create-scheduledAt")?.focus();
    return;
  }

  isCreating.value = true;
  try {
    const result = await createTask({
      title: newTask.value.title.trim(),
      description: newTask.value.description || undefined,
      priority: newTask.value.priority,
      dueDate: newTask.value.dueDate
        ? new Date(newTask.value.dueDate)
        : undefined,
      status: TaskStatus.NOT_STARTED,
      categoryId: selectedCategory.value?.id || undefined,
      subTasks:
        newTask.value.subTasks.length > 0 ? newTask.value.subTasks : undefined,
      syncToCalendar: newTask.value.syncToCalendar,
      scheduledAt:
        newTask.value.syncToCalendar && newTask.value.scheduledAt
          ? new Date(newTask.value.scheduledAt)
          : undefined,
      scheduledDuration: newTask.value.syncToCalendar
        ? newTask.value.scheduledDuration
        : undefined,
    });

    if (result) {
      toast.success({ title: t("taskForm.toasts.taskCreated") });
      emit("created");
    } else {
      toast.error({ title: t("taskForm.toasts.taskError") });
    }
  } catch {
    toast.error({ title: t("taskForm.toasts.taskError") });
  } finally {
    isCreating.value = false;
    close();
  }
};

watch(
  () => newTask.value.scheduledAt,
  () => {
    scheduledError.value = "";
  },
);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      fetchCategories();
      if (props.defaultDate) {
        newTask.value.dueDate = props.defaultDate;
      }
      previousFocus = document.activeElement as HTMLElement | null;
      nextTick(() => titleRef.value?.focus());
    } else {
      previousFocus?.focus?.();
      previousFocus = null;
    }
  },
);
</script>

<style scoped>
.dlg-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(8, 18, 15, 0.55);
}

.dlg {
  width: 100%;
  max-width: 560px;
  color: var(--color-text-primary);
}

.card {
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 16px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 18px 48px rgba(12, 32, 26, 0.22);
  animation: dlg-in 0.2s ease-out;
}

@keyframes dlg-in {
  from {
    opacity: 0;
    translate: 0 12px;
  }
}

.dlg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 16px 8px;
}

.dlg-head h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.dlg-body {
  display: grid;
  gap: 20px;
  align-content: start;
  min-height: 0;
  padding: 8px 16px 20px;
  overflow-y: auto;
}

.dlg-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--color-border);
}

.field {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.field > label,
.lbl {
  font-weight: 700;
}

.req {
  color: var(--color-danger);
}

.row2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.control {
  position: relative;
  display: flex;
  align-items: center;
}

.field input[type="text"],
.field input[type="number"],
.field textarea,
.field select {
  width: 100%;
  min-height: 44px;
  padding: 10px 15px;
  font: inherit;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.field textarea {
  min-height: 92px;
  resize: vertical;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--color-text-secondary);
}

.field input:hover,
.field textarea:hover,
.field select:hover {
  border-color: var(--color-border-strong);
}

.field input:focus-visible,
.field textarea:focus-visible,
.field select:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
  border-color: var(--color-accent);
}

.control select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 44px;
  cursor: pointer;
}

.chev {
  position: absolute;
  right: 14px;
  width: 20px;
  height: 20px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.hint {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  flex: none;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn.small {
  width: 36px;
  height: 36px;
}

.icon-btn:hover {
  background: var(--color-accent-soft);
}

.icon-btn:focus-visible,
.btn:focus-visible,
.switch:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.icon-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.btn {
  min-height: 44px;
  padding: 8px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.btn.primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.btn.primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.square {
  width: 44px;
  padding: 0;
  color: var(--color-text-secondary);
}

.btn.square.primary {
  color: var(--color-on-accent);
}

.btn.square:hover:not(:disabled) {
  color: var(--color-accent);
}

.btn.square.primary:hover:not(:disabled) {
  color: var(--color-on-accent);
}

.btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dot {
  width: 12px;
  height: 12px;
  flex: none;
  border-radius: 50%;
  background: var(--dot, var(--color-border-strong));
}

.dotted .selected-cat {
  padding-left: 15px;
}

.selected-cat {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 3px 2px 15px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.selected-name {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  font-weight: 700;
}

.combo-list {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 208px;
  margin: 0;
  padding: 6px;
  list-style: none;
  overflow-y: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 18px 48px rgba(12, 32, 26, 0.22);
}

.combo-list li {
  min-height: 40px;
  padding: 8px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.combo-list li:hover {
  background: var(--color-accent-soft);
}

.combo-list li[aria-selected="true"] {
  background: var(--color-accent-soft);
  font-weight: 700;
}

.combo-list li.create {
  color: var(--color-accent);
  font-weight: 700;
}

.combo-list li.create :deep(svg) {
  width: 18px;
  height: 18px;
}

.combo-list li.empty {
  color: var(--color-text-secondary);
  cursor: default;
}

.combo-list li.empty:hover {
  background: transparent;
}

.color-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  gap: 8px;
}

.color-input {
  width: 44px;
  height: 44px;
  padding: 2px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
}

.sub-add {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  gap: 8px;
}

.sub-list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sub-list li {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 4px 2px 12px;
  background: var(--color-muted-bg);
  border-radius: 10px;
}

.sub-list li span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px dashed var(--color-border-strong);
}

.switch {
  position: relative;
  flex: none;
  width: 56px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 99px;
  background: var(--color-border-strong);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.switch::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: translate 0.2s ease;
}

.switch[aria-checked="true"] {
  background: var(--color-accent);
}

.switch[aria-checked="true"]::after {
  translate: 24px 0;
}

.sync-fields {
  display: grid;
  gap: 20px;
}

.connect-cta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--color-muted-bg);
  border: 1px dashed var(--color-border-strong);
  border-radius: 12px;
}

.cta-icon {
  width: 24px;
  height: 24px;
  flex: none;
  color: var(--color-accent);
}

.cta-text {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}

.cta-title {
  font-weight: 700;
}

@media (min-width: 640px) {
  .dlg-overlay {
    align-items: center;
    padding: 16px;
  }

  .card {
    max-height: calc(100dvh - 32px);
    border-bottom: 1px solid var(--color-border);
    border-radius: 20px;
  }

  .dlg-head {
    padding: 16px 16px 8px 24px;
  }

  .dlg-body {
    padding: 8px 24px 20px;
  }

  .dlg-foot {
    padding: 16px 24px;
  }

  .row2 {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .spinning {
    animation: none;
  }

  .field input,
  .field textarea,
  .field select,
  .icon-btn,
  .btn,
  .switch,
  .switch::after {
    transition: none;
  }
}
</style>
