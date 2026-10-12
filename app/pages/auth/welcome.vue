<template>
  <div class="welcome auth-theme">
    <AuthBackdrop compact />

    <main class="screen">
      <header class="top">
        <button
          v-if="step === 2"
          type="button"
          class="back"
          :aria-label="$t('auth.back')"
          :title="$t('auth.back')"
          @click="step = 1"
        >
          <Icon
            name="lucide:arrow-left"
            size="24"
          />
        </button>
        <AuthLogo :size="34" />
        <span class="brand">Mindle</span>
        <AuthLocaleSwitch class="locale-slot" />
      </header>

      <template v-if="step === 1">
        <div class="orb-block">
          <svg
            viewBox="0 0 300 300"
            width="300"
            height="300"
            role="img"
            :aria-label="$t('auth.welcome.orbLabel')"
          >
            <defs>
              <radialGradient
                id="wOrb"
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
                id="wHalo"
                cx="0.5"
                cy="0.5"
                r="0.5"
              >
                <stop
                  offset="0"
                  stop-color="#A8D5BA"
                  stop-opacity="0.34"
                />
                <stop
                  offset="1"
                  stop-color="#A8D5BA"
                  stop-opacity="0"
                />
              </radialGradient>
            </defs>
            <circle
              class="breathe"
              cx="150"
              cy="150"
              r="148"
              fill="url(#wHalo)"
            />
            <circle
              class="ripple"
              cx="150"
              cy="150"
              r="90"
              fill="none"
              stroke="#A8D5BA"
              stroke-width="2"
            />
            <circle
              class="ripple r2"
              cx="150"
              cy="150"
              r="90"
              fill="none"
              stroke="#A8D5BA"
              stroke-width="2"
            />
            <g class="breathe">
              <circle
                cx="150"
                cy="150"
                r="88"
                fill="url(#wOrb)"
              />
              <g transform="translate(68.4 61.6) scale(1.7)">
                <g
                  fill="none"
                  stroke="#F4F7F4"
                  stroke-width="9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    class="draw"
                    pathLength="1"
                    d="M28 68 V46 C28 34 48 34 48 46 V68"
                  />
                  <path
                    class="draw d2"
                    pathLength="1"
                    d="M48 46 C48 34 68 34 68 46 V68"
                  />
                </g>
                <g class="hop">
                  <circle
                    class="pop"
                    cx="68"
                    cy="21"
                    r="6.5"
                    fill="#F4A261"
                  />
                </g>
              </g>
            </g>
          </svg>
          <div
            class="breath-text"
            aria-hidden="true"
          >
            <span class="btxt in">{{ $t("auth.welcome.breatheIn") }}</span>
            <span class="btxt out">{{ $t("auth.welcome.breatheOut") }}</span>
          </div>
        </div>

        <div class="copy">
          <h1 class="rise s1">
            {{ $t("auth.welcome.title1") }}
            <span class="accent">{{ $t("auth.welcome.title2") }}</span>
          </h1>
          <p class="rise s2">
            {{ $t("auth.welcome.subtitle") }}
          </p>
        </div>

        <div class="actions rise s3">
          <button
            type="button"
            class="cta"
            @click="step = 2"
          >
            {{ $t("auth.welcome.start") }}
            <Icon
              name="lucide:arrow-right"
              size="20"
            />
          </button>
          <div class="dots">
            <span class="sr-only">{{ $t("auth.welcome.step1") }}</span>
            <span
              class="dot on"
              aria-hidden="true"
            />
            <span
              class="dot"
              aria-hidden="true"
            />
          </div>
          <NuxtLink
            to="/auth/login"
            class="login-link"
            @click="finish"
          >
            {{ $t("auth.welcome.haveAccount") }}
          </NuxtLink>
        </div>
      </template>

      <template v-else>
        <h1 class="split-title">
          {{ $t("auth.welcome.splitTitle1") }}
          <span class="accent">{{ $t("auth.welcome.splitTitle2") }}</span>
        </h1>

        <svg
          class="split-scene"
          viewBox="0 0 342 330"
          role="img"
          :aria-label="$t('auth.welcome.splitLabel')"
        >
          <g
            fill="none"
            stroke="rgba(168,213,186,0.55)"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path
              class="a-conn"
              pathLength="1"
              d="M56 62 V126 Q56 134 64 134 H92"
            />
            <path
              class="a-conn"
              pathLength="1"
              d="M56 62 V202 Q56 210 64 210 H92"
            />
            <path
              class="a-conn"
              pathLength="1"
              d="M56 62 V278 Q56 286 64 286 H92"
            />
          </g>

          <g class="a-big">
            <rect
              x="40"
              y="6"
              width="262"
              height="56"
              rx="28"
              fill="rgba(234,243,238,0.12)"
              stroke="#A8D5BA"
              stroke-width="1.5"
            />
            <text
              x="171"
              y="40"
              text-anchor="middle"
              font-size="17"
              font-weight="500"
              fill="#F4F7F4"
            >{{ $t("auth.welcome.bigTask") }}</text>
          </g>

          <g class="a-c1">
            <rect
              x="92"
              y="106"
              width="246"
              height="56"
              rx="28"
              fill="rgba(234,243,238,0.07)"
              stroke="rgba(168,213,186,0.35)"
              stroke-width="1.5"
            />
            <circle
              cx="118"
              cy="134"
              r="11"
              fill="none"
              stroke="#A8D5BA"
              stroke-width="2"
            />
            <circle
              class="a-fill"
              cx="118"
              cy="134"
              r="11"
              fill="#F4A261"
            />
            <path
              class="a-tick"
              pathLength="1"
              d="M112.5 134.2 L116.6 138.3 L124 130"
              fill="none"
              stroke="#10201C"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <text
              x="142"
              y="139.5"
              font-size="15"
              fill="#EAF3EE"
            >{{ $t("auth.welcome.task1") }}</text>
            <rect
              class="a-ring"
              x="89"
              y="103"
              width="252"
              height="62"
              rx="31"
              fill="none"
              stroke="#F4A261"
              stroke-width="3"
            />
          </g>

          <g class="a-c2">
            <g class="a-dim">
              <rect
                x="92"
                y="182"
                width="246"
                height="56"
                rx="28"
                fill="rgba(234,243,238,0.07)"
                stroke="rgba(168,213,186,0.35)"
                stroke-width="1.5"
              />
              <circle
                cx="118"
                cy="210"
                r="11"
                fill="none"
                stroke="#A8D5BA"
                stroke-width="2"
              />
              <text
                x="142"
                y="215.5"
                font-size="15"
                fill="#EAF3EE"
              >{{ $t("auth.welcome.task2") }}</text>
            </g>
          </g>

          <g class="a-c3">
            <g class="a-dim">
              <rect
                x="92"
                y="258"
                width="246"
                height="56"
                rx="28"
                fill="rgba(234,243,238,0.07)"
                stroke="rgba(168,213,186,0.35)"
                stroke-width="1.5"
              />
              <circle
                cx="118"
                cy="286"
                r="11"
                fill="none"
                stroke="#A8D5BA"
                stroke-width="2"
              />
              <text
                x="142"
                y="291.5"
                font-size="15"
                fill="#EAF3EE"
              >{{ $t("auth.welcome.task3") }}</text>
            </g>
          </g>
        </svg>

        <div
          class="captions"
          aria-hidden="true"
        >
          <span class="cap cap0">{{ $t("auth.welcome.cap0") }}</span>
          <span class="cap cap1">{{ $t("auth.welcome.cap1") }}</span>
          <span class="cap cap2">{{ $t("auth.welcome.cap2") }}</span>
        </div>

        <div class="actions">
          <NuxtLink
            to="/auth/register"
            class="cta"
            @click="finish"
          >
            {{ $t("auth.welcome.createFirst") }}
          </NuxtLink>
          <div class="dots">
            <span class="sr-only">{{ $t("auth.welcome.step2") }}</span>
            <span
              class="dot"
              aria-hidden="true"
            />
            <span
              class="dot on"
              aria-hidden="true"
            />
          </div>
          <NuxtLink
            to="/auth/login"
            class="login-link"
            @click="finish"
          >
            {{ $t("auth.welcome.haveAccount") }}
          </NuxtLink>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const step = ref<1 | 2>(1);
