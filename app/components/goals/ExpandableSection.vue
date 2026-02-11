<template>
  <div class="expandable">
    <button
      class="expandable-trigger"
      @click="toggle"
    >
      <slot name="trigger">
        <span class="expandable-title">{{ title }}</span>
      </slot>
      <Icon
        name="lucide:chevron-down"
        :class="['expandable-icon', { rotated: isOpen }]"
        size="18"
      />
    </button>
    <Transition
      name="expand"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div
        v-if="isOpen"
        class="expandable-content"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  defaultOpen?: boolean;
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  defaultOpen: false,
  modelValue: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const internalOpen = ref(props.defaultOpen);

const isOpen = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalOpen.value),
  set: (val: boolean) => {
    internalOpen.value = val;
    emit("update:modelValue", val);
  },
});

const toggle = () => {
  isOpen.value = !isOpen.value;
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
</script>

<style scoped>
.expandable-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
}

.expandable-title {
  font-size: 14px;
  font-weight: 600;
}

.expandable-icon {
  color: var(--color-text-secondary);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.expandable-icon.rotated {
  transform: rotate(180deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

.expandable-content {
  padding-top: var(--spacing-sm);
}
</style>
