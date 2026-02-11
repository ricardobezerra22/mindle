<template>
  <div
    v-if="categories.length > 0"
    class="category-filter"
    ref="wrapperRef"
    @click="isOpen = !isOpen"
  >
    <span
      v-if="selectedCategory"
      class="filter-cat-dot"
      :style="{ backgroundColor: selectedCategory.color }"
    />
    <Icon
      v-else
      name="lucide:tag"
    />
    <span class="filter-label">
      {{ selectedCategory ? selectedCategory.name : "Todas categorias" }}
    </span>
    <Icon
      name="lucide:chevron-down"
      class="filter-chevron"
      :class="{ open: isOpen }"
    />

    <div
      v-if="isOpen"
      class="filter-dropdown"
      @click.stop
    >
      <div
        class="filter-option"
        :class="{ active: !modelValue }"
        @click="handleSelect('')"
      >
        <Icon name="lucide:layers" />
        <span>Todas categorias</span>
      </div>
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="filter-option"
        :class="{ active: modelValue === cat.id }"
        @click="handleSelect(cat.id)"
      >
        <span
          class="filter-cat-dot"
          :style="{ backgroundColor: cat.color }"
        />
        <span>{{ cat.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskCategory } from "~/types";

interface Props {
  modelValue: string;
  categories: TaskCategory[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

useClickOutside(wrapperRef, () => {
  isOpen.value = false;
});

const selectedCategory = computed(() => {
  if (!props.modelValue) return null;
  return props.categories.find((c) => c.id === props.modelValue) || null;
});

const handleSelect = (value: string) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};
</script>

<style scoped>
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
  cursor: pointer;
  min-height: 40px;
  box-sizing: border-box;
}

.category-filter :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.filter-label {
  flex: 1;
  font-size: 13px;
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

@media (min-width: 640px) {
  .category-filter {
    width: auto;
    padding: var(--spacing-xs) var(--spacing-md);
  }
}
</style>
