<template>
  <div
    class="status-toggle-wrapper"
    ref="wrapperRef"
    @click.stop
  >
    <button
      :class="['status-toggle', `status-${statusClass}`]"
      :title="statusLabel"
      @click="toggleDropdown"
    >
      <Icon :name="statusIcon" />
    </button>
    <ul
      v-if="isOpen"
      class="dropdown-menu status-dropdown"
    >
      <li
        v-for="opt in statusOptions"
        :key="opt.value"
        :class="['dropdown-item', { 'is-active': status === opt.value }]"
        @click="handleSelect(opt.value)"
      >
        <Icon :name="opt.icon" />
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus } from "~/types";

interface Props {
  status: TaskStatus;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateStatus: [status: TaskStatus];
}>();

const { playDone } = useSound();
const toast = useToast();

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

useClickOutside(wrapperRef, () => {
  isOpen.value = false;
});

const statusOptions = [
  { value: "NOT_STARTED" as TaskStatus, label: "Não iniciada", icon: "lucide:circle" },
  { value: "IN_PROGRESS" as TaskStatus, label: "Em progresso", icon: "lucide:loader" },
  { value: "DONE" as TaskStatus, label: "Concluída", icon: "lucide:check-circle-2" },
];

const statusIcon = computed(() => {
  const icons: Record<string, string> = {
    NOT_STARTED: "lucide:circle",
    IN_PROGRESS: "lucide:loader",
    DONE: "lucide:check-circle-2",
  };
  return icons[props.status] || "lucide:circle";
});

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    NOT_STARTED: "Não iniciada",
    IN_PROGRESS: "Em progresso",
    DONE: "Concluída",
  };
  return labels[props.status] || props.status;
});

const statusClass = computed(() => props.status.toLowerCase().replace("_", "-"));

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (value: TaskStatus) => {
  if (value === props.status) {
    isOpen.value = false;
    return;
  }
  if (value === "DONE") {
    playDone();
    toast.success({ title: "Tarefa concluída", message: "Parabéns!" });
  }
  emit("updateStatus", value);
  isOpen.value = false;
};
</script>

<style scoped>
.status-toggle-wrapper {
  position: relative;
  flex-shrink: 0;
}

.status-toggle {
  width: 26px;
  height: 26px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  transition: all 0.2s ease;
  padding: 0;
}

.status-toggle :deep(svg) {
  width: 14px;
  height: 14px;
}

.status-toggle.status-not-started {
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.status-toggle.status-not-started:hover {
  border-color: var(--color-text-secondary);
}

.status-toggle.status-in-progress {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: #eff6ff;
}

.status-toggle.status-in-progress:hover {
  border-color: #2563eb;
}

.status-toggle.status-done {
  border-color: #10b981;
  color: white;
  background-color: #10b981;
}

.status-toggle.status-done:hover {
  border-color: #059669;
  background-color: #059669;
}

.status-dropdown {
  min-width: 160px;
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

.dropdown-item :deep(svg) {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .status-toggle {
    width: 28px;
    height: 28px;
  }
}
</style>
