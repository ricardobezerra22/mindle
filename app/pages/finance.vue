<template>
  <div class="finance-page">
    <div class="finance-container">
      <div class="overview-section">
        <h1 class="page-title">Finanças</h1>
        <div class="monthly-summary">
          <p class="summary-text">
            {{ pendingCount }} {{ pendingCount === 1 ? 'item pendente' : 'itens pendentes' }} · 
            {{ paidCount }} {{ paidCount === 1 ? 'pago' : 'pagos' }}
          </p>
          <p v-if="totalAmount > 0" class="total-amount">
            Total: {{ formatCurrency(totalAmount) }}
          </p>
        </div>
      </div>

      <div class="filter-section">
        <button 
          @click="showArchived = false" 
          :class="['filter-btn', { active: !showArchived }]"
        >
          Ativos
        </button>
        <button 
          @click="showArchived = true" 
          :class="['filter-btn', { active: showArchived }]"
        >
          Arquivados
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <Icon name="lucide:loader-2" class="spinning" />
        <p>Carregando...</p>
      </div>

      <div v-else-if="filteredEntries.length === 0" class="empty-state">
        <Icon name="lucide:inbox" />
        <p>{{ showArchived ? 'Nenhum item arquivado' : 'Nenhum item financeiro ainda' }}</p>
      </div>

      <div v-else class="entries-list">
        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          :class="['entry-card', `status-${entry.status.toLowerCase()}`]"
        >
          <div class="entry-header">
            <h3 class="entry-title">{{ entry.title }}</h3>
            <span v-if="entry.category" class="entry-category">{{ entry.category }}</span>
          </div>

          <div class="entry-details">
            <div class="entry-info">
              <span v-if="entry.dueDate" class="entry-date">
                <Icon name="lucide:calendar" />
                {{ formatDate(entry.dueDate) }}
              </span>
              <span class="entry-amount">{{ formatCurrency(entry.amount) }}</span>
            </div>
            
            <div class="entry-status">
              <span :class="['status-badge', `status-${entry.status.toLowerCase()}`]">
                {{ getStatusLabel(entry.status) }}
              </span>
            </div>
          </div>

          <p v-if="entry.note" class="entry-note">{{ entry.note }}</p>

          <div class="entry-actions">
            <button
              v-if="entry.status !== 'PAID' && !showArchived"
              @click="markAsPaid(entry.id)"
              class="action-btn primary"
            >
              <Icon name="lucide:check" />
              Marcar como pago
            </button>

            <button
              v-if="!showArchived"
              @click="openEditModal(entry)"
              class="action-btn secondary"
            >
              <Icon name="lucide:pencil" />
            </button>

            <button
              @click="toggleArchive(entry.id, entry.archived)"
              class="action-btn secondary"
            >
              <Icon :name="entry.archived ? 'lucide:archive-restore' : 'lucide:archive'" />
            </button>
          </div>
        </div>
      </div>

      <button @click="showAddModal = true" class="add-btn">
        <Icon name="lucide:plus" size="24" />
        Adicionar item
      </button>
    </div>

    <div v-if="showAddModal || editingEntry" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingEntry ? 'Editar item' : 'Novo item financeiro' }}</h2>
          <button @click="closeModal" class="close-btn">
            <Icon name="lucide:x" />
          </button>
        </div>

        <form @submit.prevent="saveEntry" class="entry-form">
          <div class="form-group">
            <label for="title">Título *</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="ex: Conta de luz"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="amount">Valor *</label>
              <input
                id="amount"
                v-model.number="formData.amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div class="form-group">
              <label for="category">Categoria</label>
              <input
                id="category"
                v-model="formData.category"
                type="text"
                placeholder="ex: Contas"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">Data de vencimento</label>
            <input
              id="dueDate"
              v-model="formData.dueDate"
              type="date"
            />
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status">
              <option value="NOT_STARTED">Não iniciado</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
            </select>
          </div>

          <div class="form-group">
            <label for="note">Nota (opcional)</label>
            <textarea
              id="note"
              v-model="formData.note"
              rows="3"
              placeholder="Adicione uma nota..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving" class="btn-primary">
              <Icon v-if="isSaving" name="lucide:loader-2" class="spinning" />
              {{ isSaving ? 'Salvando...' : editingEntry ? 'Atualizar' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showAddModal = ref(false);
const showArchived = ref(false);
const loading = ref(false);
const isSaving = ref(false);
const editingEntry = ref<any>(null);

const formData = ref({
  title: '',
  amount: 0,
  category: '',
  dueDate: '',
  status: 'NOT_STARTED',
  note: ''
});

const entries = ref<any[]>([]);

const filteredEntries = computed(() => {
  return entries.value
    .filter(entry => entry.archived === showArchived.value)
    .sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      if (a.status === 'NOT_STARTED' && b.status === 'PAID') return -1;
      if (a.status === 'PAID' && b.status === 'NOT_STARTED') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
});

const pendingCount = computed(() => 
  entries.value.filter(e => !e.archived && (e.status === 'PENDING' || e.status === 'NOT_STARTED')).length
);

const paidCount = computed(() => 
  entries.value.filter(e => !e.archived && e.status === 'PAID').length
);

const totalAmount = computed(() => 
  entries.value
    .filter(e => !e.archived && e.status !== 'PAID')
    .reduce((sum, e) => sum + e.amount, 0)
);

const fetchEntries = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/finance');
    if (response.success) {
      entries.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching finance entries:', error);
  } finally {
    loading.value = false;
  }
};

const saveEntry = async () => {
  isSaving.value = true;
  try {
    const payload = {
      ...formData.value,
      dueDate: formData.value.dueDate ? new Date(formData.value.dueDate).toISOString() : null
    };

    if (editingEntry.value) {
      const response = await $fetch(`/api/finance/${editingEntry.value.id}`, {
        method: 'PUT',
        body: payload
      });
      if (response.success) {
        const index = entries.value.findIndex(e => e.id === editingEntry.value.id);
        if (index !== -1) {
          entries.value[index] = response.data;
        }
      }
    } else {
      const response = await $fetch('/api/finance', {
        method: 'POST',
        body: payload
      });
      if (response.success) {
        entries.value.unshift(response.data);
      }
    }
    closeModal();
  } catch (error) {
    console.error('Error saving entry:', error);
  } finally {
    isSaving.value = false;
  }
};

const markAsPaid = async (id: string) => {
  try {
    const response = await $fetch(`/api/finance/${id}`, {
      method: 'PUT',
      body: { status: 'PAID', paidAt: new Date().toISOString() }
    });
    if (response.success) {
      const index = entries.value.findIndex(e => e.id === id);
      if (index !== -1) {
        entries.value[index] = response.data;
      }
    }
  } catch (error) {
    console.error('Error marking as paid:', error);
  }
};

const toggleArchive = async (id: string, currentArchived: boolean) => {
  try {
    const response = await $fetch(`/api/finance/${id}`, {
      method: 'PUT',
      body: { archived: !currentArchived }
    });
    if (response.success) {
      const index = entries.value.findIndex(e => e.id === id);
      if (index !== -1) {
        entries.value[index] = response.data;
      }
    }
  } catch (error) {
    console.error('Error toggling archive:', error);
  }
};

const openEditModal = (entry: any) => {
  editingEntry.value = entry;
  formData.value = {
    title: entry.title,
    amount: entry.amount,
    category: entry.category || '',
    dueDate: entry.dueDate ? new Date(entry.dueDate).toISOString().split('T')[0] : '',
    status: entry.status,
    note: entry.note || ''
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingEntry.value = null;
  formData.value = {
    title: '',
    amount: 0,
    category: '',
    dueDate: '',
    status: 'NOT_STARTED',
    note: ''
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-pt', {
    day: '2-digit',
    month: 'short'
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    NOT_STARTED: 'Não iniciado',
    PENDING: 'Pendente',
    PAID: 'Pago'
  };
  return labels[status] || status;
};

onMounted(() => {
  fetchEntries();
});
</script>

<style scoped>
.finance-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.finance-container {
  max-width: 800px;
  margin: 0 auto;
}

.overview-section {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.monthly-summary {
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.summary-text {
  font-size: 16px;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.total-amount {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.filter-section {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.filter-btn {
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--color-primary);
}

.filter-btn.active {
  border-color: var(--color-primary);
  background: #E8F3ED;
  color: var(--color-primary-dark);
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

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.entry-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
}

.entry-card:hover {
  box-shadow: 0 2px 8px rgba(111, 175, 142, 0.08);
}

.entry-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.entry-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
}

.entry-category {
  font-size: 12px;
  color: var(--color-text-secondary);
  background: #F0F4F3;
  padding: 4px 12px;
  border-radius: 12px;
}

.entry-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.entry-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.entry-date :deep(svg) {
  width: 14px;
  height: 14px;
}

.entry-amount {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.status-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-paid {
  background: #D1F4E0;
  color: #2D7A4F;
}

.status-badge.status-pending {
  background: #F5E6D3;
  color: #8B6914;
}

.status-badge.status-not_started {
  background: #E8EAED;
  color: #5F6368;
}

.entry-note {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  font-style: italic;
}

.entry-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.action-btn.primary {
  background: var(--color-primary);
  color: white;
  flex: 1;
}

.action-btn.primary:hover {
  background: var(--color-primary-dark);
}

.action-btn.secondary {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  background: #F0F4F3;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.add-btn {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(111, 175, 142, 0.3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(111, 175, 142, 0.4);
}

.add-btn :deep(svg) {
  width: 24px;
  height: 24px;
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

.entry-form {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(111, 175, 142, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
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
  .finance-page {
    padding: var(--spacing-md);
  }

  .add-btn {
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
