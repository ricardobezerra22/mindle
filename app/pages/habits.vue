<template>
  <div class="habits-page">
    <div class="habits-container">
      <div class="check-in-section">
        <h2 class="section-title">Como você está hoje?</h2>
        <div class="mood-options">
          <button
            v-for="mood in moodOptions"
            :key="mood.value"
            @click="selectMood(mood.value)"
            :class="['mood-btn', { selected: todayMood === mood.value }]"
          >
            <Icon :name="mood.icon" />
            <span>{{ mood.label }}</span>
          </button>
        </div>
        <p v-if="todayMood" class="mood-feedback">Obrigado por compartilhar.</p>
      </div>

      <div class="habits-section">
        <div class="section-header">
          <h2 class="section-title">Hábitos</h2>
          <button @click="showAddModal = true" class="add-habit-btn">
            <Icon name="lucide:plus" size="16" />
            Adicionar
          </button>
        </div>

        <div v-if="loading" class="loading-state">
          <Icon name="lucide:loader-2" class="spinning" />
          <p>Carregando...</p>
        </div>

        <div v-else-if="habits.length === 0" class="empty-state">
          <Icon name="lucide:heart" />
          <p>Nenhum hábito ainda</p>
          <p class="empty-hint">Comece adicionando algo pequeno</p>
        </div>

        <div v-else class="habits-list">
          <div
            v-for="habit in habits"
            :key="habit.id"
            :class="['habit-card', { checked: isHabitCheckedToday(habit.id) }]"
          >
            <button
              @click="toggleHabit(habit.id)"
              class="habit-check"
            >
              <Icon
                :name="isHabitCheckedToday(habit.id) ? 'lucide:check-circle-2' : 'lucide:circle'"
              />
            </button>

            <div class="habit-content">
              <div class="habit-header">
                <Icon v-if="habit.icon" :name="habit.icon" class="habit-icon" />
                <h3 class="habit-title">{{ habit.title }}</h3>
              </div>
            </div>

            <button @click="openEditModal(habit)" class="habit-action">
              <Icon name="lucide:more-horizontal" size="18" />
            </button>
          </div>
        </div>

        <div v-if="showEncouragement" class="encouragement-message">
          <p>{{ encouragementText }}</p>
        </div>
      </div>

      <div class="insights-section">
        <button @click="showInsights = !showInsights" class="insights-toggle">
          <Icon :name="showInsights ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
          Insights
        </button>

        <div v-if="showInsights" class="insights-content">
          <div class="insight-card">
            <h4>Dias com check-in</h4>
            <p class="insight-value">{{ checkedInDays }} {{ checkedInDays === 1 ? 'dia' : 'dias' }}</p>
          </div>

          <div class="insight-card">
            <h4>Hábito mais frequente</h4>
            <p class="insight-value">{{ mostFrequentHabit || 'Nenhum ainda' }}</p>
          </div>
        </div>
      </div>

      <div class="wellbeing-section">
        <h2 class="section-title">Bem-estar</h2>
        
        <div class="breathing-tool">
          <button @click="toggleBreathing" class="breathing-btn">
            <div :class="['breathing-bubble', { active: isBreathing }]"></div>
            <span>{{ isBreathing ? 'Pausar' : 'Respirar' }}</span>
          </button>
          <p v-if="isBreathing" class="breathing-instruction">
            {{ breathingPhase }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="showAddModal || editingHabit" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingHabit ? 'Editar hábito' : 'Novo hábito' }}</h2>
          <button @click="closeModal" class="close-btn">
            <Icon name="lucide:x" />
          </button>
        </div>

        <form @submit.prevent="saveHabit" class="habit-form">
          <div class="form-group">
            <label for="title">Nome do hábito *</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="ex: Beber água"
              required
            />
          </div>

          <div class="form-group">
            <label>Ícone (opcional)</label>
            <div class="icon-picker">
              <button
                v-for="icon in iconOptions"
                :key="icon.value"
                type="button"
                @click="formData.icon = icon.value"
                :class="['icon-option', { selected: formData.icon === icon.value }]"
              >
                <Icon :name="icon.value" size="20" />
              </button>
            </div>
          </div>

          <div v-if="editingHabit" class="form-group">
            <button
              type="button"
              @click="deleteHabit"
              class="delete-btn"
            >
              <Icon name="lucide:trash-2" size="16" />
              Excluir hábito
            </button>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving" class="btn-primary">
              <Icon v-if="isSaving" name="lucide:loader-2" class="spinning" />
              {{ isSaving ? 'Salvando...' : editingHabit ? 'Atualizar' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showAddModal = ref(false);
const loading = ref(false);
const isSaving = ref(false);
const editingHabit = ref<any>(null);
const showInsights = ref(false);
const isBreathing = ref(false);
const breathingPhase = ref('Inspire...');
const showEncouragement = ref(false);
const encouragementText = ref('');

const formData = ref({
  title: '',
  icon: ''
});

const habits = ref<any[]>([]);
const habitLogs = ref<any[]>([]);
const todayMood = ref<string | null>(null);

const moodOptions = [
  { value: 'calm', label: 'Calmo', icon: 'lucide:smile' },
  { value: 'okay', label: 'Ok', icon: 'lucide:meh' },
  { value: 'tired', label: 'Cansado', icon: 'lucide:cloud' },
  { value: 'overwhelmed', label: 'Sobrecarregado', icon: 'lucide:frown' }
];

const iconOptions = [
  { value: 'lucide:droplet' },
  { value: 'lucide:dumbbell' },
  { value: 'lucide:book-open' },
  { value: 'lucide:moon' },
  { value: 'lucide:sun' },
  { value: 'lucide:heart' },
  { value: 'lucide:coffee' },
  { value: 'lucide:apple' },
  { value: 'lucide:bike' },
  { value: 'lucide:music' },
  { value: 'lucide:pen-tool' },
  { value: 'lucide:smile' }
];

const encouragementMessages = [
  'Bom trabalho por aparecer.',
  'Isso conta.',
  'Você está fazendo o suficiente.',
  'Pequenos passos importam.',
  'Você está presente. Isso é o que importa.'
];

const checkedInDays = computed(() => {
  const uniqueDates = new Set(
    habitLogs.value.map(log => new Date(log.date).toDateString())
  );
  return uniqueDates.size;
});

const mostFrequentHabit = computed(() => {
  if (habitLogs.value.length === 0) return null;
  
  const habitCounts: Record<string, number> = {};
  habitLogs.value.forEach(log => {
    if (log.done) {
      habitCounts[log.habitId] = (habitCounts[log.habitId] || 0) + 1;
    }
  });

  const maxCount = Math.max(...Object.values(habitCounts));
  const mostFrequentId = Object.keys(habitCounts).find(
    id => habitCounts[id] === maxCount
  );

  const habit = habits.value.find(h => h.id === mostFrequentId);
  return habit?.title || null;
});

const isHabitCheckedToday = (habitId: string) => {
  const today = new Date().toDateString();
  return habitLogs.value.some(
    log => log.habitId === habitId && 
           new Date(log.date).toDateString() === today &&
           log.done
  );
};

const fetchHabits = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/habits');
    if (response.success) {
      habits.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching habits:', error);
  } finally {
    loading.value = false;
  }
};

const fetchHabitLogs = async () => {
  try {
    const response = await $fetch('/api/habits/logs');
    if (response.success) {
      habitLogs.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching habit logs:', error);
  }
};

const fetchTodayMood = async () => {
  try {
    const response = await $fetch('/api/habits/mood-today');
    if (response.success && response.data) {
      todayMood.value = response.data.mood;
    }
  } catch (error) {
    console.error('Error fetching mood:', error);
  }
};

const selectMood = async (mood: string) => {
  todayMood.value = mood;
  try {
    await $fetch('/api/habits/mood', {
      method: 'POST',
      body: { mood }
    });
  } catch (error) {
    console.error('Error saving mood:', error);
  }
};

const toggleHabit = async (habitId: string) => {
  const isChecked = isHabitCheckedToday(habitId);
  const today = new Date().toISOString();

  try {
    if (isChecked) {
      const log = habitLogs.value.find(
        l => l.habitId === habitId && 
             new Date(l.date).toDateString() === new Date().toDateString()
      );
      if (log) {
        await $fetch(`/api/habits/log-${log.id}`, {
          method: 'DELETE'
        });
        habitLogs.value = habitLogs.value.filter(l => l.id !== log.id);
      }
    } else {
      const response = await $fetch('/api/habits/logs', {
        method: 'POST',
        body: {
          habitId,
          date: today,
          done: true
        }
      });
      if (response.success) {
        habitLogs.value.push(response.data);
        showEncouragementMessage();
      }
    }
  } catch (error) {
    console.error('Error toggling habit:', error);
  }
};

const showEncouragementMessage = () => {
  encouragementText.value = encouragementMessages[
    Math.floor(Math.random() * encouragementMessages.length)
  ];
  showEncouragement.value = true;
  setTimeout(() => {
    showEncouragement.value = false;
  }, 3000);
};

const saveHabit = async () => {
  isSaving.value = true;
  try {
    if (editingHabit.value) {
      const response = await $fetch(`/api/habits/${editingHabit.value.id}`, {
        method: 'PUT',
        body: formData.value
      });
      if (response.success) {
        const index = habits.value.findIndex(h => h.id === editingHabit.value.id);
        if (index !== -1) {
          habits.value[index] = response.data;
        }
      }
    } else {
      const response = await $fetch('/api/habits', {
        method: 'POST',
        body: formData.value
      });
      if (response.success) {
        habits.value.push(response.data);
      }
    }
    closeModal();
  } catch (error) {
    console.error('Error saving habit:', error);
  } finally {
    isSaving.value = false;
  }
};

const deleteHabit = async () => {
  if (!editingHabit.value) return;
  
  try {
    await $fetch(`/api/habits/${editingHabit.value.id}`, {
      method: 'DELETE'
    });
    habits.value = habits.value.filter(h => h.id !== editingHabit.value.id);
    closeModal();
  } catch (error) {
    console.error('Error deleting habit:', error);
  }
};

const openEditModal = (habit: any) => {
  editingHabit.value = habit;
  formData.value = {
    title: habit.title,
    icon: habit.icon || ''
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingHabit.value = null;
  formData.value = {
    title: '',
    icon: ''
  };
};

let breathingInterval: NodeJS.Timeout | null = null;

const toggleBreathing = () => {
  isBreathing.value = !isBreathing.value;
  
  if (isBreathing.value) {
    let phase = 0;
    const phases = ['Inspire...', 'Segure...', 'Expire...', 'Segure...'];
    breathingPhase.value = phases[0];
    
    breathingInterval = setInterval(() => {
      phase = (phase + 1) % phases.length;
      breathingPhase.value = phases[phase];
    }, 4000);
  } else {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
  }
};

onMounted(() => {
  fetchHabits();
  fetchHabitLogs();
  fetchTodayMood();
});

onUnmounted(() => {
  if (breathingInterval) {
    clearInterval(breathingInterval);
  }
});
</script>

<style scoped>
.habits-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.habits-container {
  max-width: 700px;
  margin: 0 auto;
}

.check-in-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.mood-btn {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.mood-btn :deep(svg) {
  width: 28px;
  height: 28px;
  color: var(--color-text-secondary);
}

.mood-btn span {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.mood-btn:hover {
  border-color: var(--color-primary);
}

.mood-btn.selected {
  border-color: var(--color-primary);
  background: #E8F3ED;
}

.mood-btn.selected :deep(svg),
.mood-btn.selected span {
  color: var(--color-primary-dark);
}

.mood-feedback {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  font-style: italic;
}

.habits-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.add-habit-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-habit-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.loading-state :deep(svg),
.empty-state :deep(svg) {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.empty-hint {
  font-size: 13px;
  margin-top: var(--spacing-xs);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.habit-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.2s ease;
}

.habit-card.checked {
  border-color: var(--color-primary);
  background: #F7FBF9;
}

.habit-check {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.habit-check :deep(svg) {
  width: 32px;
  height: 32px;
  color: var(--color-border);
  transition: all 0.2s ease;
}

.habit-card.checked .habit-check :deep(svg) {
  color: var(--color-primary);
}

.habit-content {
  flex: 1;
}

.habit-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.habit-icon {
  width: 20px;
  height: 20px;
  color: var(--color-text-secondary);
}

.habit-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.habit-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.habit-action:hover {
  background: #F0F4F3;
  color: var(--color-primary);
}

.encouragement-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: #E8F3ED;
  border-radius: 8px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.encouragement-message p {
  margin: 0;
  font-size: 14px;
  color: var(--color-primary-dark);
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.insights-section {
  margin-bottom: var(--spacing-xl);
}

.insights-toggle {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.insights-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.insights-content {
  margin-top: var(--spacing-md);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.insight-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
}

.insight-card h4 {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
}

.insight-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.wellbeing-section {
  margin-bottom: var(--spacing-xl);
}

.breathing-tool {
  text-align: center;
}

.breathing-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0 auto;
}

.breathing-bubble {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.3;
  transition: all 4s ease-in-out;
}

.breathing-bubble.active {
  animation: breathe 8s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  25% { transform: scale(1.5); opacity: 0.6; }
  50% { transform: scale(1); opacity: 0.3; }
  75% { transform: scale(1.5); opacity: 0.6; }
}

.breathing-btn span {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.breathing-instruction {
  margin-top: var(--spacing-md);
  font-size: 16px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(31, 45, 43, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-surface);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #F0F4F3;
  color: var(--color-text-primary);
}

.close-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.habit-form {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(111, 175, 142, 0.1);
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-sm);
}

.icon-option {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-option:hover {
  border-color: var(--color-primary);
}

.icon-option.selected {
  border-color: var(--color-primary);
  background: #E8F3ED;
}

.icon-option :deep(svg) {
  color: var(--color-text-secondary);
}

.icon-option.selected :deep(svg) {
  color: var(--color-primary);
}

.delete-btn {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid #FFE5E5;
  background: transparent;
  color: #D32F2F;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.delete-btn:hover {
  background: #FFE5E5;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-secondary:hover {
  background: #F0F4F3;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary :deep(svg) {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .habits-page {
    padding: var(--spacing-md);
  }

  .mood-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .icon-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