const onboarded = useCookie("mindle_onboarded", {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
});

const finish = () => {
  onboarded.value = "1";
};
</script>

<style scoped>
.welcome {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--auth-bg);
  color: var(--auth-soft);
  font-family: var(--auth-font);
}

.screen {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 28px 24px 32px;
}

.top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.locale-slot {
  margin-left: auto;
}

.brand {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--auth-light);
}

.back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: -10px;
  margin-right: -4px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--auth-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back:hover {
  background: rgba(234, 243, 238, 0.1);
}

.back:focus-visible,
.cta:focus-visible,
.login-link:focus-visible {
  outline: 3px solid var(--auth-soft);
  outline-offset: 3px;
}

.orb-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.orb-block svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.breath-text {
  position: relative;
  width: 200px;
  height: 28px;
  margin-top: 6px;
  font-size: 18px;
  font-weight: 300;
  color: var(--auth-mint);
}

.btxt {
  position: absolute;
  inset: 0 0 auto;
  text-align: center;
  opacity: 0;
  animation: btxt 8s ease-in-out infinite;
}

.btxt.in {
  opacity: 1;
}

.btxt.out {
  animation-delay: 4s;
}

.copy {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}

.copy h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--auth-light);
}

.accent {
  display: block;
  color: var(--auth-mint);
}

