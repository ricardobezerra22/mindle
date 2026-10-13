<template>
  <button
    class="calendar-event-card"
    @click="emit('click')"
    :title="event.title"
  >
    <div class="event-icon">
      <Icon name="lucide:calendar" />
    </div>
    <div class="event-content">
      <p class="event-title">
        {{ event.title }}
      </p>
      <p class="event-time">
        <template v-if="event.allDay">
          {{ $t('planner.allDay') }}
        </template>
        <template v-else>
          {{ formatTime(event.startTime) }} – {{ formatTime(event.endTime) }}
        </template>
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types';

const props = defineProps<{ event: CalendarEvent }>();
const emit = defineEmits<{ click: [] }>();
const { locale } = useI18n();

const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
</script>

<style scoped>
.calendar-event-card {
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  border-left: 3px solid #3b82f6;
  border-radius: 10px;
  padding: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
  background-color: #eef6ff;
}

.calendar-event-card:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.event-icon {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 1px;
}

.event-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  font-size: 11px;
  color: #3b82f6;
  margin: 0;
  font-weight: 500;
}
</style>
