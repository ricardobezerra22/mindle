<template>
  <div class="goals-page">
    <div class="goals-container">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Metas</h1>
          <p class="page-subtitle">Sua visão estratégica de evolução</p>
        </div>
        <UiButton @click="showCreateModal = true">
          <Icon name="lucide:plus" size="16" />
          Nova Meta
        </UiButton>
      </div>

      <div class="filters-bar">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-pill', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
          <span
            v-if="filter.count > 0"
            class="filter-count"
          >{{ filter.count }}</span>
        </button>
      </div>

      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="skeleton-goals">
          <div
            v-for="i in 3"
            :key="i"
            class="skeleton-goal-card"
          >
            <div class="skeleton-goal-header">
              <UiSkeleton variant="circle" width="12px" height="12px" />
              <UiSkeleton height="16px" :width="['65%', '50%', '75%'][i - 1]" />
            </div>
            <UiSkeleton height="8px" width="100%" radius="4px" />
            <div class="skeleton-goal-footer">
              <UiSkeleton height="12px" width="80px" />
              <UiSkeleton height="12px" width="60px" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="filteredGoals.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <Icon name="lucide:target" size="40" />
        </div>
        <h2 class="empty-title">
          {{ activeFilter === 'all' ? 'Nenhuma meta criada' : 'Nenhuma meta neste filtro' }}
        </h2>
        <p class="empty-text">
          {{ activeFilter === 'all'
            ? 'Crie sua primeira meta para dar direção aos seus projetos.'
            : 'Tente outro filtro ou crie uma nova meta.'
          }}
        </p>
        <UiButton
          v-if="activeFilter === 'all'"
          @click="showCreateModal = true"
        >
          <Icon name="lucide:plus" size="16" />
          Criar primeira meta
        </UiButton>
      </div>

      <TransitionGroup
        v-else
        name="goals-list"
        tag="div"
        class="goals-grid"
      >
        <GoalsGoalCard
          v-for="goal in filteredGoals"
          :key="goal.id"
          :goal="goal"
        />
      </TransitionGroup>
    </div>

    <GoalsGoalCreateModal
      v-model="showCreateModal"
      @created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
const { goals, loading, activeGoals, completedGoals, atRiskGoals, fetchGoals } = useGoals();

const showCreateModal = ref(false);
const activeFilter = ref<"all" | "active" | "at_risk" | "done">("all");

const filters = computed(() => [
  { label: "Todas", value: "all" as const, count: goals.value.length },
  { label: "Em andamento", value: "active" as const, count: activeGoals.value.length },
  { label: "Em risco", value: "at_risk" as const, count: atRiskGoals.value.length },
  { label: "Concluídas", value: "done" as const, count: completedGoals.value.length },
]);

const filteredGoals = computed(() => {
  switch (activeFilter.value) {
    case "active": return activeGoals.value;
    case "at_risk": return atRiskGoals.value;
    case "done": return completedGoals.value;
    default: return goals.value;
  }
});

const handleCreated = () => {
  fetchGoals();
};

onMounted(() => {
  fetchGoals();
});
</script>

<style scoped>
.goals-page {
  padding: var(--spacing-lg) var(--spacing-xl);
  max-width: 960px;
  margin: 0 auto;
}

.goals-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.filters-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.filter-pill.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.filter-count {
  font-size: 11px;
  font-weight: 600;
  padding: 0 5px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.2);
  line-height: 1.6;
}

.filter-pill:not(.active) .filter-count {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.loading-state {
  padding: var(--spacing-md) 0;
}

.skeleton-goals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.skeleton-goal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton-goal-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.skeleton-goal-footer {
  display: flex;
  justify-content: space-between;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(111, 175, 142, 0.1);
  color: var(--color-primary);
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 340px;
  line-height: 1.5;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.goals-list-enter-active,
.goals-list-leave-active {
  transition: all 0.3s ease;
}

.goals-list-enter-from,
.goals-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .goals-page {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .page-header {
    flex-direction: column;
  }

  .page-title {
    font-size: 22px;
  }

  .goals-grid {
    grid-template-columns: 1fr;
  }

  .filters-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .filter-pill {
    white-space: nowrap;
  }
}
</style>