.copy p {
  max-width: 300px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.6;
  font-weight: 300;
  color: var(--auth-pale);
}

.actions {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  border: 0;
  border-radius: 20px;
  background: var(--auth-sand);
  color: var(--auth-bg);
  font-family: inherit;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(244, 162, 97, 0.28);
  transition: all 0.2s ease;
}

.cta:hover {
  background: var(--auth-sand-light);
  transform: translateY(-1px);
}

.cta:active {
  transform: translateY(1px);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(234, 243, 238, 0.3);
}

.dot.on {
  width: 28px;
  background: var(--auth-sand);
}

.login-link {
  align-self: center;
  padding: 4px 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--auth-mint);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: all 0.2s ease;
}

.login-link:hover {
  color: var(--auth-light);
}

.split-title {
  margin: 28px 0 0;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--auth-light);
}

.split-scene {
  display: block;
  width: 100%;
  max-width: 342px;
  height: auto;
  margin-top: 22px;
}

.captions {
  position: relative;
  height: 28px;
  margin-top: 14px;
  font-size: 18px;
}

.cap {
  position: absolute;
  inset: 0 0 auto;
  opacity: 0;
}

.cap0 {
  opacity: 1;
  color: var(--auth-soft);
  animation: cap0 12s ease-in-out infinite;
}

.cap1 {
  color: var(--auth-sand);
  font-weight: 500;
  animation: cap1 12s ease-in-out infinite;
}

.cap2 {
  color: var(--auth-mint);
  animation: cap2 12s ease-in-out infinite;
}

.split-scene + .captions + .actions {
  margin-top: auto;
}

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

.draw {
  stroke-dasharray: 1;
  animation: draw 1.3s ease-out 0.4s both;
}

.draw.d2 {
  animation-delay: 1.1s;
}

.pop {
  transform-box: fill-box;
  transform-origin: center;
  animation: pop 0.6s cubic-bezier(0.3, 1.6, 0.5, 1) 1.9s both;
}

.hop {
  animation: spark-hop 8s ease-in-out 3s infinite alternate;
}

.rise {
  animation: rise 0.9s ease-out both;
}

.rise.s1 {
  animation-delay: 0.5s;
}

.rise.s2 {
  animation-delay: 0.8s;
}

.rise.s3 {
  animation-delay: 1.1s;
}

