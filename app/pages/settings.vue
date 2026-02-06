<template>
  <div class="settings-page">
    <div class="settings-container">
      <div class="settings-header">
        <h1 class="page-title">Preferências</h1>
        <p class="page-subtitle">
          Ajuste como o Mindle funciona para você. Tudo salva automaticamente.
        </p>
      </div>

      <div class="settings-grid">
        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:target" size="20" />
            <div>
              <h2 class="section-title">Foco</h2>
              <p class="section-hint">Sessões de concentração</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Duração padrão</span>
              <span class="setting-description">Tempo de cada sessão</span>
            </div>
            <select v-model="preferences.focusDuration" class="setting-select">
              <option
                v-for="opt in focusDurationOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Pausa automática</span>
              <span class="setting-description">Iniciar pausa ao terminar</span>
            </div>
            <button
              :class="['toggle', { active: preferences.autoBreak }]"
              @click="preferences.autoBreak = !preferences.autoBreak"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Som ao concluir</span>
              <span class="setting-description">Notificação sonora sutil</span>
            </div>
            <button
              :class="['toggle', { active: preferences.focusSound }]"
              @click="preferences.focusSound = !preferences.focusSound"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:calendar-days" size="20" />
            <div>
              <h2 class="section-title">Planejamento</h2>
              <p class="section-hint">Organização da semana</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Início da semana</span>
              <span class="setting-description">Qual dia começa</span>
            </div>
            <select v-model="preferences.weekStart" class="setting-select">
              <option
                v-for="opt in weekStartOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Mostrar só hoje</span>
              <span class="setting-description">Focar no dia atual</span>
            </div>
            <button
              :class="['toggle', { active: preferences.showOnlyToday }]"
              @click="preferences.showOnlyToday = !preferences.showOnlyToday"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Mostrar concluídas</span>
              <span class="setting-description"
                >Exibir tarefas finalizadas</span
              >
            </div>
            <button
              :class="['toggle', { active: preferences.showCompleted }]"
              @click="preferences.showCompleted = !preferences.showCompleted"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:heart" size="20" />
            <div>
              <h2 class="section-title">Hábitos e bem-estar</h2>
              <p class="section-hint">Cuide de você, no seu ritmo</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Lembrete diário</span>
              <span class="setting-description">Lembrar de fazer check-in</span>
            </div>
            <button
              :class="['toggle', { active: preferences.dailyReminder }]"
              @click="preferences.dailyReminder = !preferences.dailyReminder"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Mostrar insights</span>
              <span class="setting-description">Estatísticas de hábitos</span>
            </div>
            <button
              :class="['toggle', { active: preferences.showInsights }]"
              @click="preferences.showInsights = !preferences.showInsights"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:wallet" size="20" />
            <div>
              <h2 class="section-title">Finanças</h2>
              <p class="section-hint">Controle sem pressão</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Lembrete no dashboard</span>
              <span class="setting-description"
                >Itens pendentes na tela inicial</span
              >
            </div>
            <button
              :class="['toggle', { active: preferences.financeReminder }]"
              @click="
                preferences.financeReminder = !preferences.financeReminder
              "
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Arquivar pagos</span>
              <span class="setting-description"
                >Mover pagos automaticamente</span
              >
            </div>
            <button
              :class="['toggle', { active: preferences.autoArchivePaid }]"
              @click="
                preferences.autoArchivePaid = !preferences.autoArchivePaid
              "
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:sun" size="20" />
            <div>
              <h2 class="section-title">Visual e conforto</h2>
              <p class="section-hint">Aparência da interface</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Tema</span>
              <span class="setting-description">Modo de exibição</span>
            </div>
            <select v-model="preferences.theme" class="setting-select">
              <option
                v-for="opt in themeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Reduzir animações</span>
              <span class="setting-description">Menos movimento</span>
            </div>
            <button
              :class="['toggle', { active: preferences.reducedMotion }]"
              @click="preferences.reducedMotion = !preferences.reducedMotion"
            >
              <span class="toggle-thumb"></span>
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Tamanho do texto</span>
              <span class="setting-description">Ajuste para leitura</span>
            </div>
            <select v-model="preferences.fontSize" class="setting-select">
              <option
                v-for="opt in fontSizeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon name="lucide:shield" size="20" />
            <div>
              <h2 class="section-title">Dados e segurança</h2>
              <p class="section-hint">Seus dados, seu controle</p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Exportar dados</span>
              <span class="setting-description">Baixar tudo em JSON</span>
            </div>
            <button
              class="action-btn"
              @click="exportData"
              :disabled="exporting"
            >
              <Icon
                :name="exporting ? 'lucide:loader-2' : 'lucide:download'"
                size="16"
                :class="{ spinning: exporting }"
              />
              {{ exporting ? "Exportando..." : "Exportar" }}
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">Limpar cache local</span>
              <span class="setting-description"
                >Dados temporários do navegador</span
              >
            </div>
            <button class="action-btn" @click="clearCache">
              <Icon name="lucide:trash-2" size="16" />
              Limpar
            </button>
          </div>
        </section>
      </div>

      <section class="about-section">
        <p class="app-name">Mindle</p>
        <p class="app-version">v1.0.0</p>
        <p class="app-philosophy">
          Um espaço calmo para organizar o que importa. Sem pressa, sem pressão.
          Feito para quem quer clareza, não mais complexidade.
        </p>
        <a href="mailto:feedback@mindle.app" class="feedback-link">
          <Icon name="lucide:mail" size="16" />
          Enviar feedback
        </a>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { preferences, fetchPreferences, debouncedSave } = usePreferences();
