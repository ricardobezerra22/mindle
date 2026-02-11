<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Vincular projeto</h2>
            <button class="close-btn" @click="close">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <div class="modal-body">
            <div class="search-field">
              <Icon name="lucide:search" size="16" />
              <input
                v-model="search"
                type="text"
                placeholder="Buscar projeto..."
                autofocus
              />
            </div>

            <div
              v-if="loading"
              class="loading-state"
            >
              <Icon name="lucide:loader-2" class="spinning" size="20" />
            </div>

            <div
              v-else-if="filteredProjects.length === 0"
              class="empty-state"
            >
              <p>{{ search ? 'Nenhum projeto encontrado.' : 'Todos os projetos já estão vinculados.' }}</p>
            </div>

            <div v-else class="project-list">
              <button
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-option"
                :disabled="linking === project.id"
                @click="handleLink(project.id)"
              >
                <div class="project-option-info">
                  <span
                    v-if="project.category"
                    class="cat-dot"
                    :style="{ backgroundColor: project.category.color }"
                  />
                  <span class="project-option-title">{{ project.title }}</span>
                </div>
                <Icon
                  v-if="linking === project.id"
                  name="lucide:loader-2"
                  class="spinning"
                  size="16"
                />
                <Icon
                  v-else
                  name="lucide:plus"
                  size="16"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  goalId: string;
  linkedProjectIds: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  linked: [];
}>();

const toast = useToast();
const { linkProject } = useGoals();

const search = ref("");
const loading = ref(false);
const linking = ref<string | null>(null);
const allProjects = ref<any[]>([]);

const fetchProjects = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/projects");
    if (response.success) {
      allProjects.value = response.data;
    }
  } catch {
    toast.error({ title: "Erro ao carregar projetos" });
  } finally {
    loading.value = false;
  }
};

const filteredProjects = computed(() => {
  const available = allProjects.value.filter(
    p => !props.linkedProjectIds.includes(p.id) && !p.archived,
  );

  if (!search.value.trim()) return available;

  const q = search.value.toLowerCase();
  return available.filter(p => p.title.toLowerCase().includes(q));
});

const handleLink = async (projectId: string) => {
  linking.value = projectId;
  try {
    const success = await linkProject(props.goalId, projectId);
    if (success) {
      toast.success({ title: "Projeto vinculado" });
      emit("linked");
    } else {
      toast.error({ title: "Erro ao vincular projeto" });
    }
  } finally {
    linking.value = null;
  }
};

const close = () => {
  emit("update:modelValue", false);
  search.value = "";
};

watch(() => props.modelValue, (open) => {
  if (open) fetchProjects();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.modal-container {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 420px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  transition: border-color 0.15s ease;
}

.search-field:focus-within {
  border-color: var(--color-primary);
}

.search-field input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary);
}

.search-field :deep(svg) {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: 14px;
}

.empty-state p {
  margin: 0;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
  text-align: left;
}

.project-option:hover:not(:disabled) {
  background: var(--color-background);
  color: var(--color-primary);
}

.project-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.project-option-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-option-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>
