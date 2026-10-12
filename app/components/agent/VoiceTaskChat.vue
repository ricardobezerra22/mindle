<template>
  <div class="voice-chat-container">
    <Transition name="panel">
      <div
        v-if="open"
        class="voice-chat-panel"
      >
        <div class="panel-header">
          <span class="panel-title">{{ $t("voice.title") }}</span>
          <button
            class="close-btn"
            @click="closePanel"
          >
            <Icon
              name="i-heroicons-x-mark"
              size="16"
            />
          </button>
        </div>

        <div class="panel-body">
          <div
            v-if="state === 'idle' || state === 'listening'"
            class="listen-area"
          >
            <div
              v-if="transcript || interimTranscript"
              class="transcript-box"
            >
              <span>{{ transcript }}</span>
              <span class="interim">{{ interimTranscript }}</span>
            </div>
            <p
              v-else
              class="hint"
            >
              {{ $t("voice.hint") }}
            </p>
            <div class="textarea-header">
              <span class="textarea-label">{{ $t("voice.tasks") }}</span>
              <button
                class="copy-example-btn"
                :title="copied ? $t('voice.copied') : $t('voice.copyExample')"
                @click="copyExample"
              >
                <Icon
                  :name="
                    copied
                      ? 'i-heroicons-check'
                      : 'i-heroicons-clipboard-document'
                  "
                  size="12"
                />
                {{ copied ? $t("voice.copied") : $t("voice.copyExample") }}
              </button>
            </div>
            <textarea
              v-model="textInput"
              class="text-input"
              :placeholder="INPUT_PLACEHOLDER"
              rows="4"
            />
            <p
              v-if="error"
              class="mic-error"
            >
              {{ error }}
            </p>
          </div>

          <div
            v-else-if="state === 'processing' || state === 'confirming'"
            class="loading-area"
          >
            <div class="spinner" />
            <span>{{
              state === "processing"
                ? $t("voice.processing")
                : $t("voice.confirming")
            }}</span>
          </div>

          <div
            v-else-if="state === 'preview' && preview"
            class="preview-area"
          >
            <div
              v-if="error"
              class="preview-error"
            >
              <Icon
                name="i-heroicons-exclamation-triangle"
                size="13"
              />
              {{ error }}
            </div>
            <p class="summary">
              {{ preview.summary }}
            </p>
            <div class="task-list">
              <div
                v-for="(task, i) in previewTasks"
                :key="i"
                class="task-card"
              >
                <div class="task-card-header">
                  <span class="task-title">{{ task.title }}</span>
                  <span
                    :class="[
                      'priority-badge',
                      `priority-${task.priority.toLowerCase()}`,
                    ]"
                  >
                    {{ priorityLabel(task.priority) }}
                  </span>
                </div>
                <p
                  v-if="task.description"
                  class="task-desc"
                >
                  {{ task.description }}
                </p>
                <ul
                  v-if="task.subTasks && task.subTasks.length > 0"
                  class="subtask-list"
                >
                  <li
                    v-for="(st, si) in task.subTasks"
                    :key="si"
                  >
                    {{ st.title }}
                  </li>
                </ul>
                <div class="task-meta">
                  <span
                    v-if="task.categoryName"
                    :class="[
                      'category-chip',
                      { 'category-chip--new': !!task.proposedCategoryName },
                    ]"
                  >
                    <Icon
                      name="i-heroicons-tag"
                      size="11"
                    />
                    {{ task.categoryName }}
                    <span
                      v-if="task.proposedCategoryName"
                      class="new-badge"
                      >{{ $t("voice.newBadge") }}</span
                    >
                  </span>
                  <span
                    v-if="task.dueDate"
                    class="date-chip"
                  >
                    <Icon
                      name="i-heroicons-calendar"
                      size="11"
                    />
                    {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="newCategories.length > 0"
              class="new-categories-box"
            >
              <Icon
                name="i-heroicons-information-circle"
                size="13"
              />
              {{ $t("voice.categoriesToCreate") }}
              <strong>{{ newCategories.map((c) => c.name).join(", ") }}</strong>
            </div>
          </div>

          <div
            v-else-if="state === 'error'"
            class="error-area"
          >
            <Icon
              name="i-heroicons-exclamation-triangle"
              size="28"
              class="error-icon"
            />
            <p class="error-msg">
              {{ error }}
            </p>
          </div>

          <div
            v-else-if="state === 'done'"
            class="done-area"
          >
            <Icon
              name="i-heroicons-check-circle"
              size="32"
              class="done-icon"
            />
            <p>{{ $t("voice.tasksCreated", confirmedTasks.length) }}</p>
            <ul class="done-list">
              <li
                v-for="(t, i) in confirmedTasks"
                :key="i"
              >
                {{ t.title }}
              </li>
            </ul>
          </div>
        </div>

        <div class="panel-footer">
          <template v-if="state === 'error'">
            <button
              class="cancel-btn"
              @click="backToEdit"
            >
              <Icon
                name="i-heroicons-arrow-left"
                size="14"
              />
              {{ $t("voice.back") }}
            </button>
            <button
              class="reset-btn"
              @click="clearAll"
            >
              {{ $t("voice.clear") }}
            </button>
          </template>

          <template v-else-if="state === 'idle' || state === 'listening'">
            <button
              :class="['mic-btn-sm', { recording: state === 'listening' }]"
              @click="toggleMic"
            >
              <Icon
                :name="
                  state === 'listening'
                    ? 'i-heroicons-stop'
                    : 'i-heroicons-microphone'
                "
                size="16"
              />
              {{
                state === "listening" ? $t("voice.stop") : $t("voice.record")
              }}
            </button>
            <button
              v-if="activeInput"
              class="send-btn"
              @click="sendInput"
            >
              <Icon
                name="i-heroicons-paper-airplane"
                size="16"
              />
              {{ $t("voice.interpret") }}
            </button>
            <button
              v-if="activeInput"
              class="reset-btn"
              @click="clearAll"
            >
              {{ $t("voice.clear") }}
            </button>
          </template>

          <template v-else-if="state === 'preview' && preview">
            <button
              class="cancel-btn"
              @click="reset"
            >
              {{ $t("voice.cancel") }}
            </button>
            <button
              class="confirm-btn"
              @click="confirm(previewTasks, newCategories)"
            >
              <Icon
                name="i-heroicons-check"
                size="16"
              />
              {{ $t("voice.confirm", previewTasks.length) }}
            </button>
          </template>

          <template v-else-if="state === 'done'">
            <button
              class="send-btn"
              @click="reset"
            >
              {{ $t("voice.newTask") }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
    <div class="tab-fab">
      <button
        :class="[
          'fab',
          {
            recording: state === 'listening',
            processing: state === 'processing' || state === 'confirming',
          },
        ]"
        :title="open ? $t('voice.close') : $t('voice.title')"
        @click="togglePanel"
      >
        <Icon
          :name="open ? 'i-heroicons-x-mark' : 'i-heroicons-microphone'"
          size="20"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const INPUT_PLACEHOLDER = computed(() => t("voice.inputPlaceholder"));

const {
  state,
  transcript,
  interimTranscript,
  preview,
  confirmedTasks,
  error,
  start,
  stop,
  send,
  confirm,
  reset,
} = useVoiceAgent();

const open = ref(false);
const textInput = ref("");
const copied = ref(false);

const previewTasks = computed(() => preview.value?.tasks ?? []);
const newCategories = computed(() => preview.value?.newCategories ?? []);
const activeInput = computed(
  () => transcript.value.trim() || textInput.value.trim(),
);

function togglePanel() {
  open.value = !open.value;
  if (!open.value) {
    reset();
    textInput.value = "";
  }
}

function closePanel() {
  open.value = false;
  reset();
  textInput.value = "";
}

function toggleMic() {
  if (state.value === "listening") stop();
  else start();
}

function sendInput() {
  const input = transcript.value.trim() || textInput.value.trim();
  send(input);
}

function clearAll() {
  reset();
  textInput.value = "";
}

function backToEdit() {
  reset();
}

async function copyExample() {
  await navigator.clipboard.writeText(t("voice.exampleInput"));
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function priorityLabel(p: string): string {
  const map: Record<string, string> = {
    HIGH: t("shared.priorities.high"),
    MEDIUM: t("shared.priorities.medium"),
    LOW: t("shared.priorities.low"),
  };
  return map[p] ?? p;
}

function formatDate(iso: string): string {
  const { locale } = useI18n();
  return new Date(iso).toLocaleDateString(locale.value, {
    day: "2-digit",
    month: "short",
  });
}
</script>

<style scoped>
.voice-chat-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.fab {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(111, 175, 142, 0.4);
  transition: all 0.2s ease;
  align-self: flex-start;
}

.fab:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
}

.fab.recording {
  background: #e53e3e;
  animation: pulse 1.2s ease-in-out infinite;
}

.fab.processing {
  background: var(--color-primary);
  opacity: 0.7;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(229, 62, 62, 0);
  }
}

