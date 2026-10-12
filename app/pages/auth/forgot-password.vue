<template>
  <div>
    <div v-if="!sent">
      <h2 class="auth-title">
        {{ $t("auth.forgotPassword.title") }}
      </h2>
      <p class="auth-subtitle">
        {{ $t("auth.forgotPassword.subtitle") }}
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
        @submit.prevent="handleSubmit"
      >
        <AuthField
          id="email"
          v-model="email"
          type="email"
          icon="lucide:mail"
          :label="$t('auth.forgotPassword.emailLabel')"
          :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
          :error="emailError"
          autocomplete="email"
          @blur="validateEmail"
        />

        <AuthButton
          type="submit"
          :loading="submitting"
        >
          {{
            submitting
              ? $t("auth.forgotPassword.sending")
              : $t("auth.forgotPassword.sendReset")
          }}
          <Icon
            v-if="!submitting"
            name="lucide:arrow-right"
            size="20"
          />
        </AuthButton>
      </form>
    </div>

    <div
      v-else
      class="success-state"
      role="status"
    >
      <div class="success-icon">
        <Icon
          name="lucide:mail-check"
          size="32"
        />
      </div>
      <h2 class="auth-title">
        {{ $t("auth.forgotPassword.emailSent") }}
      </h2>
      <p class="auth-subtitle">
        {{ $t("auth.forgotPassword.emailSentMessage") }}
      </p>
    </div>

    <p class="auth-footer">
      <NuxtLink
        to="/auth/login"
        class="auth-link strong back-link"
      >
        <Icon
          name="lucide:arrow-left"
          size="16"
        />
        {{ $t("auth.forgotPassword.backToLogin") }}
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

const email = ref("");
const submitting = ref(false);
const sent = ref(false);
const errorMessage = ref("");
const emailError = ref("");

const validateEmail = () => {
  if (!email.value) {
    emailError.value = t("auth.forgotPassword.emailRequired");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = t("auth.forgotPassword.emailInvalid");
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    sent.value = true;
  } catch {
    errorMessage.value = t("auth.forgotPassword.resetError");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: var(--auth-soft);
  color: var(--auth-green);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
