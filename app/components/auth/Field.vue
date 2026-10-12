<template>
  <div class="field-group">
    <label
      :for="id"
      class="field-label"
    >
      {{ label }}
    </label>
    <div :class="['field', { invalid: !!error }]">
      <Icon
        :name="icon"
        size="22"
        class="field-icon"
      />
      <input
        :id="id"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="onInput"
        @blur="emit('blur')"
      />
      <button
        v-if="toggleable"
        type="button"
        class="eye"
        :aria-label="visible ? $t('auth.hidePassword') : $t('auth.showPassword')"
        :title="visible ? $t('auth.hidePassword') : $t('auth.showPassword')"
        @click="visible = !visible"
      >
        <Icon
          :name="visible ? 'lucide:eye-off' : 'lucide:eye'"
          size="22"
        />
      </button>
    </div>
    <span
      v-if="error"
      :id="`${id}-error`"
      class="field-error"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  modelValue: string;
  icon: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  toggleable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  autocomplete: "off",
  error: "",
  toggleable: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "blur": [];
  "input": [];
}>();

const visible = ref(false);

const inputType = computed(() =>
  props.toggleable && visible.value ? "text" : props.type,
);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
  emit("input");
};
</script>

<style scoped>
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--auth-ink);
}

.field {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  box-sizing: border-box;
  background: #ffffff;
  border: 2px solid var(--auth-line);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.field:hover {
  border-color: var(--auth-line-hover);
}

.field:focus-within {
  border-color: var(--auth-green);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--auth-green) 18%, transparent);
}

.field.invalid {
  border-color: var(--auth-error);
}

.field-icon {
  flex-shrink: 0;
  color: var(--auth-muted);
}

.field input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: 400 16px var(--auth-font);
  color: var(--auth-ink);
}

.field input::placeholder {
  color: #5f736a;
}

.eye {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--auth-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.eye:hover {
  background: var(--auth-soft);
}

.eye:focus-visible {
  outline: 3px solid var(--auth-sand);
  outline-offset: 2px;
}

.field-error {
  font-size: 13px;
  color: var(--auth-error);
}
</style>
