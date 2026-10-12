<template>
  <div :class="['auth-layout', 'auth-theme', { 'palette-classic': preferences.palette === 'classic' }]">
    <AuthBackdrop />

    <section class="hero">
      <div class="brand">
        <AuthLogo
          :size="48"
          animated
        />
        <span class="brand-name">Mindle</span>
      </div>

      <h1 class="headline">
        {{ $t("auth.hero.headlineTop") }}
        <span class="headline-accent">{{
          $t("auth.hero.headlineAccent")
        }}</span>
      </h1>

      <p class="hero-body">
        {{ $t("auth.hero.body") }}
      </p>

      <div class="phrases">
        <span class="phrase p1"><i class="dot" />{{ $t("auth.hero.phrase1") }}</span>
        <span class="phrase p2"><i class="dot" />{{ $t("auth.hero.phrase2") }}</span>
        <span class="phrase p3"><i class="dot" />{{ $t("auth.hero.phrase3") }}</span>
      </div>

      <svg
        class="scene"
        viewBox="0 0 460 360"
        role="img"
        :aria-label="$t('auth.hero.sceneLabel')"
      >
        <defs>
          <radialGradient
            id="orbGrad"
            cx="0.35"
            cy="0.3"
            r="0.9"
          >
            <stop
              offset="0"
              stop-color="#A8D5BA"
            />
            <stop
              offset="0.55"
              stop-color="#4E8F73"
            />
            <stop
              offset="1"
              stop-color="#2F6B52"
            />
          </radialGradient>
          <radialGradient
            id="haloGrad"
            cx="0.5"
            cy="0.5"
            r="0.5"
          >
            <stop
              offset="0"
              stop-color="#A8D5BA"
              stop-opacity="0.38"
            />
            <stop
              offset="1"
              stop-color="#A8D5BA"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>

        <circle
          class="halo"
          cx="230"
          cy="180"
          r="150"
          fill="url(#haloGrad)"
        />
        <circle
          class="ripple"
          cx="230"
          cy="180"
          r="92"
          fill="none"
          stroke="#A8D5BA"
          stroke-width="2"
        />
        <circle
          class="ripple r2"
          cx="230"
          cy="180"
          r="92"
          fill="none"
          stroke="#A8D5BA"
          stroke-width="2"
        />

        <g class="spin">
          <circle
            cx="230"
            cy="180"
            r="130"
            fill="none"
            stroke="rgba(168,213,186,0.28)"
            stroke-width="2"
            stroke-dasharray="2 9"
            stroke-linecap="round"
          />
          <circle
            cx="360"
            cy="180"
            r="9"
            fill="#A8D5BA"
          />
          <circle
            class="ping"
            cx="165"
            cy="67.4"
            r="11"
            fill="none"
            stroke="#F4A261"
            stroke-width="2"
          />
          <circle
            cx="165"
            cy="67.4"
            r="11"
            fill="#F4A261"
          />
          <circle
            cx="165"
            cy="292.6"
            r="7"
            fill="#A8D5BA"
          />
        </g>

        <g class="spinr">
          <circle
            cx="230"
            cy="180"
            r="165"
            fill="none"
            stroke="rgba(168,213,186,0.18)"
            stroke-width="2"
            stroke-dasharray="2 11"
            stroke-linecap="round"
          />
          <circle
            cx="230"
            cy="15"
            r="6"
            fill="#A8D5BA"
          />
          <circle
            cx="372.9"
            cy="262.5"
            r="8"
            fill="#EAF3EE"
            fill-opacity="0.85"
          />
          <circle
            cx="87.1"
            cy="262.5"
            r="5"
            fill="#A8D5BA"
          />
        </g>

        <g class="breathe">
          <circle
            cx="230"
            cy="180"
            r="78"
            fill="url(#orbGrad)"
          />
          <g transform="translate(162.8 107.2) scale(1.4)">
            <g
              fill="none"
              stroke="#F4F7F4"
              stroke-width="9"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M28 68 V46 C28 34 48 34 48 46 V68" />
              <path d="M48 46 C48 34 68 34 68 46 V68" />
            </g>
            <circle
              cx="68"
              cy="21"
              r="6.5"
              fill="#F4A261"
            />
          </g>
        </g>
      </svg>
    </section>

    <section class="card">
      <slot />
      <div class="card-note">
        <i class="dot" />
        {{ $t("auth.progressSaved") }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { preferences } = usePreferences();

watchEffect(() => {
  const requested = route.query.palette;
  if (requested === "classic" || requested === "contrastful") {
    preferences.value.palette = requested;
  }
});
</script>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 32px 16px;
  background: var(--auth-bg);
  color: var(--auth-soft);
  font-family: var(--auth-font);
}

