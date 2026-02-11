<template>
  <div
    :class="['skeleton', variant]"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
interface Props {
  variant?: 'line' | 'circle' | 'rect'
  width?: string
  height?: string
  radius?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'line',
  width: undefined,
  height: undefined,
  radius: undefined,
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  if (props.radius) style.borderRadius = props.radius
  return style
})
</script>

<style scoped>
.skeleton {
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.skeleton.line {
  height: 14px;
  border-radius: var(--radius-sm);
  width: 100%;
}

.skeleton.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton.rect {
  width: 100%;
  height: 120px;
  border-radius: var(--radius-md);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
