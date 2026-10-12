<template>
  <div
    class="locale-switch"
    role="group"
    :aria-label="$t('auth.language')"
  >
    <button
      v-for="option in options"
      :key="option.code"
      type="button"
      :lang="option.code"
      :title="option.name"
      :aria-pressed="locale === option.code"
      :class="['locale-btn', { active: locale === option.code }]"
      @click="setLocale(option.code)"
    >
      {{ option.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();

const options = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
] as const;
</script>

<style scoped>
.locale-switch {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--auth-soft) 28%, transparent);
  background: color-mix(in srgb, var(--auth-soft) 8%, transparent);
  backdrop-filter: blur(8px);
}

.locale-btn {
  min-width: 44px;
  height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--auth-soft);
  font-family: var(--auth-font);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.locale-btn:hover:not(.active) {
  background: color-mix(in srgb, var(--auth-soft) 14%, transparent);
}

.locale-btn.active {
  background: var(--auth-soft);
  color: var(--auth-bg);
}

.locale-btn:focus-visible {
  outline: 3px solid var(--auth-sand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .locale-btn {
    transition: none;
  }
}
</style>
