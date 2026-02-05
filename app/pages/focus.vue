<template>
  <div class="focus-page">
    <div v-if="sessionComplete" class="completion-overlay">
      <div class="completion-card">
        <div class="completion-icon">
          <Icon name="lucide:check-circle-2" />
        </div>
        <h2 class="completion-title">Bom trabalho. Você apareceu.</h2>
        <p class="completion-message">
          Você focou por {{ formatDuration(elapsedMinutes) }}
        </p>
        <div class="completion-actions">
          <button @click="logSession" class="log-btn">
            <Icon name="lucide:bookmark" />
            Registrar sessão
          </button>
          <button @click="resetSession" class="reset-btn">Iniciar outra</button>
        </div>
      </div>
    </div>

    <div class="focus-container">
      <div v-if="!isActive && !isPaused" class="setup-view">
        <div class="focus-context">
          <label for="focus-input" class="context-label">
            No que você vai focar?
          </label>
          <input
            id="focus-input"
            v-model="focusContext"
            type="text"
            class="context-input"
            placeholder="ex: Estudar Hematologia"
            maxlength="50"
          />
        </div>

        <div class="presets-section">
          <h3 class="presets-title">Escolha seu tempo de foco</h3>
          <div class="presets-grid">
            <button
              v-for="preset in presets"
              :key="preset.value"
              @click="selectPreset(preset.value)"
              :class="[
                'preset-btn',
                { active: selectedDuration === preset.value },
              ]"
            >
              <span class="preset-duration">{{ preset.label }}</span>
              <span class="preset-sublabel">{{ preset.sublabel }}</span>
            </button>
          </div>

          <button
            v-if="!showCustom"
            @click="showCustom = true"
            class="custom-toggle"
          >
            Duração personalizada
          </button>

          <div v-if="showCustom" class="custom-input-wrapper">
            <input
              v-model.number="customMinutes"
              type="number"
              min="1"
              max="240"
              class="custom-input"
              placeholder="Minutos"
            />
            <button @click="applyCustom" class="apply-custom-btn">
              Aplicar
            </button>
          </div>
        </div>
      </div>

      <div v-if="isActive || isPaused" class="session-view">
        <div v-if="focusContext" class="active-context">
          {{ focusContext }}
        </div>

        <div class="timer-container">
          <svg class="progress-ring" viewBox="0 0 200 200">
            <circle class="progress-ring-bg" cx="100" cy="100" r="90" />
            <circle
              class="progress-ring-fill"
              cx="100"
              cy="100"
              r="90"
              :style="{
                strokeDashoffset: progressOffset,
                stroke: progressColor,
              }"
            />
          </svg>

          <div class="timer-display">
            <div class="time-remaining">{{ formattedTime }}</div>
            <div class="time-label">restante</div>
          </div>
        </div>

        <div class="distraction-indicator">
          <Icon name="lucide:bell-off" />
          <span>Mantenha o foco</span>
        </div>
      </div>

      <div class="controls">
        <button
          v-if="!isActive && !isPaused"
          @click="startSession"
          :disabled="!selectedDuration"
          class="control-btn primary"
        >
          <Icon name="lucide:play" />
          Começar foco
        </button>

        <button
          v-if="isActive"
          @click="pauseSession"
          class="control-btn secondary"
        >
          <Icon name="lucide:pause" />
          Pausar
        </button>

        <button
          v-if="isPaused"
          @click="resumeSession"
          class="control-btn primary"
        >
          <Icon name="lucide:play" />
          Retomar
        </button>

        <button
          v-if="isActive || isPaused"
          @click="endSession"
          class="control-btn end"
        >
          <Icon name="lucide:octagon" />
          Encerrar sessão
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const focusContext = ref("");
const selectedDuration = ref(0);
const customMinutes = ref(30);
const showCustom = ref(false);
const isActive = ref(false);
const isPaused = ref(false);
const sessionComplete = ref(false);
const timeRemaining = ref(0);
const sessionDuration = ref(0);
const elapsedSeconds = ref(0);
const elapsedMinutes = ref(0);
let intervalId: NodeJS.Timeout | null = null;
let startTime: number | null = null;

