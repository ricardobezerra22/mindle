<template>
  <div>
    <h2 class="auth-title">
      {{ $t("auth.login.title") }}
    </h2>
    <p class="auth-subtitle">
      {{ $t("auth.login.subtitle") }}
    </p>

    <div
      v-if="errorMessage"
      class="alert"
      role="alert"
    >
      <Icon
        name="lucide:alert-circle"
        size="18"
      />
      <span>{{ errorMessage }}</span>
    </div>

    <form
      class="auth-form"
      novalidate
      @submit.prevent="handleLogin"
    >
      <AuthField
        id="email"
        v-model="email"
        type="email"
        icon="lucide:mail"
        :label="$t('auth.login.emailLabel')"
        :placeholder="$t('auth.login.emailPlaceholder')"
        :error="emailError"
        autocomplete="email"
        @blur="validateEmail"
      />

      <AuthField
        id="password"
        v-model="password"
        icon="lucide:lock"
        toggleable
        type="password"
        :label="$t('auth.login.passwordLabel')"
        :placeholder="$t('auth.login.passwordPlaceholder')"
        :error="passwordError"
        autocomplete="current-password"
        @blur="validatePassword"
      />

      <div class="form-row">
        <label class="checkbox-label">
          <input
            v-model="rememberMe"
            type="checkbox"
          />
          {{ $t("auth.login.rememberMe") }}
        </label>
        <NuxtLink
          to="/auth/forgot-password"
          class="auth-link"
        >
          {{ $t("auth.login.forgotPassword") }}
        </NuxtLink>
      </div>

      <AuthButton
        type="submit"
        :loading="submitting"
        :disabled="googleLoading"
      >
        {{ submitting ? $t("auth.login.signingIn") : $t("auth.login.signIn") }}
        <Icon
          v-if="!submitting"
          name="lucide:arrow-right"
          size="20"
        />
      </AuthButton>
    </form>

    <div class="divider">
      <span>{{ $t("shared.or") }}</span>
    </div>

    <AuthGoogleButton
      :label="$t('auth.continueWithGoogle')"
      :loading-label="$t('auth.login.signingInGoogle')"
      :loading="googleLoading"
      @success="handleGoogleSuccess"
    />

    <p class="auth-footer">
      {{ $t("auth.login.noAccount") }}
      <NuxtLink
        to="/auth/register"
        class="auth-link strong"
      >
        {{ $t("auth.login.createAccount") }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "onboarding",
  pageTransition: { name: "auth-page", mode: "out-in" },
});

const { t } = useI18n();
const { login, googleLogin } = useAuth();

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
const password = ref("");
const rememberMe = ref(false);
const submitting = ref(false);
const googleLoading = ref(false);
const errorMessage = ref("");
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

const handleGoogleSuccess = async (credential: string) => {
  errorMessage.value = "";
  googleLoading.value = true;
  try {
    const response = await googleLogin(credential);
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
</script>
