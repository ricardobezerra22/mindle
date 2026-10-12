<template>
  <div
    class="backdrop"
    aria-hidden="true"
  >
    <div class="blob blob-green" />
    <div class="blob blob-sand" />
    <div
      v-if="!compact"
      class="blob blob-teal"
    />
    <span
      v-for="(mote, i) in motes"
      :key="i"
      class="mote"
      :style="{
        left: mote.left,
        top: mote.top,
        width: mote.size,
        height: mote.size,
        background: mote.color,
        animationDelay: mote.delay,
        animationDuration: mote.duration,
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const fullMotes = [
  { left: "8%", top: "78%", size: "5px", color: "#A8D5BA", delay: "0s", duration: "14s" },
  { left: "22%", top: "90%", size: "4px", color: "#F4A261", delay: "3s", duration: "17s" },
  { left: "37%", top: "84%", size: "6px", color: "#A8D5BA", delay: "6s", duration: "14s" },
  { left: "52%", top: "92%", size: "4px", color: "#EAF3EE", delay: "1.5s", duration: "16s" },
  { left: "66%", top: "80%", size: "5px", color: "#A8D5BA", delay: "8s", duration: "14s" },
  { left: "79%", top: "88%", size: "4px", color: "#F4A261", delay: "4.5s", duration: "18s" },
  { left: "91%", top: "76%", size: "6px", color: "#EAF3EE", delay: "10s", duration: "14s" },
];

const compactMotes = [
  { left: "12%", top: "82%", size: "5px", color: "#A8D5BA", delay: "0s", duration: "13s" },
  { left: "34%", top: "92%", size: "4px", color: "#F4A261", delay: "4s", duration: "13s" },
  { left: "58%", top: "86%", size: "6px", color: "#A8D5BA", delay: "7s", duration: "13s" },
  { left: "80%", top: "90%", size: "4px", color: "#EAF3EE", delay: "2s", duration: "13s" },
  { left: "90%", top: "78%", size: "5px", color: "#A8D5BA", delay: "9s", duration: "13s" },
];

const motes = computed(() => (props.compact ? compactMotes : fullMotes));
</script>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
}

.blob-green {
  left: -160px;
  top: -120px;
  width: 720px;
  height: 720px;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(111, 168, 134, 0.5),
    rgba(111, 168, 134, 0) 66%
  );
  animation: drift-a 26s ease-in-out infinite alternate;
}

.blob-sand {
  right: -200px;
  bottom: -220px;
  width: 760px;
  height: 760px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(244, 162, 97, 0.2),
    rgba(244, 162, 97, 0) 65%
  );
  animation: drift-b 32s ease-in-out infinite alternate;
}

.blob-teal {
  left: 30%;
  bottom: -260px;
  width: 680px;
  height: 680px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(74, 140, 150, 0.32),
    rgba(74, 140, 150, 0) 66%
  );
  animation: drift-a 38s ease-in-out infinite alternate-reverse;
}

.mote {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  animation: mote 14s ease-in-out infinite;
}

@keyframes drift-a {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(90px, 60px) scale(1.18);
  }
}

@keyframes drift-b {
  from {
    transform: translate(0, 0) scale(1.1);
  }
  to {
    transform: translate(-100px, 50px) scale(0.94);
  }
}

@keyframes mote {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  15% {
    opacity: 0.7;
  }
  85% {
    opacity: 0.45;
  }
  100% {
    transform: translateY(-160px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob,
  .mote {
    animation: none;
  }

  .mote {
    opacity: 0;
  }
}
</style>
