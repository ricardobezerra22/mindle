<template>
  <div class="goal-detail-page">
    <div
      v-if="loading"
      class="loading-state"
    >
      <Icon name="lucide:loader-2" class="spinning" size="24" />
      <p>Carregando meta...</p>
    </div>

    <div
      v-else-if="!goal"
      class="empty-state"
    >
      <Icon name="lucide:alert-circle" size="32" />
      <p>Meta não encontrada.</p>
      <NuxtLink to="/goals" class="back-link">
        <Icon name="lucide:arrow-left" size="14" />
        Voltar para metas
      </NuxtLink>
    </div>

    <div
      v-else
      class="detail-container"
    >
      <GoalsGoalHeader
        :goal="goal"
        @edit="showEditModal = true"
        @delete="handleDelete"
      />

      <div class="detail-grid">
        <div class="detail-main">
          <GoalsGoalProjectList
            :projects="goal.projects || []"
            @link-project="showLinkModal = true"
            @unlink-project="handleUnlink"
          />
        </div>

        <div class="detail-sidebar">
          <GoalsGoalContributionChart :projects="goal.projects || []" />
          <GoalsGoalInsights :goal="goal" />
        </div>
      </div>
    </div>

    <GoalsGoalCreateModal
      v-model="showEditModal"
      :edit-goal="goal"
      @updated="handleUpdated"
    />

    <GoalsGoalLinkProjectModal
      v-model="showLinkModal"
      :goal-id="goalId"
      :linked-project-ids="linkedProjectIds"
      @linked="handleLinked"
    />
  </div>
</template>

<script setup lang="ts">
import type { GoalWithProgress } from "~/types";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { fetchGoalById, deleteGoal, unlinkProject } = useGoals();

const goalId = computed(() => route.params.id as string);

const goal = ref<GoalWithProgress | null>(null);
const loading = ref(true);
const showEditModal = ref(false);
const showLinkModal = ref(false);

const linkedProjectIds = computed(() =>
  goal.value?.projects?.map(p => p.id) || [],
);

const loadGoal = async () => {
  loading.value = true;
  goal.value = await fetchGoalById(goalId.value);
  loading.value = false;
};

const handleUpdated = async () => {
  await loadGoal();
};

const handleDelete = async () => {
  if (!goal.value) return;

  const confirmed = window.confirm("Excluir esta meta? Os projetos vinculados não serão excluídos.");
  if (!confirmed) return;

  const success = await deleteGoal(goal.value.id);
  if (success) {
    toast.success({ title: "Meta excluída" });
    router.push("/goals");
  } else {
    toast.error({ title: "Erro ao excluir meta" });
  }
};

const handleUnlink = async (projectId: string) => {
  if (!goal.value) return;

  const success = await unlinkProject(goal.value.id, projectId);
  if (success) {
    toast.success({ title: "Projeto desvinculado" });
    await loadGoal();
  } else {
    toast.error({ title: "Erro ao desvincular projeto" });
  }
};

const handleLinked = async () => {
  showLinkModal.value = false;
  await loadGoal();
};

onMounted(() => {
  loadGoal();
});
</script>

<style scoped>
.goal-detail-page {
  padding: var(--spacing-lg) var(--spacing-xl);
  max-width: 1060px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 80px 0;
  color: var(--color-text-secondary);
}

.loading-state p {
  font-size: 14px;
  margin: 0;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: 80px 0;
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state p {
  font-size: 15px;
  margin: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--spacing-lg);
  align-items: start;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .goal-detail-page {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
