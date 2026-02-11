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
            <h2 class="modal-title">{{ isEditing ? 'Editar meta' : 'Nova meta' }}</h2>
            <button class="close-btn" @click="close">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="field">
              <label for="goal-title">Título</label>
              <input
                id="goal-title"
                v-model="form.title"
                type="text"
                placeholder="Ex: Certificação Vue.js"
                autofocus
              />
            </div>

            <div class="field">
              <label for="goal-description">Descrição</label>
              <textarea
                id="goal-description"
                v-model="form.description"
                rows="2"
                placeholder="O que você quer alcançar?"
              />
            </div>

            <div class="field-row">
              <div class="field">
                <label for="goal-deadline">Prazo</label>
                <input
                  id="goal-deadline"
                  v-model="form.deadline"
                  type="date"
                />
              </div>

              <div class="field">
                <label for="goal-color">Cor</label>
                <div class="color-picker">
                  <button
                    v-for="c in colors"
                    :key="c"
                    type="button"
                    :class="['color-swatch', { selected: form.color === c }]"
                    :style="{ backgroundColor: c }"
                    @click="form.color = c"
                  />
                  <button
                    type="button"
                    :class="['color-swatch', 'no-color', { selected: !form.color }]"
                    @click="form.color = ''"
                  >
                    <Icon name="lucide:x" size="10" />
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="isEditing"
              class="field"
            >
              <label for="goal-status">Status</label>
              <select
                id="goal-status"
                v-model="form.status"
              >
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="AT_RISK">Em risco</option>
                <option value="DONE">Concluída</option>
              </select>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn-secondary"
                @click="close"
              >Cancelar</button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="!form.title.trim() || submitting"
              >
                <Icon
                  v-if="submitting"
                  name="lucide:loader-2"
                  class="spinning"
                  size="14"
                />
                {{ isEditing ? 'Salvar' : 'Criar meta' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { GoalWithProgress } from "~/types";

interface Props {
  modelValue: boolean;
  editGoal?: GoalWithProgress | null;
}

const props = withDefaults(defineProps<Props>(), {
  editGoal: null,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [goal: any];
  updated: [goal: any];
}>();

const { createGoal, updateGoal } = useGoals();
const toast = useToast();

const submitting = ref(false);

const colors = [
  "#6faf8e", "#5b9bd5", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
  "#6366f1", "#84cc16",
];

const isEditing = computed(() => !!props.editGoal);

const form = reactive({
  title: "",
  description: "",
  deadline: "",
  color: "",
  status: "IN_PROGRESS",
});

watch(() => props.modelValue, (open) => {
  if (open && props.editGoal) {
    form.title = props.editGoal.title;
    form.description = props.editGoal.description || "";
    form.deadline = props.editGoal.deadline
      ? new Date(props.editGoal.deadline).toISOString().split("T")[0]
      : "";
    form.color = props.editGoal.color || "";
    form.status = props.editGoal.status;
  } else if (open) {
    form.title = "";
    form.description = "";
    form.deadline = "";
    form.color = "";
    form.status = "IN_PROGRESS";
  }
});

const close = () => {
  emit("update:modelValue", false);
};

const handleSubmit = async () => {
  if (!form.title.trim() || submitting.value) return;

  submitting.value = true;
  try {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      deadline: form.deadline || undefined,
      color: form.color || undefined,
      status: form.status,
    };

    if (isEditing.value && props.editGoal) {
      const goal = await updateGoal(props.editGoal.id, payload);
      if (goal) {
        toast.success({ title: "Meta atualizada" });
        emit("updated", goal);
        close();
      } else {
        toast.error({ title: "Erro ao atualizar meta" });
      }
    } else {
      const goal = await createGoal(payload);
      if (goal) {
        toast.success({ title: "Meta criada" });
        emit("created", goal);
        close();
      } else {
        toast.error({ title: "Erro ao criar meta" });
      }
    }
  } finally {
    submitting.value = false;
  }
};
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
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 18px;
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
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.field input,
.field textarea,
.field select {
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.15s ease;
  font-family: inherit;
  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--color-primary);
}

.field-row {
  display: flex;
  gap: var(--spacing-md);
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.color-swatch.selected {
  border-color: var(--color-text-primary);
  transform: scale(1.15);
}

.color-swatch.no-color {
  background: var(--color-background);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
}

.btn-secondary {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 640px) {
  .field-row {
    flex-direction: column;
  }

  .modal-container {
    max-width: 100%;
  }
}
</style>
