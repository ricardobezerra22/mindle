<template>
  <div class="calendar-connect">
    <div
      v-if="calendarConnected"
      class="connected-state"
    >
      <div class="status-badge">
        <Icon
          name="lucide:check-circle"
          class="status-icon"
        />
        <span>{{ $t('settings.calendar.connected') }}</span>
      </div>
      <button
        class="disconnect-btn"
        :disabled="loading"
        @click="handleDisconnect"
      >
        <Icon
          :name="loading ? 'lucide:loader-2' : 'lucide:unlink'"
          :class="{ spinning: loading }"
        />
        {{ $t('settings.calendar.disconnect') }}
      </button>
    </div>

    <button
      v-else
      class="connect-btn"
      :disabled="loading"
      @click="connectCalendar"
    >
      <Icon name="lucide:calendar-plus" />
      {{ $t('settings.calendar.connect') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { calendarConnected, loading, disconnectCalendar, connectCalendar } = useCalendar();
const toast = useToast();
const { t } = useI18n();
const route = useRoute();

const handleDisconnect = async () => {
  try {
    await disconnectCalendar();
    toast.success({ title: t('settings.calendar.toasts.disconnected') });
  } catch {
    toast.error({ title: t('settings.calendar.toasts.disconnectError') });
  }
};

onMounted(() => {
  const status = route.query.calendar_status as string | undefined;
  const error = route.query.calendar_error as string | undefined;

  if (status === 'connected') {
    toast.success({ title: t('settings.calendar.toasts.connected') });
  } else if (error) {
    toast.error({ title: t('settings.calendar.toasts.connectError') });
  }
});
</script>

<style scoped>
.calendar-connect {
  display: flex;
  align-items: center;
}

.connected-state {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #2d7a4f;
}

.status-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.connect-btn,
.disconnect-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.connect-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.disconnect-btn:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

.connect-btn:disabled,
.disconnect-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.connect-btn :deep(svg),
.disconnect-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
