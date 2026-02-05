<template>
  <div class="auth-card">
    <div v-if="!sent">
      <h2 class="auth-title">Recuperar senha</h2>
      <p class="auth-subtitle">
        Informe seu email e enviaremos instruções para redefinir sua senha
      </p>

      <div v-if="errorMessage" class="alert alert-error">
        <Icon name="lucide:alert-circle" size="16" />
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div :class="['input-wrapper', { focused: emailFocused, error: emailError }]">
            <Icon name="lucide:mail" size="18" class="input-icon" />
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="email"
              @focus="emailFocused = true"
              @blur="emailFocused = false; validateEmail()"
            />
          </div>
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="submitting">
          <Icon
            v-if="submitting"
            name="lucide:loader-2"
            size="18"
            class="spinning"
          />
          {{ submitting ? "Enviando..." : "Enviar instruções" }}
        </button>
      </form>
    </div>

    <div v-else class="success-state">
      <div class="success-icon">
        <Icon name="lucide:mail-check" size="32" />
      </div>
      <h2 class="auth-title">Email enviado</h2>
      <p class="auth-subtitle">
        Se existe uma conta com esse email, você receberá instruções para
        redefinir sua senha em breve.
      </p>
    </div>

    <p class="auth-footer">
      <NuxtLink to="/auth/login" class="auth-link">
        <Icon name="lucide:arrow-left" size="14" />
        Voltar para login
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const email = ref("");
const submitting = ref(false);
const sent = ref(false);
const errorMessage = ref("");
const emailFocused = ref(false);
const emailError = ref("");

const validateEmail = () => {
  if (!email.value) {
    emailError.value = "Email é obrigatório";
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Email inválido";
    return false;
  }
  emailError.value = "";
  return true;
};

const handleSubmit = async () => {
  errorMessage.value = "";
  if (!validateEmail()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    sent.value = true;
  } catch {
    errorMessage.value = "Erro de conexão. Tente novamente.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="css">
.auth-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 24px;
  padding: var(--spacing-xl);
}

.auth-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 var(--spacing-lg) 0;
  text-align: center;
  line-height: 1.5;
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: var(--spacing-md);
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 0 var(--spacing-md);
  height: 48px;
  background: var(--color-background);
  transition: all 0.2s ease;
}

.input-wrapper.focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(111, 175, 142, 0.12);
}

.input-wrapper.error {
  border-color: #dc2626;
}

.input-icon {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.input-wrapper.focused .input-icon {
  color: var(--color-primary);
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  font-family: inherit;
  color: var(--color-text-primary);
  min-width: 0;
}

.input-wrapper input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin-top: 2px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: var(--color-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.success-state {
  text-align: center;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f5e9;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg) auto;
}

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: var(--spacing-lg) 0 0 0;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
