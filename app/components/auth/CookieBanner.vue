<template>
  <Teleport to="body">
    <div
      v-if="!hasConsent"
      class="cookie-backdrop"
      aria-modal="true"
      role="dialog"
      :aria-label="$t('cookieBanner.title')"
    >
      <div class="cookie-card">
        <div class="cookie-icon">
          <Icon
            name="lucide:cookie"
            size="28"
          />
        </div>
        <h2 class="cookie-title">{{ $t("cookieBanner.title") }}</h2>
        <p class="cookie-body">
          {{ $t("cookieBanner.description") }}
          <NuxtLink
            to="/terms/cookies"
            target="_blank"
            class="cookie-link"
          >{{ $t("cookieBanner.policyLink") }}</NuxtLink>.
        </p>
        <div class="cookie-actions">
          <button
            class="cookie-btn secondary"
            @click="acceptRequired"
          >
            {{ $t("cookieBanner.acceptRequired") }}
          </button>
          <button
            class="cookie-btn primary"
            @click="acceptAll"
          >
            {{ $t("cookieBanner.acceptAll") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { hasConsent, acceptRequired, acceptAll } = useCookieConsent();
</script>

<style scoped>
.cookie-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: rgba(16, 32, 28, 0.6);
  backdrop-filter: blur(2px);
}

.cookie-card {
  width: 100%;
  max-width: 540px;
  margin-bottom: 8px;
  padding: 24px;
  border-radius: 20px;
  background: #fff;
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-primary-dark);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.cookie-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(111, 175, 142, 0.14);
  color: var(--color-primary-dark);
  margin-bottom: 16px;
}

.cookie-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.cookie-body {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.cookie-link {
  color: var(--color-primary-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cookie-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cookie-btn {
  flex: 1 1 140px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cookie-btn.secondary {
  background: transparent;
  border: 1.5px solid var(--color-primary-dark);
  color: var(--color-primary-dark);
}

.cookie-btn.secondary:hover {
  background: rgba(47, 107, 82, 0.07);
}

.cookie-btn.primary {
  background: var(--color-primary-dark);
  color: #fff;
}

.cookie-btn.primary:hover {
  background: var(--color-primary);
}

@media (min-width: 768px) {
  .cookie-backdrop {
    align-items: flex-end;
    padding: 24px;
  }
}
</style>