const toast = useToast();
const exporting = ref(false);

const focusDurationOptions = [
  { label: "15 minutos", value: "15" },
  { label: "30 minutos", value: "30" },
  { label: "45 minutos", value: "45" },
  { label: "60 minutos", value: "60" },
  { label: "90 minutos", value: "90" },
];

const weekStartOptions = [
  { label: "Segunda-feira", value: "monday" },
  { label: "Domingo", value: "sunday" },
];

const themeOptions = [
  { label: "Claro", value: "light" },
  { label: "Escuro", value: "dark" },
  { label: "Sistema", value: "system" },
];

const fontSizeOptions = [
  { label: "Pequeno", value: "small" },
  { label: "Normal", value: "normal" },
  { label: "Grande", value: "large" },
];

watch(
  preferences,
  () => {
    debouncedSave();
  },
  { deep: true },
);

const exportData = async () => {
  exporting.value = true;
  try {
    const [tasks, habits, habitLogs, finance] = await Promise.all([
      $fetch("/api/tasks"),
      $fetch("/api/habits"),
      $fetch("/api/habits/logs"),
      $fetch("/api/finance"),
    ]);

    const data = {
      exportedAt: new Date().toISOString(),
      tasks: tasks.success ? tasks.data : [],
      habits: habits.success ? habits.data : [],
      habitLogs: habitLogs.success ? habitLogs.data : [],
      finance: finance.success ? finance.data : [],
      preferences: preferences.value,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindle-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dados exportados");
  } catch (error) {
    console.error("Error exporting data:", error);
    toast.error("Erro ao exportar dados");
  } finally {
    exporting.value = false;
  }
};

const clearCache = () => {
  localStorage.clear();
  toast.info("Cache limpo");
};

onMounted(() => {
  fetchPreferences();
});
</script>

<style scoped lang="css">
.settings-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.settings-container {
  max-width: 900px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: 1.5;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.settings-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.section-header > :deep(svg) {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.section-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 0 0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.setting-row + .setting-row {
  border-top: 1px solid var(--color-border);
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.setting-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.setting-select {
  width: 160px;
  flex-shrink: 0;
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7C7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.setting-select:focus {
  border-color: var(--color-primary);
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active .toggle-thumb {
  transform: translateX(20px);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.about-section {
  text-align: center;
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-md);
}

.app-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.app-version {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 var(--spacing-md) 0;
}

.app-philosophy {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 auto var(--spacing-lg) auto;
  max-width: 380px;
}

.feedback-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.feedback-link:hover {
  border-color: var(--color-primary);
  background: #f0f9f4;
}

@media (max-width: 768px) {
  .settings-page {
    padding: var(--spacing-md);
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-select {
    width: 140px;
  }
}
</style>
