<template>
  <div class="mood-selector">
    <h2 class="section-title">
      {{ $t('mood.question') }}
    </h2>
    <div class="mood-options">
      <button
        v-for="option in moodOptions"
        :key="option.value"
        :class="['mood-btn', { selected: modelValue === option.value }]"
        @click="emit('update:modelValue', option.value)"
      >
        <Icon :name="option.icon" />
        <span>{{ option.label }}</span>
      </button>
    </div>
    <p
      v-if="modelValue"
      class="mood-feedback"
    >
      {{ $t('mood.thanks') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Mood } from "~/types";

interface Props {
  modelValue: Mood | null;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: Mood];
}>();

const { t } = useI18n();

const moodOptions = computed(() => [
  { value: Mood.HAPPY, label: t("mood.options.happy"), icon: "lucide:smile" },
  { value: Mood.CALMLY, label: t("mood.options.calmly"), icon: "lucide:cloud-sun" },
  { value: Mood.OK, label: t("mood.options.ok"), icon: "lucide:meh" },
  { value: Mood.SAD, label: t("mood.options.sad"), icon: "lucide:cloud-rain" },
  { value: Mood.TIRED, label: t("mood.options.tired"), icon: "lucide:moon" },
  { value: Mood.OVERWHELMED, label: t("mood.options.overwhelmed"), icon: "lucide:zap" },
]);
</script>

<style scoped>
.mood-selector {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.mood-btn {
  padding: var(--spacing-md) var(--spacing-sm);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.mood-btn :deep(svg) {
  width: 28px;
  height: 28px;
  color: var(--color-text-secondary);
}

.mood-btn span {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.mood-btn:hover {
  border-color: var(--color-primary);
}

.mood-btn.selected {
  border-color: var(--color-primary);
  background: #e8f3ed;
}

.mood-btn.selected :deep(svg),
.mood-btn.selected span {
  color: var(--color-primary-dark);
}

.mood-feedback {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .mood-options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
