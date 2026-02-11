<template>
  <div
    class="inline-dropdown"
    ref="wrapperRef"
    @click.stop
  >
    <span
      :class="['task-priority', 'is-editable', `priority-${priority.toLowerCase()}`]"
      @click="toggleDropdown"
    >
      {{ priorityLabel }}
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
        v-for="opt in priorityOptions"
        :key="opt.value"
        :class="['dropdown-item', { 'is-active': priority === opt.value }]"
        @click="handleSelect(opt.value)"
      >
        <span
          class="dropdown-dot"
          :style="{ backgroundColor: opt.dotColor }"
        />
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Priority } from "~/types";

interface Props {
  priority: Priority;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updatePriority: [priority: Priority];
}>();

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

useClickOutside(wrapperRef, () => {
  isOpen.value = false;
});

const priorityOptions = [
  { value: "HIGH" as Priority, label: "Alta", dotColor: "#991b1b" },
  { value: "MEDIUM" as Priority, label: "Média", dotColor: "#92400e" },
  { value: "LOW" as Priority, label: "Baixa", dotColor: "#065f46" },
];

const priorityLabel = computed(() => {
  const labels: Record<string, string> = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };
  return labels[props.priority] || props.priority;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (value: Priority) => {
  if (value !== props.priority) {
    emit("updatePriority", value);
  }
  isOpen.value = false;
};
</script>

<style scoped>
.inline-dropdown {
  position: relative;
  display: inline-block;
}

.task-priority {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-priority.is-editable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.task-priority.is-editable:hover {
  opacity: 0.75;
}

.task-priority.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.task-priority.priority-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.task-priority.priority-low {
  background-color: #d1fae5;
  color: #065f46;
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
  .task-priority {
    font-size: 11px;
    padding: 2px 8px;
  }
}
</style>
