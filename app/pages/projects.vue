<template>
  <div class="projects-page">
    <div class="page-header">
      <div class="header-top">
        <div class="tab-toggle">
          <button
            :class="['tab-btn', { active: activeTab === 'active' }]"
            @click="activeTab = 'active'"
          >
            Ativos
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'archived' }]"
            @click="activeTab = 'archived'; fetchArchivedProjects()"
          >
            <Icon name="lucide:archive" size="14" />
            Arquivados
            <span
              v-if="archivedProjects.length > 0"
              class="tab-badge"
            >{{ archivedProjects.length }}</span>
          </button>
        </div>

        <div class="header-actions">
          <button
            v-if="activeTab === 'active'"
            class="expand-collapse-btn"
            @click="toggleAllExpanded"
          >
            <Icon
              :name="allExpanded ? 'lucide:minimize-2' : 'lucide:maximize-2'"
              size="16"
            />
            {{ allExpanded ? 'Recolher tudo' : 'Expandir tudo' }}
          </button>

          <button
            v-if="activeTab === 'active'"
            class="new-project-btn"
            @click="showCreateModal = true"
          >
            <Icon name="lucide:plus" size="16" />
            Novo Projeto
          </button>
        </div>
      </div>

      <ProjectsProjectGlobalFilter
        v-if="activeTab === 'active'"
        v-model="filters"
        :categories="categories"
      />

      <div
        v-if="activeTab === 'archived'"
        class="archive-controls"
      >
        <input
          v-model="archiveSearch"
          type="text"
          class="archive-search"
          placeholder="Buscar arquivados..."
        />
        <button
          class="archive-sort-btn"
          @click="archiveSortOrder = archiveSortOrder === 'desc' ? 'asc' : 'desc'"
        >
          <Icon :name="archiveSortOrder === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up'" size="14" />
          Data
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      <div class="skeleton-list">
        <div
          v-for="i in 3"
          :key="i"
          class="skeleton-card"
        >
          <div class="skeleton-header">
            <div class="skeleton-badge" />
            <div class="skeleton-title" />
          </div>
          <div class="skeleton-body">
            <div class="skeleton-line short" />
            <div class="skeleton-line" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="filteredProjects.length === 0"
      class="empty-state"
    >
      <Icon
        name="lucide:folder-open"
        size="48"
      />
      <h3 class="empty-title">
        {{ hasActiveFilters ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda' }}
      </h3>
      <p class="empty-text">
        {{ hasActiveFilters ? 'Tente ajustar os filtros.' : 'Crie seu primeiro projeto para começar a organizar.' }}
      </p>
      <button
        v-if="!hasActiveFilters"
        class="new-project-btn"
        @click="showCreateModal = true"
      >
        <Icon name="lucide:plus" size="16" />
        Criar projeto
      </button>
    </div>

    <template v-if="activeTab === 'active'">
      <TransitionGroup
        v-if="filteredProjects.length > 0"
        name="project-list"
        tag="div"
        class="projects-list"
      >
        <ProjectsProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @edit="openEditModal"
          @delete="confirmDelete"
          @update="handleUpdateProject"
          @add-topic="handleAddTopic"
          @delete-topic="handleDeleteTopic"
          @update-topic="handleUpdateTopic"
          @add-subtopic="handleAddSubtopic"
          @delete-subtopic="handleDeleteSubtopic"
          @update-subtopic="handleUpdateSubtopic"
          @add-task="(parentId: string, title: string, level: 'project' | 'topic' | 'subtopic') => handleAddTask(parentId, title, level)"
          @toggle-task="handleToggleTask"
          @delete-task="handleDeleteTask"
          @update-task="handleUpdateTask"
          @archive="confirmArchive"
        />
      </TransitionGroup>
    </template>

    <template v-if="activeTab === 'archived'">
      <div
        v-if="filteredArchivedProjects.length === 0"
        class="empty-state"
      >
        <Icon name="lucide:archive" size="48" />
        <h3 class="empty-title">Nenhum projeto arquivado</h3>
        <p class="empty-text">Projetos arquivados aparecerão aqui.</p>
      </div>

      <div
        v-else
        class="archived-list"
      >
        <div
          v-for="project in filteredArchivedProjects"
          :key="project.id"
          class="archived-card"
        >
          <div class="archived-card-info">
            <h3 class="archived-card-title">{{ project.title }}</h3>
            <p
              v-if="project.description"
              class="archived-card-desc"
            >{{ project.description }}</p>
            <span class="archived-card-date">
              Arquivado em {{ formatDate(project.archivedAt) }}
            </span>
          </div>
          <button
            class="restore-btn"
            title="Restaurar projeto"
            @click="handleRestore(project.id)"
          >
            <Icon name="lucide:archive-restore" size="16" />
            Restaurar
          </button>
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
          <h3>{{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}</h3>
          <button
            class="modal-close"
            @click="closeModal"
          >
            <Icon name="lucide:x" size="18" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nome do projeto</label>
            <input
              ref="projectNameInput"
              v-model="formTitle"
              type="text"
              class="form-input"
              placeholder="ex: Redesign do App"
              @keydown.enter="handleSubmitProject"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Descrição (opcional)</label>
            <textarea
              v-model="formDescription"
              class="form-textarea"
              placeholder="Breve descrição do projeto..."
              rows="3"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Categoria</label>
            <div class="category-chips">
              <button
                class="category-chip"
                :class="{ active: !formCategoryId }"
                @click="formCategoryId = ''"
              >
                Nenhuma
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="category-chip"
                :class="{ active: formCategoryId === cat.id }"
                :style="formCategoryId === cat.id ? { backgroundColor: `${cat.color}20`, color: cat.color, borderColor: `${cat.color}40` } : {}"
                @click="formCategoryId = cat.id"
              >
                <span
                  class="chip-dot"
                  :style="{ backgroundColor: cat.color }"
                />
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-cancel"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button
            class="btn-save"
            :disabled="!formTitle.trim()"
            @click="handleSubmitProject"
          >
            {{ editingProject ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h3>Excluir projeto?</h3>
        </div>
        <div class="modal-body">
          <p class="delete-warning">
            Isso excluirá todos os tópicos, subtópicos e tarefas vinculados. Essa ação não pode ser desfeita.
          </p>
        </div>
        <div class="modal-footer">
          <button
            class="btn-cancel"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            class="btn-delete"
            @click="handleDeleteProject"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showArchiveModal"
      class="modal-overlay"
      @click.self="showArchiveModal = false"
    >
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h3>Arquivar projeto?</h3>
        </div>
        <div class="modal-body">
          <p class="delete-warning">
            O projeto será movido para a aba de arquivados. Você pode restaurá-lo a qualquer momento.
          </p>
        </div>
        <div class="modal-footer">
          <button
            class="btn-cancel"
            @click="showArchiveModal = false"
          >
            Cancelar
          </button>
          <button
            class="btn-save"
            @click="handleArchiveProject"
          >
            Arquivar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, Topic, Subtopic } from "~/types";

const {
  projects,
  archivedProjects,
  loading,
  fetchProjects,
  fetchArchivedProjects,
  createProject,
  updateProject,
  deleteProject,
  archiveProject,
  restoreProject,
  createTopic,
  updateTopic,
  deleteTopic,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  createProjectTask,
  toggleProjectTask,
  deleteProjectTask,
} = useProjects();

const { categories, fetchCategories } = useTasks();
const toast = useToast();

const activeTab = ref<"active" | "archived">("active");
const filters = ref({ search: "", categoryId: "" });
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showArchiveModal = ref(false);
const editingProject = ref<Project | null>(null);
const deletingProjectId = ref<string | null>(null);
const archivingProjectId = ref<string | null>(null);
const allExpanded = ref(true);
const archiveSearch = ref("");
const archiveSortOrder = ref<"asc" | "desc">("desc");

const formTitle = ref("");
const formDescription = ref("");
const formCategoryId = ref("");
const projectNameInput = ref<HTMLInputElement | null>(null);

const hasActiveFilters = computed(() =>
  !!(filters.value.search || filters.value.categoryId),
);

const filteredProjects = computed(() => {
  let result = projects.value;

  if (filters.value.categoryId) {
    result = result.filter((p) => p.categoryId === filters.value.categoryId);
  }

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    result = result.filter((p) => {
      if (p.title.toLowerCase().includes(q)) return true;
      for (const topic of p.topics || []) {
        if (topic.title.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }

  return result;
});

const toggleAllExpanded = () => {
  allExpanded.value = !allExpanded.value;
  for (const project of projects.value) {
    for (const topic of project.topics || []) {
      topic.expanded = allExpanded.value;
      for (const sub of topic.subtopics || []) {
        sub.expanded = allExpanded.value;
      }
    }
  }
};

const openEditModal = (id: string) => {
  const project = projects.value.find((p) => p.id === id);
  if (!project) return;
  editingProject.value = project;
  formTitle.value = project.title;
  formDescription.value = project.description || "";
  formCategoryId.value = project.categoryId || "";
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProject.value = null;
  formTitle.value = "";
  formDescription.value = "";
  formCategoryId.value = "";
};

const handleSubmitProject = async () => {
  if (!formTitle.value.trim()) return;

  try {
    if (editingProject.value) {
      await updateProject(editingProject.value.id, {
        title: formTitle.value.trim(),
        description: formDescription.value.trim() || undefined,
        categoryId: formCategoryId.value || undefined,
      });
      toast.success({ title: "Projeto atualizado" });
    } else {
      await createProject({
        title: formTitle.value.trim(),
        description: formDescription.value.trim() || undefined,
        categoryId: formCategoryId.value || undefined,
      });
      toast.success({ title: "Projeto criado" });
    }
    closeModal();
  } catch {
    toast.error({ title: "Erro ao salvar projeto" });
  }
};

const confirmDelete = (id: string) => {
  deletingProjectId.value = id;
  showDeleteModal.value = true;
};

const handleDeleteProject = async () => {
  if (!deletingProjectId.value) return;
  try {
    await deleteProject(deletingProjectId.value);
    toast.success({ title: "Projeto excluído" });
  } catch {
    toast.error({ title: "Erro ao excluir projeto" });
  } finally {
    showDeleteModal.value = false;
    deletingProjectId.value = null;
  }
};

const confirmArchive = (id: string) => {
  archivingProjectId.value = id;
  showArchiveModal.value = true;
};

const handleArchiveProject = async () => {
  if (!archivingProjectId.value) return;
  try {
    await archiveProject(archivingProjectId.value);
    toast.success({ title: "Projeto arquivado" });
  } catch {
    toast.error({ title: "Erro ao arquivar projeto" });
  } finally {
    showArchiveModal.value = false;
    archivingProjectId.value = null;
  }
};

const handleRestore = async (id: string) => {
  try {
    await restoreProject(id);
    toast.success({ title: "Projeto restaurado" });
  } catch {
    toast.error({ title: "Erro ao restaurar projeto" });
  }
};

const filteredArchivedProjects = computed(() => {
  let result = archivedProjects.value;
  if (archiveSearch.value) {
    const q = archiveSearch.value.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q));
  }
  return [...result].sort((a, b) => {
    const dateA = new Date(a.archivedAt || a.updatedAt).getTime();
    const dateB = new Date(b.archivedAt || b.updatedAt).getTime();
    return archiveSortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
  });
});

const formatDate = (date?: Date | string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
  try {
    await updateProject(id, updates);
  } catch {
    toast.error({ title: "Erro ao atualizar projeto" });
  }
};

const handleAddTopic = async (projectId: string, title: string) => {
  try {
    await createTopic(projectId, title);
  } catch {
    toast.error({ title: "Erro ao criar tópico" });
  }
};

const handleDeleteTopic = async (id: string) => {
  try {
    await deleteTopic(id);
  } catch {
    toast.error({ title: "Erro ao excluir tópico" });
  }
};

const handleUpdateTopic = async (id: string, updates: Partial<Topic>) => {
  try {
    await updateTopic(id, updates);
  } catch {
    toast.error({ title: "Erro ao atualizar tópico" });
  }
};

const handleAddSubtopic = async (topicId: string, title: string) => {
  try {
    await createSubtopic(topicId, title);
  } catch {
    toast.error({ title: "Erro ao criar subtópico" });
  }
};

const handleDeleteSubtopic = async (id: string) => {
  try {
    await deleteSubtopic(id);
  } catch {
    toast.error({ title: "Erro ao excluir subtópico" });
  }
};

const handleUpdateSubtopic = async (id: string, updates: Partial<Subtopic>) => {
  try {
    await updateSubtopic(id, updates);
  } catch {
    toast.error({ title: "Erro ao atualizar subtópico" });
  }
};

const handleAddTask = async (parentId: string, title: string, level: "project" | "topic" | "subtopic" = "subtopic") => {
  try {
    await createProjectTask(parentId, title, level);
  } catch {
    toast.error({ title: "Erro ao criar tarefa" });
  }
};

const handleToggleTask = async (id: string, done: boolean) => {
  try {
    await toggleProjectTask(id, done);
  } catch {
    toast.error({ title: "Erro ao atualizar tarefa" });
  }
};

const handleDeleteTask = async (id: string) => {
  try {
    await deleteProjectTask(id);
  } catch {
    toast.error({ title: "Erro ao excluir tarefa" });
  }
};

const handleUpdateTask = async (id: string, title: string) => {
  try {
    await $fetch("/api/projects/project-tasks", {
      method: "PUT",
      body: { id, title },
    });
    for (const project of projects.value) {
      const pt = project.tasks?.find((t) => t.id === id);
      if (pt) { pt.title = title; return; }
      for (const topic of project.topics || []) {
        const tt = topic.tasks?.find((t) => t.id === id);
        if (tt) { tt.title = title; return; }
        for (const sub of topic.subtopics || []) {
          const st = sub.tasks?.find((t) => t.id === id);
          if (st) { st.title = title; return; }
        }
      }
    }
  } catch {
    toast.error({ title: "Erro ao atualizar tarefa" });
  }
};

watch(showCreateModal, (val) => {
  if (val) nextTick(() => projectNameInput.value?.focus());
});

watch(filters, () => {
  const stored = JSON.stringify(filters.value);
  localStorage.setItem("mindle-project-filters", stored);
}, { deep: true });

onMounted(() => {
  const saved = localStorage.getItem("mindle-project-filters");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      filters.value = { ...filters.value, ...parsed };
    } catch {}
  }
  fetchProjects();
  fetchCategories();
  fetchArchivedProjects();
});
</script>

<style scoped>
.projects-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.tab-toggle {
  display: flex;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--color-primary);
  color: white;
}

.tab-btn:hover:not(.active) {
  background: var(--color-background);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
}

.tab-btn:not(.active) .tab-badge {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.archive-controls {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.archive-search {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.archive-search:focus {
  border-color: var(--color-primary);
}

.archive-sort-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.archive-sort-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.archived-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.archived-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.archived-card:hover {
  opacity: 1;
}

.archived-card-info {
  flex: 1;
  min-width: 0;
}

.archived-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
}

.archived-card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archived-card-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.restore-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.restore-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #e8f3ed;
}

.expand-collapse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.expand-collapse-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.new-project-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.new-project-btn:hover {
  background: var(--color-primary-dark);
}

.loading-state {
  flex: 1;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.skeleton-header {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.skeleton-badge {
  width: 60px;
  height: 20px;
  background: var(--color-border);
  border-radius: 10px;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  flex: 1;
  height: 20px;
  background: var(--color-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.5s infinite;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-line {
  height: 14px;
  background: var(--color-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.empty-state :deep(svg) {
  opacity: 0.3;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.3s ease;
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: modalIn 0.2s ease;
}

.modal-small {
  max-width: 400px;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.modal-close {
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-text-primary);
  background: var(--color-background);
}

.modal-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-input,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
  outline: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.category-chip:hover {
  border-color: var(--color-primary);
}

.category-chip.active {
  background: #E8F3ED;
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  font-weight: 500;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.btn-cancel {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: var(--color-background);
}

.btn-save {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  background: #dc2626;
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-delete:hover {
  background: #b91c1c;
}

.delete-warning {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .header-actions {
    justify-content: space-between;
  }

  .modal-content {
    max-width: 100%;
    margin: 0 var(--spacing-sm);
  }
}
</style>