.voice-chat-panel {
  width: 340px;
  max-height: 500px;
  background: var(--color-surface);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted, #718096);
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-background);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  min-height: 120px;
}

.hint {
  font-size: 13px;
  color: var(--color-text-muted, #718096);
  line-height: 1.5;
}

.transcript-box {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.6;
  background: var(--color-background);
  border-radius: 8px;
  padding: var(--spacing-sm);
}

.interim {
  color: var(--color-text-muted, #718096);
}

.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-muted, #718096);
  font-size: 13px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border, #e2e8f0);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.preview-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.summary {
  font-size: 13px;
  color: var(--color-text-muted, #718096);
  margin-bottom: var(--spacing-xs);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.task-card {
  background: var(--color-background);
  border-radius: 8px;
  padding: var(--spacing-sm);
  border-left: 3px solid var(--color-primary);
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  flex: 1;
}

.priority-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
}

.priority-high {
  background: #fed7d7;
  color: #c53030;
}

.priority-medium {
  background: #fefcbf;
  color: #92400e;
}

.priority-low {
  background: #c6f6d5;
  color: #276749;
}

.task-desc {
  font-size: 12px;
  color: var(--color-text-muted, #718096);
  margin-top: 4px;
}

.task-meta {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  flex-wrap: wrap;
}

.category-chip,
.date-chip {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--color-text-muted, #718096);
  background: var(--color-surface);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 4px;
  padding: 2px 6px;
}

.done-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
  padding: var(--spacing-sm) 0;
}

.done-icon {
  color: var(--color-primary);
}

.done-area p {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.done-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.done-list li {
  font-size: 12px;
  color: var(--color-text-muted, #718096);
  padding: 4px 8px;
  background: var(--color-background);
  border-radius: 4px;
}

.textarea-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
  margin-bottom: 4px;
}

.textarea-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted, #718096);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.copy-example-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.copy-example-btn:hover {
  background: var(--color-background);
}

.preview-error {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #c53030;
  background: #fff5f5;
  border: 1px solid #fc8181;
  border-radius: 6px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.subtask-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.subtask-list li {
  font-size: 11px;
  color: var(--color-text-muted, #718096);
  padding-left: 12px;
  position: relative;
}

.subtask-list li::before {
  content: "·";
  position: absolute;
  left: 3px;
}

.text-input {
  width: 100%;
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.text-input:focus {
  border-color: var(--color-primary);
}

.mic-error {
  font-size: 11px;
  color: #c53030;
  margin-top: var(--spacing-xs);
}

.panel-footer {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-border, #e2e8f0);
  flex-wrap: wrap;
}

.mic-btn-sm,
.send-btn,
.reset-btn,
.cancel-btn,
.confirm-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mic-btn-sm {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border, #e2e8f0);
}

.mic-btn-sm.recording {
  background: #fed7d7;
  color: #c53030;
  border-color: #fc8181;
}

.send-btn,
.confirm-btn {
  background: var(--color-primary);
  color: #fff;
  margin-left: auto;
}

.send-btn:hover,
.confirm-btn:hover {
  background: var(--color-primary-dark);
}

.reset-btn {
  background: none;
  color: var(--color-text-muted, #718096);
  border: 1px solid var(--color-border, #e2e8f0);
}

.cancel-btn {
  background: none;
  color: var(--color-text-muted, #718096);
  border: 1px solid var(--color-border, #e2e8f0);
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.category-chip--new {
  background: #fefcbf;
  border-color: #f6e05e;
  color: #92400e;
}

.new-badge {
  font-size: 9px;
  font-weight: 700;
  background: #f6e05e;
  color: #744210;
  border-radius: 3px;
  padding: 1px 4px;
  margin-left: 3px;
  text-transform: uppercase;
}

.new-categories-box {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #92400e;
  background: #fefcbf;
  border: 1px solid #f6e05e;
  border-radius: 6px;
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-top: var(--spacing-xs);
  flex-wrap: wrap;
}

.error-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-sm);
}

.error-icon {
  color: #c53030;
}

.error-msg {
  font-size: 13px;
  color: #c53030;
  line-height: 1.5;
}
</style>
