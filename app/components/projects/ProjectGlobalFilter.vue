<template>
  <div class="project-filter">
    <div class="filter-row">
      <div class="search-box">
        <Icon
          name="lucide:search"
          size="16"
        />
        <input
          v-model="searchInput"
          type="text"
          class="search-input"
          placeholder="Buscar projeto..."
        />
        <button
          v-if="searchInput"
          class="clear-search"
          @click="searchInput = ''"
        >
          <Icon name="lucide:x" size="14" />
        </button>
      </div>

      <div
        ref="categoryRef"
        class="category-select"
      >
        <button
          class="category-toggle"
          :class="{ active: showCategories }"
          @click="showCategories = !showCategories"
        >
          <span
            v-if="selectedCategory"
            class="selected-dot"
            :style="{ backgroundColor: selectedCategory.color }"
          />
          <Icon
            v-else
            name="lucide:tag"
            size="14"
          />
          <span class="category-label">
            {{ selectedCategory?.name || 'Categoria' }}
          </span>
          <Icon
            :name="showCategories ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            size="12"
          />
        </button>

        <Transition name="dropdown">
          <div
            v-if="showCategories"
            class="category-dropdown"
          >
            <button
              class="dropdown-option"
              :class="{ active: !modelValue.categoryId }"
              @click="selectCategory('')"
            >
              Todas
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="dropdown-option"
              :class="{ active: modelValue.categoryId === cat.id }"
              @click="selectCategory(cat.id)"
            >
              <span
                class="cat-dot"
                :style="{ backgroundColor: cat.color }"
              />
              {{ cat.name }}
            </button>
          </div>
        </Transition>
      </div>

      <Transition name="fade">
        <button
          v-if="hasActiveFilters"
          class="clear-btn"
          @click="clearAll"
        >
          <Icon name="lucide:filter-x" size="14" />
          Limpar
        </button>
      </Transition>
    </div>

    <Transition name="fade">
      <div
        v-if="hasActiveFilters"
        class="active-filters"
      >
        <span
          v-if="modelValue.search"
          class="filter-tag"
        >
          "{{ modelValue.search }}"
          <button @click="updateFilter({ search: '' })">
            <Icon name="lucide:x" size="10" />
          </button>
        </span>
        <span
          v-if="selectedCategory"
          class="filter-tag"
          :style="{ backgroundColor: `${selectedCategory.color}15`, color: selectedCategory.color }"
        >
          {{ selectedCategory.name }}
          <button @click="updateFilter({ categoryId: '' })">
            <Icon name="lucide:x" size="10" />
          </button>
        </span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { TaskCategory } from "~/types";

interface FilterState {
  search: string;
  categoryId: string;
}

interface Props {
  modelValue: FilterState;
  categories: TaskCategory[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: FilterState];
}>();

const showCategories = ref(false);
const categoryRef = ref<HTMLElement | null>(null);
const searchInput = ref(props.modelValue.search);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

useClickOutside(categoryRef, () => {
  showCategories.value = false;
});

const selectedCategory = computed(() => {
  if (!props.modelValue.categoryId) return null;
  return props.categories.find((c) => c.id === props.modelValue.categoryId) || null;
});

const hasActiveFilters = computed(() => {
  return !!(props.modelValue.search || props.modelValue.categoryId);
});

const updateFilter = (partial: Partial<FilterState>) => {
  emit("update:modelValue", { ...props.modelValue, ...partial });
};

const selectCategory = (categoryId: string) => {
  updateFilter({ categoryId });
  showCategories.value = false;
};

const clearAll = () => {
  searchInput.value = "";
  emit("update:modelValue", { search: "", categoryId: "" });
};

watch(searchInput, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateFilter({ search: val.trim() });
  }, 300);
});

watch(
  () => props.modelValue.search,
  (val) => {
    if (val !== searchInput.value) searchInput.value = val;
  },
);
</script>

<style scoped>
.project-filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: stretch;
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: all 0.2s ease;
  flex: 1;
  min-height: 40px;
  box-sizing: border-box;
}

.search-box:focus-within {
  border-color: var(--color-primary);
}

.search-box :deep(svg) {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--color-text-primary);
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.clear-search {
  padding: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.clear-search:hover {
  color: var(--color-text-primary);
}

.category-select {
  position: relative;
}

.category-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  min-height: 40px;
  box-sizing: border-box;
  white-space: nowrap;
}

.category-toggle:hover,
.category-toggle.active {
  border-color: var(--color-primary);
}

.selected-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-label {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 160px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 20;
  padding: 4px;
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  text-align: left;
  transition: background-color 0.15s ease;
}

.dropdown-option:hover {
  background: var(--color-background);
}

.dropdown-option.active {
  background: #E8F3ED;
  font-weight: 500;
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 40px;
  box-sizing: border-box;
}

.clear-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--color-background);
  border-radius: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.filter-tag button {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
  opacity: 0.7;
}

.filter-tag button:hover {
  opacity: 1;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .filter-row {
    flex-wrap: wrap;
  }

  .search-box {
    flex-basis: 100%;
  }

  .category-label {
    max-width: 80px;
  }
}
</style>
