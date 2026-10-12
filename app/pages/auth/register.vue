<template>
  <div>
    <h2 class="auth-title">
      {{ $t("auth.register.title") }}
    </h2>
    <p class="auth-subtitle">
      {{ $t("auth.register.subtitle") }}
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
      @submit.prevent="handleRegister"
    >
      <AuthField
        id="name"
        v-model="name"
        icon="lucide:user"
        :label="$t('auth.register.nameLabel')"
        :placeholder="$t('auth.register.namePlaceholder')"
        :error="nameError"
        autocomplete="name"
        @blur="validateName"
      />

      <AuthField
        id="email"
        v-model="email"
        type="email"
        icon="lucide:mail"
        :label="$t('auth.register.emailLabel')"
        :placeholder="$t('auth.register.emailPlaceholder')"
        :error="emailError"
        autocomplete="email"
        @blur="validateEmail"
      />

      <div class="password-block">
        <AuthField
          id="password"
          v-model="password"
          icon="lucide:lock"
          toggleable
          type="password"
          :label="$t('auth.register.passwordLabel')"
          :placeholder="$t('auth.register.passwordPlaceholder')"
          :error="passwordError"
          autocomplete="new-password"
          @blur="validatePassword"
          @input="updateStrength"
        />
        <template v-if="password && !passwordError">
          <div
            class="strength-bar"
            aria-hidden="true"
          >
            <div
              :class="['strength-fill', strengthClass]"
              :style="{ width: strengthPercent + '%' }"
            />
          </div>
          <span :class="['strength-text', strengthClass]">
            {{ strengthLabel }}
          </span>
        </template>
      </div>

      <label class="checkbox-label">
        <input
          v-model="acceptTerms"
          type="checkbox"
        />
        {{ $t("auth.register.agreeTerms") }}
      </label>

      <AuthButton
        type="submit"
        :loading="submitting"
        :disabled="!acceptTerms || googleLoading"
      >
        {{
          submitting
            ? $t("auth.register.signingUp")
            : $t("auth.register.signUp")
        }}
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
      mode="signup"
      :label="$t('auth.signUpWithGoogle')"
      :loading-label="$t('auth.register.signingUpGoogle')"
      :loading="googleLoading"
      @success="handleGoogleSuccess"
    />

    <p class="auth-footer">
      {{ $t("auth.register.haveAccount") }}
      <NuxtLink
        to="/auth/login"
        class="auth-link strong"
      >
        {{ $t("auth.register.signIn") }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  pageTransition: { name: "auth-page", mode: "out-in" },
});

const { t } = useI18n();
const { register, googleLogin } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const acceptTerms = ref(false);
const submitting = ref(false);
const googleLoading = ref(false);
const errorMessage = ref("");
const nameError = ref("");
const emailError = ref("");
const passwordError = ref("");

const strength = ref(0);

const strengthPercent = computed(() => (strength.value / 4) * 100);
const strengthClass = computed(() => {
  if (strength.value <= 1) return "weak";
  if (strength.value <= 2) return "fair";
  if (strength.value <= 3) return "good";
  return "strong";
});
const strengthLabel = computed(() => {
  if (strength.value <= 1) return t("auth.register.passwordStrengthWeak");
  if (strength.value <= 2) return t("auth.register.passwordStrengthFair");
  if (strength.value <= 3) return t("auth.register.passwordStrengthGood");
  return t("auth.register.passwordStrengthStrong");
});

const updateStrength = () => {
  let score = 0;
  const p = password.value;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;
  strength.value = score;
};

const validateName = () => {
  if (!name.value.trim()) {
    nameError.value = t("auth.register.nameRequired");
    return false;
  }
  nameError.value = "";
  return true;
};

const validateEmail = () => {
  if (!email.value) {
    emailError.value = t("auth.register.emailRequired");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = t("auth.register.emailInvalid");
    return false;
  }
  emailError.value = "";
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = t("auth.register.passwordRequired");
    return false;
  }
  if (password.value.length < 6) {
    passwordError.value = t("auth.register.passwordTooShort");
    return false;
  }
  passwordError.value = "";
  return true;
};

const handleRegister = async () => {
  errorMessage.value = "";
  const validName = validateName();
  const validEmail = validateEmail();
  const validPassword = validatePassword();
  if (!validName || !validEmail || !validPassword) return;

  if (!acceptTerms.value) {
    errorMessage.value = t("auth.register.acceptTermsRequired");
    return;
  }

  submitting.value = true;
  try {
    const response = await register(name.value, email.value, password.value);
    if (response.success) {
      navigateTo("/");
    } else {
      errorMessage.value
        = response.error || t("auth.register.registrationError");
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
      errorMessage.value
        = response.error || t("auth.register.googleRegistrationError");
    }
  } catch {
    errorMessage.value = t("auth.connectionError");
  } finally {
    googleLoading.value = false;
  }
};
</script>

<style scoped>
.password-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strength-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--auth-line);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.strength-fill.weak {
  background: #dc2626;
}

.strength-fill.fair {
  background: #f59e0b;
}

.strength-fill.good {
  background: #4e8f73;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  font-size: 13px;
  font-weight: 500;
}

.strength-text.weak {
  color: #b91c1c;
}

.strength-text.fair {
  color: #92400e;
}

.strength-text.good {
  color: #2f6b52;
}

.strength-text.strong {
  color: #065f46;
}
</style>
