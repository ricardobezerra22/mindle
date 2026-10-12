<template>
  <svg
    viewBox="0 0 96 96"
    :width="size"
    :height="size"
    aria-hidden="true"
  >
    <rect
      width="96"
      height="96"
      rx="28"
      fill="#2F6B52"
    />
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
      :class="{ hop: animated }"
      cx="68"
      cy="21"
      r="6.5"
      fill="#F4A261"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number;
  animated?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 48,
  animated: false,
});
</script>

<style scoped>
.hop {
  animation: spark-hop 7s ease-in-out infinite alternate;
}

@keyframes spark-hop {
  0%,
  18% {
    transform: translate(-40px, 0);
  }
  24% {
    transform: translate(-30px, -10px);
  }
  30%,
  48% {
    transform: translate(-20px, 0);
  }
  54% {
    transform: translate(-10px, -10px);
  }
  60%,
  100% {
    transform: translate(0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hop {
    animation: none;
  }
}
</style>
