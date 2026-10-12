<template>
  <div class="auth-card">
    <h2 class="auth-title">
      {{ $t("auth.login.title") }}
    </h2>
    <p class="auth-subtitle">
      {{ $t("auth.login.subtitle") }}
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
        >
          {{ $t("auth.login.emailLabel") }}
        </label>
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
            :placeholder="$t('auth.login.emailPlaceholder')"
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
        >
          {{ emailError }}
        </span>
      </div>

      <div class="form-group">
        <label
          for="password"
          class="form-label"
        >
          {{ $t("auth.login.passwordLabel") }}
        </label>
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
            :placeholder="$t('auth.login.passwordPlaceholder')"
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
        >
          {{ passwordError }}
        </span>
      </div>

      <div class="form-row">
        <label class="checkbox-label">
          <input
            v-model="rememberMe"
            type="checkbox"
          />
          <span class="checkbox-text">{{ $t("auth.login.rememberMe") }}</span>
        </label>
        <NuxtLink
          to="/auth/forgot-password"
          class="forgot-link"
        >
          {{ $t("auth.login.forgotPassword") }}
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
        {{ submitting ? $t("auth.login.signingIn") : $t("auth.login.signIn") }}
      </button>

      <div class="divider">
        <span>{{ $t("shared.or") }}</span>
      </div>

      <div class="google-btn-wrapper">
        <ClientOnly>
          <div
            v-if="!googleLoading"
            ref="googleButtonContainer"
            class="google-button-container"
          />
          <div
            v-if="googleLoading"
            class="google-loading"
          >
            <Icon
              name="lucide:loader-2"
              size="18"
              class="spinning"
            />
            <span>{{ $t("auth.login.signingInGoogle") }}</span>
          </div>
        </ClientOnly>
      </div>
    </form>

    <p class="auth-footer">
      {{ $t("auth.login.noAccount") }}
      <NuxtLink
        to="/auth/register"
        class="auth-link"
      >{{ $t("auth.login.createAccount") }}</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useGoogleAuth } from "@/composables/useGoogleAuth";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const { login, googleLogin } = useAuth();
const { googleReady, googleButtonContainer, initializeGoogleButton }
  = useGoogleAuth();

const ERROR_MESSAGES: Record<number, string> = {
  400: t("auth.login.invalidCredentials"),
  401: t("auth.login.invalidCredentials"),
  429: t("auth.login.tooManyAttempts"),
  500: t("auth.login.serverError"),
};

const resolveError = (statusCode?: number, fallback?: string) =>
  (statusCode !== undefined ? ERROR_MESSAGES[statusCode] : undefined)
  ?? fallback
  ?? t("auth.login.invalidCredentials");

const email = ref("");
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
    emailError.value = t("auth.login.emailRequired");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = t("auth.login.emailInvalid");
    return false;
  }
  emailError.value = "";
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = t("auth.login.passwordRequired");
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
      errorMessage.value = resolveError(response.statusCode, response.error);
    }
  } catch {
    errorMessage.value = t("auth.connectionError");
  } finally {
    submitting.value = false;
  }
};
const handleGoogleSuccess = async (e: {
  credential: string;
  claims: Record<string, unknown>;
}) => {
  errorMessage.value = "";
  googleLoading.value = true;
  try {
    const response = await googleLogin(e.credential);
    if (response.success) {
      navigateTo("/");
    } else {
      errorMessage.value = resolveError(response.statusCode, response.error);
    }
  } catch {
    errorMessage.value = t("auth.connectionError");
  } finally {
    googleLoading.value = false;
  }
};

const handleGoogleError = () => {
  errorMessage.value = resolveError(
    undefined,
    t("auth.googleAuthError"),
  );
};

onMounted(() => {
  initializeGoogleButton(googleButtonContainer, handleGoogleSuccess, {
    text: "continue_with",
    theme: "filled_blue",
    size: "large",
    shape: "pill",
    width: 200,
  });
});
</script>

<style scoped lang="css">
.auth-card {
  background: color-mix(in srgb, var(--color-surface) 78%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid color-mix(in srgb, var(--color-surface) 60%, transparent);
  border-radius: 24px;
  padding: var(--spacing-xl);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.07),
    0 1px 0 color-mix(in srgb, white 40%, transparent) inset;
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
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0 var(--spacing-md);
  height: 48px;
  background: color-mix(in srgb, var(--color-background) 70%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  gap: var(--spacing-lg);
  min-height: 100%;
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
