<template>
  <div
    ref="wrapper"
    :class="['google-wrapper', { busy: loading }]"
  >
    <div
      class="google-visual"
      aria-hidden="true"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <template v-if="loading">
        <Icon
          name="lucide:loader-2"
          size="20"
          class="spinning"
        />
        {{ loadingLabel }}
      </template>
      <template v-else>
        {{ label }}
      </template>
    </div>
    <div class="google-overlay">
      <div
        ref="googleButtonContainer"
        class="google-gsi"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGoogleAuth } from "@/composables/useGoogleAuth";

interface Props {
  label: string;
  loadingLabel: string;
  mode?: "signin" | "signup";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "signin",
  loading: false,
});

const emit = defineEmits<{
  success: [credential: string];
}>();

const wrapper = ref<HTMLElement | null>(null);
const { googleButtonContainer, initializeGoogleButton } = useGoogleAuth();

onMounted(() => {
  const width = Math.min(400, Math.max(200, wrapper.value?.clientWidth ?? 320));
  initializeGoogleButton(
    googleButtonContainer,
    (response: { credential: string }) => emit("success", response.credential),
    {
      text: props.mode === "signup" ? "signup_with" : "continue_with",
      theme: "outline",
      size: "large",
      shape: "rectangular",
      width,
    },
  );
});
</script>

<style scoped>
.google-wrapper {
  position: relative;
  width: 100%;
  height: 56px;
}

.google-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid var(--auth-line);
  border-radius: 16px;
  background: #ffffff;
  color: var(--auth-ink);
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.google-wrapper:hover .google-visual,
.google-wrapper:focus-within .google-visual {
  border-color: var(--auth-line-hover);
  background: #f4f9f6;
}

.google-wrapper:focus-within .google-visual {
  outline: 3px solid var(--auth-sand);
  outline-offset: 3px;
}

.google-overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 16px;
  opacity: 0.01;
}

.google-gsi {
  width: 100%;
  height: 40px;
  transform: scaleY(1.4);
  transform-origin: top left;
}

.busy .google-overlay {
  pointer-events: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .google-visual,
  .spinning {
    transition: none;
    animation: none;
  }
}
</style>