const presets = [
  { value: 15, label: "15 min", sublabel: "Foco rápido" },
  { value: 30, label: "30 min", sublabel: "Padrão" },
  { value: 60, label: "60 min", sublabel: "Trabalho profundo" },
  { value: 120, label: "120 min", sublabel: "Estendido" },
];

const selectPreset = (minutes: number) => {
  selectedDuration.value = minutes;
  showCustom.value = false;
};

const applyCustom = () => {
  if (customMinutes.value >= 1 && customMinutes.value <= 240) {
    selectedDuration.value = customMinutes.value;
  }
};

const startSession = () => {
  if (!selectedDuration.value) return;

  timeRemaining.value = selectedDuration.value * 60;
  sessionDuration.value = selectedDuration.value;
  elapsedSeconds.value = 0;
  startTime = Date.now();
  isActive.value = true;
  isPaused.value = false;

  intervalId = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
      elapsedSeconds.value++;
    } else {
      completeSession();
    }
  }, 1000);
};

const pauseSession = () => {
  isPaused.value = true;
  isActive.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const resumeSession = () => {
  isPaused.value = false;
  isActive.value = true;

  intervalId = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
      elapsedSeconds.value++;
    } else {
      completeSession();
    }
  }, 1000);
};

const endSession = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  completeSession();
};

const completeSession = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  elapsedMinutes.value = Math.ceil(elapsedSeconds.value / 60);

  isActive.value = false;
  isPaused.value = false;
  sessionComplete.value = true;

  const audio = new Audio(
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXi8LdjHAU2kdXzzHksBSJ2yPDekEELFF+z6+uoVRQKRp/h8r9sIQYqgc7y2Ik2CBhnu+znm0sMD1Cl4vC3YxwFNo/W8sx5LAUidsjw3pBBCxRfs+vrqFUUCkaf4fK/bCEGKoHO8tmJNggYZ7vs55tLDA9QpeLwt2McBTaP1vLMeSwFInbI8N6QQQsUX7Pr66hVFApGn+HyvmwhBiuBzvLZiTYIGGe77OebSwwPUKXi8LdjHAU2j9byzHksBSJ2yPDekEELFF+z6+uoVRQKRp/h8r5sIQYrgc7y2Yk2CBhnu+znm0sMD1Cl4vC3YxwFNo/W8sx5LAUidsjw3pBBCxRfs+vrqFUUCkaf4fK+bCEGK4HO8tmJNggYZ7vs55tLDA9QpeLwt2McBTaP1vLMeSwFInbI8N6QQQsUX7Pr66hVFApGn+HyvmwhBiuBzvLZiTYIGGe77OebSwwPUKXi8LdjHAU2j9byzHksBSJ2yPDekEELFF+z6+uoVRQKRp/h8r5sIQYrgc7y2Yk2CBhnu+znm0sMD1Cl4vC3YxwFNo/W8sx5LAUidsjw3pBBCxRfs+vrqFUUCkaf4fK+bCEGK4HO8tmJNggYZ7vs",
  );
  audio.volume = 0.2;
  audio.play().catch(() => {});
};

const resetSession = () => {
  sessionComplete.value = false;
  timeRemaining.value = 0;
  sessionDuration.value = 0;
  elapsedSeconds.value = 0;
  elapsedMinutes.value = 0;
  startTime = null;
};

const logSession = async () => {
  try {
    await $fetch("/api/focus", {
      method: "POST",
      body: {
        focusContext: focusContext.value,
        durationMinutes: sessionDuration.value,
        elapsedMinutes: elapsedMinutes.value,
      },
    });
  } catch (error) {
    console.error("Failed to log session:", error);
  }
  resetSession();
};

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

