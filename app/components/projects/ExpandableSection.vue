<template>
  <div class="expandable-section">
    <button
      class="expandable-header"
      :class="{ expanded: isExpanded }"
      :style="headerStyle"
      @click="toggle"
    >
      <Icon
        name="lucide:chevron-right"
        class="expand-icon"
        :class="{ rotated: isExpanded }"
        size="16"
      />
      <slot name="header" />
    </button>

    <Transition
      name="expand"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div
        v-if="isExpanded"
        class="expandable-content"
        :style="{ paddingLeft: `${indent}px` }"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  expanded?: boolean;
  indent?: number;
  headerStyle?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  indent: 24,
  headerStyle: () => ({}),
});

const emit = defineEmits<{
  toggle: [expanded: boolean];
}>();

const isExpanded = ref(props.expanded);

watch(
  () => props.expanded,
  (val) => {
    isExpanded.value = val;
  },
);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
  emit("toggle", isExpanded.value);
};

const onEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "0";
  element.style.overflow = "hidden";
  element.offsetHeight;
  element.style.height = `${element.scrollHeight}px`;
};

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "";
  element.style.overflow = "";
};

const onLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = `${element.scrollHeight}px`;
  element.style.overflow = "hidden";
  element.offsetHeight;
  element.style.height = "0";
};

defineExpose({ isExpanded, toggle });
</script>

<style scoped>
.expandable-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-xs);
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
  text-align: left;
  color: var(--color-text-primary);
}

.expandable-header:hover {
  background: var(--color-background);
}

.expand-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}

.expand-icon.rotated {
  transform: rotate(90deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: height 0.25s ease, opacity 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

.expandable-content {
  transition: height 0.25s ease, opacity 0.2s ease;
}
</style>