.a-big {
  animation: big-in 12s ease-out infinite;
}

.a-conn {
  stroke-dasharray: 1;
  animation: conn 12s ease-in-out infinite;
}

.a-c1 {
  transform-box: fill-box;
  animation: pop-a 12s ease-out infinite;
}

.a-c2 {
  transform-box: fill-box;
  animation: pop-b 12s ease-out infinite;
}

.a-c3 {
  transform-box: fill-box;
  animation: pop-c 12s ease-out infinite;
}

.a-dim {
  animation: dim 12s ease-in-out infinite;
}

.a-ring {
  transform-box: fill-box;
  transform-origin: center;
  animation: ring-a 12s ease-in-out infinite;
}

.a-fill {
  transform-box: fill-box;
  transform-origin: center;
  animation: tick-fill 12s ease-out infinite;
}

.a-tick {
  stroke-dasharray: 1;
  animation: tick 12s ease-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.09);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}

@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spark-hop {
  0%,
  18% {
    transform: translate(0, 0);
  }
  24% {
    transform: translate(-10px, -12px);
  }
  30%,
  48% {
    transform: translate(-20px, 0);
  }
  54% {
    transform: translate(-30px, -12px);
  }
  60%,
  100% {
    transform: translate(-40px, 0);
  }
}

@keyframes btxt {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  6%,
  44% {
    opacity: 1;
    transform: translateY(0);
  }
  50%,
  100% {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes big-in {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  5%,
  92% {
    opacity: 1;
    transform: translateY(0);
  }
  98%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
}

@keyframes conn {
  0%,
  12% {
    stroke-dashoffset: 1;
    opacity: 1;
  }
  26%,
  92% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  98%,
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes pop-a {
  0%,
  22% {
    opacity: 0;
    transform: translateY(-12px) scale(0.94);
  }
  30%,
  92% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  98%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
}

@keyframes pop-b {
  0%,
  27% {
    opacity: 0;
    transform: translateY(-12px) scale(0.94);
  }
  35%,
  92% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  98%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
}

@keyframes pop-c {
  0%,
  32% {
    opacity: 0;
    transform: translateY(-12px) scale(0.94);
  }
  40%,
  92% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  98%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
}

@keyframes dim {
  0%,
  48% {
    opacity: 1;
  }
  54%,
  80% {
    opacity: 0.28;
  }
  88%,
  100% {
    opacity: 1;
  }
}

@keyframes ring-a {
  0%,
  48% {
    opacity: 0;
    transform: scale(0.96);
  }
  54%,
  76% {
    opacity: 1;
    transform: scale(1);
  }
  82%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes tick-fill {
  0%,
  64% {
    opacity: 0;
    transform: scale(0.4);
  }
  69%,
  92% {
    opacity: 1;
    transform: scale(1);
  }
  98%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes tick {
  0%,
  68% {
    stroke-dashoffset: 1;
    opacity: 1;
  }
  74%,
  92% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  98%,
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes cap0 {
  0% {
    opacity: 0;
  }
  6%,
  44% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@keyframes cap1 {
  0%,
  50% {
    opacity: 0;
  }
  56%,
  76% {
    opacity: 1;
  }
  82%,
  100% {
    opacity: 0;
  }
}

@keyframes cap2 {
  0%,
  80% {
    opacity: 0;
  }
  86%,
  94% {
    opacity: 1;
  }
  99%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .btxt,
  .breathe,
  .ripple,
  .draw,
  .pop,
  .hop,
  .rise,
  .a-big,
  .a-conn,
  .a-c1,
  .a-c2,
  .a-c3,
  .a-dim,
  .a-ring,
  .a-fill,
  .a-tick,
  .cap0,
  .cap1,
  .cap2 {
    animation: none;
  }

  .ripple,
  .a-ring,
  .a-fill,
  .a-tick,
  .btxt.out,
  .cap1,
  .cap2 {
    opacity: 0;
  }

  .a-conn {
    stroke-dashoffset: 0;
  }
}
</style>