const formatDuration = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  if (minutes === 1) return `${minutes} minuto`;
  return `${minutes} minutos`;
};

const progressOffset = computed(() => {
  const totalSeconds = sessionDuration.value * 60;
  const circumference = 2 * Math.PI * 90;
  const progress = timeRemaining.value / totalSeconds;
  return circumference * (1 - progress);
});

const progressColor = computed(() => {
  const progress = timeRemaining.value / (sessionDuration.value * 60);
  if (progress > 0.5) return "#6FAF8E";
  if (progress > 0.25) return "#8BC4A8";
  return "#A8D5C0";
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.focus-page {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  position: relative;
}

.focus-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.setup-view,
.session-view {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.focus-context {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.context-label {
  display: block;
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.context-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  font-size: 16px;
  text-align: center;
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all 0.3s ease;
}

.context-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(111, 175, 142, 0.1);
}

.context-input::placeholder {
  color: var(--color-text-secondary);
}

.presets-section {
  margin-bottom: var(--spacing-xl);
}

.presets-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.preset-btn {
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-height: 100px;
  justify-content: center;
}

.preset-btn:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(111, 175, 142, 0.15);
}

.preset-btn.active {
  border-color: var(--color-primary);
  background: #E8F3ED;
  box-shadow: 0 4px 16px rgba(111, 175, 142, 0.2);
}

.preset-duration {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.preset-sublabel {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-toggle {
  width: 100%;
  padding: var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.custom-toggle:hover {
  background: #E8F3ED;
}

.custom-input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.custom-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  background: var(--color-surface);
}

.custom-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.apply-custom-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.apply-custom-btn:hover {
  background: var(--color-primary-dark);
}

.session-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.active-context {
  font-size: 18px;
  color: var(--color-primary-dark);
  font-weight: 500;
  text-align: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(111, 175, 142, 0.1);
}

.timer-container {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 8;
}

.progress-ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 565.48;
  transition:
    stroke-dashoffset 1s linear,
    stroke 0.5s ease;
}

.timer-display {
  text-align: center;
  z-index: 1;
}

.time-remaining {
  font-size: 64px;
  font-weight: 300;
  color: var(--color-primary-dark);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.distraction-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(111, 175, 142, 0.08);
}

.distraction-indicator :deep(svg) {
  width: 16px;
  height: 16px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.control-btn {
  width: 100%;
  padding: var(--spacing-lg) var(--spacing-xl);
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: all 0.3s ease;
  min-height: 64px;
}

.control-btn :deep(svg) {
  width: 24px;
  height: 24px;
}

.control-btn.primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 16px rgba(111, 175, 142, 0.25);
}

.control-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(111, 175, 142, 0.3);
}

.control-btn.primary:disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  box-shadow: none;
}

.control-btn.secondary {
  background: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.control-btn.secondary:hover {
  background: #E8F3ED;
}

.control-btn.end {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border);
  font-size: 14px;
  min-height: 48px;
}

.control-btn.end:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(78, 138, 109, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  animation: fadeIn 0.5s ease;
}

.completion-card {
  background: white;
  border-radius: 24px;
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.completion-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: #E8F3ED;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.completion-icon :deep(svg) {
  width: 48px;
  height: 48px;
  color: var(--color-primary-dark);
}

.completion-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.completion-message {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
}

.completion-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.log-btn,
.reset-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.log-btn {
  background: var(--color-primary);
  color: white;
  border: none;
}

.log-btn:hover {
  background: var(--color-primary-dark);
}

.log-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.reset-btn {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-border);
}

.reset-btn:hover {
  background: #E8F3ED;
}

@media (max-width: 768px) {
  .focus-page {
    padding: var(--spacing-md);
  }

  .timer-container {
    width: 240px;
    height: 240px;
  }

  .time-remaining {
    font-size: 56px;
  }

  .presets-grid {
    grid-template-columns: 1fr;
  }

  .preset-btn {
    min-height: 80px;
  }
}
</style>
