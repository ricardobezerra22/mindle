<template>
  <div class="sort-filter">
    <button
      class="sort-trigger"
      @click="isOpen = !isOpen"
    >
      <Icon name="lucide:arrow-up-down" />
      <span>{{ selectedLabel }}</span>
    </button>

    <div
      v-if="isOpen"
      class="sort-dropdown"
    >
      <button
        v-for="option in options"
        :key="option.value"
        :class="['sort-option', { active: modelValue === option.value }]"
        @click="select(option.value)"
      >
        <Icon :name="option.icon" />
        <span>{{ option.label }}</span>
        <Icon
          v-if="modelValue === option.value"
          name="lucide:check"
          class="check-icon"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type SortValue = "HIGHEST_PRIORITY" | "LOWEST_PRIORITY" | "";

interface Props {
  modelValue: SortValue;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: SortValue];
}>();

const isOpen = ref(false);

const options = [
  { value: "" as SortValue, label: "Padrão", icon: "lucide:list" },
  { value: "HIGHEST_PRIORITY" as SortValue, label: "Maior Prioridade", icon: "lucide:arrow-up" },
  { value: "LOWEST_PRIORITY" as SortValue, label: "Menor Prioridade", icon: "lucide:arrow-down" },
];

const selectedLabel = computed(() => {
  const found = options.find((o) => o.value === props.modelValue);
  return found?.label || "Ordenar";
});

const select = (value: SortValue) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".sort-filter")) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<style scoped>
.sort-filter {
  position: relative;
  width: 100%;
}

.sort-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.sort-trigger:hover {
  border-color: var(--color-text-secondary);
}

.sort-trigger :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sort-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 20;
  overflow: hidden;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: background 0.15s ease;
}

.sort-option:hover {
  background: var(--color-background);
}

.sort-option.active {
  color: var(--color-primary-dark);
  font-weight: 500;
}

.sort-option :deep(svg) {
  width: 14px;
  height: 14px;
}

.check-icon {
  margin-left: auto;
}
</style>
