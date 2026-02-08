<template>
  <div class="auth-card">
    <h2 class="auth-title">
      Bem-vindo de volta
    </h2>
    <p class="auth-subtitle">
      Entre para continuar de onde parou
    </p>

    <div
      v-if="errorMessage"
      class="alert alert-error"
    >
      <Icon
        name="lucide:alert-circle"
        size="16"
      />
      <span>{{ errorMessage }}</span>
    </div>

    <form
      class="auth-form"
      @submit.prevent="handleLogin"
    >
      <div class="form-group">
        <label
          for="email"
          class="form-label"
        >Email</label>
        <div
          :class="[
            'input-wrapper',
            { focused: emailFocused, error: emailError },
          ]"
        >
          <Icon
            name="lucide:mail"
            size="18"
            class="input-icon"
          />
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            autocomplete="email"
            @focus="emailFocused = true"
            @blur="
              emailFocused = false;
              validateEmail();
            "
          />
        </div>
        <span
          v-if="emailError"
          class="field-error"
        >{{ emailError }}</span>
      </div>

      <div class="form-group">
        <label
          for="password"
          class="form-label"
        >Senha</label>
        <div
          :class="[
            'input-wrapper',
            { focused: passwordFocused, error: passwordError },
          ]"
        >
          <Icon
            name="lucide:lock"
            size="18"
            class="input-icon"
          />
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            @focus="passwordFocused = true"
            @blur="
              passwordFocused = false;
              validatePassword();
            "
          />
          <button
            type="button"
            class="toggle-password"
            tabindex="-1"
            @click="showPassword = !showPassword"
          >
            <Icon
              :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
              size="18"
            />
          </button>
        </div>
        <span
          v-if="passwordError"
          class="field-error"
        >{{
          passwordError
        }}</span>
      </div>

      <div class="form-row">
        <label class="checkbox-label">
          <input
            v-model="rememberMe"
            type="checkbox"
          />
          <span class="checkbox-text">Lembrar de mim</span>
        </label>
        <NuxtLink
          to="/auth/forgot-password"
          class="forgot-link"
        >
          Esqueceu a senha?
        </NuxtLink>
      </div>

      <button
        type="submit"
        class="submit-btn"
        :disabled="submitting || googleLoading"
      >
        <Icon
          v-if="submitting"
          name="lucide:loader-2"
          size="18"
          class="spinning"
        />
        {{ submitting ? "Entrando..." : "Entrar" }}
      </button>

      <div class="divider">
        <span>ou</span>
      </div>

      <div class="google-btn-wrapper">
        <ClientOnly>
          <GoogleLoginButton
            :options="{ theme: 'outline', size: 'medium', text: 'signin_with', shape: 'rectangular', width: 200 }"
            @success="handleGoogleSuccess"
            @error="handleGoogleError"
          />
        </ClientOnly>
        <div
          v-if="googleLoading"
          class="google-loading"
        >
          <Icon
            name="lucide:loader-2"
            size="18"
            class="spinning"
          />
          <span>Entrando com Google...</span>
        </div>
      </div>
    </form>

    <p class="auth-footer">
      Não tem uma conta?
      <NuxtLink
        to="/auth/register"
        class="auth-link"
      >Criar conta</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });

const { login, googleLogin } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const submitting = ref(false);
const googleLoading = ref(false);
const errorMessage = ref("");

const emailFocused = ref(false);
const passwordFocused = ref(false);
const emailError = ref("");
const passwordError = ref("");

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

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Senha é obrigatória";
    return false;
  }
  passwordError.value = "";
  return true;
};

const handleLogin = async () => {
  errorMessage.value = "";
  const validEmail = validateEmail();
  const validPassword = validatePassword();
  if (!validEmail || !validPassword) return;

  submitting.value = true;
  try {
    const response = await login(email.value, password.value);
    if (response.success) {
      navigateTo("/");
    } else {
      errorMessage.value = response.error || "Erro ao fazer login";
    }
  } catch {
    errorMessage.value = "Erro de conexão. Tente novamente.";
  } finally {
    submitting.value = false;
  }
};
const handleGoogleSuccess = async (e: { credential: string; claims: any }) => {
  errorMessage.value = "";
  googleLoading.value = true;
  try {
    const response = await googleLogin(e.credential);
    if (response.success) {
      navigateTo("/");
    } else {
      errorMessage.value = response.error || "Erro ao fazer login com Google";
    }
  } catch {
    errorMessage.value = "Erro de conexão. Tente novamente.";
  } finally {
    googleLoading.value = false;
  }
};

const handleGoogleError = () => {
  errorMessage.value = "Erro ao autenticar com Google. Tente novamente.";
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

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: var(--color-text-primary);
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin-top: 2px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.checkbox-text {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.forgot-link {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
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
  margin-top: var(--spacing-sm);
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.google-btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.google-loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 13px;
  color: var(--color-text-secondary);
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
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
