<template>
  <div
    class="inline-dropdown"
    ref="wrapperRef"
    @click.stop
  >
    <span
      class="category-badge is-editable"
      :style="badgeStyle"
      @click="toggleDropdown"
    >
      {{ categoryName || 'Sem categoria' }}
      <Icon
        name="lucide:chevron-down"
        class="arrow-icon"
      />
    </span>
    <ul
      v-if="isOpen"
      class="dropdown-menu"
    >
      <li
        :class="['dropdown-item', { 'is-active': !categoryId }]"
        @click="handleSelect(null)"
      >
        Nenhuma
      </li>
      <li
        v-for="cat in categories"
        :key="cat.id"
        :class="['dropdown-item', { 'is-active': categoryId === cat.id }]"
        @click="handleSelect(cat)"
      >
        <span
          class="dropdown-dot"
          :style="{ backgroundColor: cat.color }"
        />
        {{ cat.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TaskCategory } from "~/types";

interface Props {
  categoryName?: string;
  categoryColor?: string;
  categoryId?: string;
  categories: TaskCategory[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateCategory: [categoryId: string | null];
}>();

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

useClickOutside(wrapperRef, () => {
  isOpen.value = false;
});

const badgeStyle = computed(() => {
  if (!props.categoryColor) return {};
  const color = props.categoryColor;
  return {
    backgroundColor: color.startsWith("rgba") ? color : `${color}20`,
    color: color.startsWith("rgba") ? undefined : color,
    borderColor: color.startsWith("rgba") ? "transparent" : `${color}40`,
  };
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (category: TaskCategory | null) => {
  emit("updateCategory", category?.id ?? null);
  isOpen.value = false;
};
</script>

<style scoped>
.inline-dropdown {
  position: relative;
  display: inline-block;
}

.category-badge {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.category-badge.is-editable {
  cursor: pointer;
  padding-right: 4px;
  transition: background-color 0.2s;
}

.category-badge.is-editable:hover {
  background-color: var(--color-border);
}

.arrow-icon {
  width: 10px !important;
  height: 10px !important;
  opacity: 0.7;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 4px 0;
  min-width: 140px;
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.15s;
}

.dropdown-item:hover {
  background-color: var(--color-background, #f3f4f6);
}

.dropdown-item.is-active {
  font-weight: 600;
  background-color: var(--color-background);
}

.dropdown-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .category-badge {
    font-size: 11px;
    padding: 2px 8px;
  }
}
</style>