.hero {
  position: relative;
  z-index: 1;
  flex: 1 1 420px;
  max-width: 600px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-name {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--auth-light);
}

.headline {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 58px);
  line-height: 1.08;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--auth-light);
}

.headline-accent {
  display: block;
  color: var(--auth-mint);
}

.hero-body {
  margin: 0;
  max-width: 440px;
  font-size: 18px;
  line-height: 1.65;
  font-weight: 300;
  color: var(--auth-pale);
}

.phrases {
  position: relative;
  height: 30px;
}

.phrase {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: var(--auth-soft);
  opacity: 0;
  animation: phrase 12s ease-in-out infinite;
}

.phrase.p1 {
  opacity: 1;
}

.phrase.p2 {
  animation-delay: 4s;
}

.phrase.p3 {
  animation-delay: 8s;
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--auth-sand);
}

.scene {
  display: block;
  width: 100%;
  max-width: 460px;
  height: auto;
}

.halo,
.breathe {
  transform-box: fill-box;
  transform-origin: center;
  animation: breathe 8s ease-in-out infinite;
}

.ripple {
  transform-box: fill-box;
  transform-origin: center;
  animation: ripple 8s ease-out infinite;
}

.ripple.r2 {
  animation-delay: 4s;
}

.spin {
  transform-box: view-box;
  transform-origin: 230px 180px;
  animation: spin 70s linear infinite;
}

.spinr {
  transform-box: view-box;
  transform-origin: 230px 180px;
  animation: spin-reverse 110s linear infinite;
}

.ping {
  transform-box: fill-box;
  transform-origin: center;
  animation: ping 3s ease-out infinite;
}

.card {
  position: relative;
  z-index: 1;
  flex: 1 1 380px;
  max-width: 440px;
  min-width: 0;
  box-sizing: border-box;
  padding: 28px 20px;
  border-radius: 32px;
  background: var(--auth-card);
  color: var(--auth-ink);
  box-shadow: var(--auth-card-shadow);
}

.card-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #e1ece6;
  font-size: 14px;
  color: var(--auth-muted);
}

.card :deep(.auth-title) {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.card :deep(.auth-subtitle) {
  margin: 8px 0 28px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--auth-muted);
}

.card :deep(.alert) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--auth-error-line);
  background: var(--auth-error-bg);
  color: var(--auth-error);
  font-size: 14px;
}

.card :deep(.auth-form) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card :deep(.form-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.card :deep(.checkbox-label) {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--auth-muted);
  cursor: pointer;
}

.card :deep(.checkbox-label input) {
  width: 20px;
  height: 20px;
  margin: 0;
  accent-color: var(--auth-green);
  cursor: pointer;
}

.card :deep(.auth-link) {
  font-size: 15px;
  font-weight: 500;
  color: var(--auth-green);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: all 0.2s ease;
}

.card :deep(.auth-link:hover) {
  color: var(--auth-green-dark);
}

.card :deep(.auth-link:focus-visible),
.card :deep(.checkbox-label input:focus-visible) {
  outline: 3px solid var(--auth-sand);
  outline-offset: 3px;
}

.card :deep(.auth-link.strong) {
  font-weight: 600;
}

.card :deep(.divider) {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 22px 0;
  font-size: 14px;
  color: var(--auth-muted);
}

.card :deep(.divider::before),
.card :deep(.divider::after) {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--auth-line);
}

.card :deep(.auth-footer) {
  margin: 24px 0 0;
  text-align: center;
  font-size: 15px;
  color: var(--auth-muted);
}

.card :deep(.auth-page-enter-active) {
  transition: all 0.45s ease-out;
}

.card :deep(.auth-page-leave-active) {
  transition: all 0.2s ease-in;
}

.card :deep(.auth-page-enter-from) {
  opacity: 0;
  transform: translateY(14px);
}

.card :deep(.auth-page-leave-to) {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes phrase {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  4%,
  28% {
    opacity: 1;
    transform: translateY(0);
  }
  33%,
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.72);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

@media (max-width: 760px) {
  .scene {
    display: none;
  }
}

@media (min-width: 768px) {
  .auth-layout {
    gap: 56px;
    padding: 56px clamp(16px, 5vw, 72px);
  }

  .hero {
    gap: 28px;
  }

  .card {
    padding: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .phrase,
  .halo,
  .breathe,
  .ripple,
  .spin,
  .spinr,
  .ping {
    animation: none;
  }

  .ripple {
    opacity: 0;
  }

  .phrase:not(.p1) {
    display: none;
  }

  .card :deep(.auth-page-enter-active),
  .card :deep(.auth-page-leave-active) {
    transition: none;
  }
}
</style>
