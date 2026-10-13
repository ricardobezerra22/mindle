<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click.self="close"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ event?.title }}</h2>
        <button
          class="close-btn"
          @click="close"
        >
          <Icon name="lucide:x" />
        </button>
      </div>

      <div class="modal-body">
        <div class="event-details">
          <div class="detail-row">
            <label>{{ $t('planner.eventDate') }}</label>
            <span class="detail-value">{{ formatDate(event?.startTime) }}</span>
          </div>

          <div class="detail-row">
            <label>{{ $t('planner.eventTime') }}</label>
            <span class="detail-value">
              <template v-if="event?.allDay">
                {{ $t('planner.allDay') }}
              </template>
              <template v-else>
                {{ formatTime(event?.startTime) }} – {{ formatTime(event?.endTime) }}
              </template>
            </span>
          </div>

          <div
            v-if="event?.description"
            class="detail-row"
          >
            <label>{{ $t('planner.eventDescription') }}</label>
            <p class="detail-description">{{ event.description }}</p>
          </div>

          <div class="detail-row">
            <label>{{ $t('planner.eventCalendar') }}</label>
            <span class="detail-value calendar-badge">
              <Icon name="lucide:calendar" />
              Google Calendar
            </span>
          </div>

          <div class="detail-row">
            <label>{{ $t('planner.eventSyncedAt') }}</label>
            <span class="detail-value">{{ formatDateTime(event?.syncedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="close-btn-footer"
          @click="close"
        >
          {{ $t('shared.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types';

interface Props {
  modelValue: boolean;
  event: CalendarEvent | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const { locale } = useI18n();

const close = () => emit('update:modelValue', false);

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (date: Date | string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateTime = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, #eef6ff 0%, #f0f9ff 100%);
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  word-break: break-word;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background-color: rgba(31, 45, 43, 0.08);
  color: var(--color-text-primary);
}

.close-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: var(--spacing-lg);
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-row label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.detail-description {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  padding: var(--spacing-sm);
  background-color: var(--color-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.calendar-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: #eef6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-sm);
  color: #3b82f6;
  font-weight: 500;
  width: fit-content;
}

.calendar-badge :deep(svg) {
  width: 14px;
  height: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.close-btn-footer {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn-footer:hover {
  background-color: #5a9d7a;
  box-shadow: 0 4px 12px rgba(111, 175, 142, 0.2);
}

.close-btn-footer:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }

  .modal-content {
    max-width: 100%;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .detail-value {
    font-size: 13px;
  }

  .detail-description {
    font-size: 13px;
  }
}
</style>
