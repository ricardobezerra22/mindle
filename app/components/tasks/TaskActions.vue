<template>
  <div class="task-actions-wrapper">
    <button
      v-if="isFavorite && !editMode"
      class="favorite-indicator"
      title="Remover prioridade"
      @click.stop="emit('toggleFavorite')"
    >
      <Icon name="lucide:star" />
    </button>

    <div class="task-actions">
      <button
        v-if="!isFavorite && !editMode"
        class="action-btn favorite-btn"
        title="Marcar prioridade"
        @click.stop="emit('toggleFavorite')"
      >
        <Icon name="lucide:star" />
      </button>
      <button
        v-if="!editMode"
        class="action-btn"
        title="Editar"
        @click.stop="emit('edit')"
      >
        <Icon name="lucide:pencil" />
      </button>
      <button
        v-if="editMode"
        class="action-btn save"
        title="Salvar"
        @click.stop="emit('save')"
      >
        <Icon name="lucide:check" />
      </button>
      <button
        v-if="editMode"
        class="action-btn cancel"
        title="Cancelar"
        @click.stop="emit('cancel')"
      >
        <Icon name="lucide:x" />
      </button>
      <button
        v-if="!editMode"
        class="action-btn delete"
        title="Excluir"
        @click.stop="emit('delete')"
      >
        <Icon name="lucide:trash-2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  editMode: boolean;
  isFavorite: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [];
  save: [];
  cancel: [];
  delete: [];
  toggleFavorite: [];
}>();
</script>

<style scoped>
.task-actions-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  flex-shrink: 0;
}

.task-actions {
  display: flex;
  gap: 2px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.action-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.action-btn.save {
  color: #10b981;
}

.action-btn.save:hover {
  background-color: #d1fae5;
  color: #065f46;
}

.action-btn.cancel {
  color: #f59e0b;
}

.action-btn.cancel:hover {
  background-color: #fef3c7;
  color: #92400e;
}

.action-btn.delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn :deep(svg) {
  width: 15px;
  height: 15px;
}

.favorite-indicator {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: #eab308;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.favorite-indicator :deep(svg) {
  width: 16px;
  height: 16px;
  fill: #eab308;
  filter: drop-shadow(0 1px 2px rgba(234, 179, 8, 0.3));
}

.favorite-indicator:hover {
  color: #ca8a04;
  transform: scale(1.15);
}

.action-btn.favorite-btn {
  color: #9ca3af;
}

.action-btn.favorite-btn:hover {
  color: #eab308;
  background-color: #fefce8;
}

@media (min-width: 768px) {
  .action-btn {
    width: 28px;
    height: 28px;
  }

  .action-btn :deep(svg) {
    width: 16px;
    height: 16px;
  }

  .favorite-indicator {
    width: 28px;
    height: 28px;
  }

  .favorite-indicator :deep(svg) {
    width: 18px;
    height: 18px;
  }
}
</style>
