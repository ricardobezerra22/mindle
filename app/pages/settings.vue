<template>
  <div class="settings-page">
    <div class="settings-container">
      <div class="settings-header">
        <h1 class="page-title">
          {{ $t("pages.settings") }}
        </h1>
        <p class="page-subtitle">
          {{ $t("settings.subtitle") }}
        </p>
      </div>

      <div class="settings-tabs">
        <button
          :class="['settings-tab', { active: settingsTab === 'preferences' }]"
          @click="settingsTab = 'preferences'"
        >
          <Icon
            name="lucide:sliders-horizontal"
            size="16"
          />
          {{ $t("settings.tabs.preferences") }}
        </button>
        <button
          :class="['settings-tab', { active: settingsTab === 'guidelines' }]"
          @click="settingsTab = 'guidelines'"
        >
          <Icon
            name="lucide:book-open"
            size="16"
          />
          {{ $t("settings.tabs.guide") }}
        </button>
        <button
          :class="['settings-tab', { active: settingsTab === 'assistance' }]"
          @click="settingsTab = 'assistance'"
        >
          <Icon
            name="lucide:life-buoy"
            size="16"
          />
          {{ $t("settings.tabs.support") }}
        </button>
      </div>

      <div
        v-if="settingsTab === 'preferences'"
        class="settings-grid"
      >
        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:target"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.focus.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.focus.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.focus.defaultDuration")
              }}</span>
              <span class="setting-description">{{
                $t("settings.focus.durationHint")
              }}</span>
            </div>
            <select
              v-model="preferences.focusDuration"
              class="setting-select"
            >
              <option
                v-for="opt in focusDurationOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.focus.autoPause")
              }}</span>
              <span class="setting-description">{{
                $t("settings.focus.autoPauseHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.autoBreak }]"
              @click="preferences.autoBreak = !preferences.autoBreak"
            >
              <span class="toggle-thumb" />
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.focus.sound")
              }}</span>
              <span class="setting-description">{{
                $t("settings.focus.soundHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.focusSound }]"
              @click="preferences.focusSound = !preferences.focusSound"
            >
              <span class="toggle-thumb" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:calendar-days"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.planning.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.planning.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.planning.weekStart")
              }}</span>
              <span class="setting-description">{{
                $t("settings.planning.weekStartHint")
              }}</span>
            </div>
            <select
              v-model="preferences.weekStart"
              class="setting-select"
            >
              <option
                v-for="opt in weekStartOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.planning.showTodayOnly")
              }}</span>
              <span class="setting-description">{{
                $t("settings.planning.showTodayOnlyHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.showOnlyToday }]"
              @click="preferences.showOnlyToday = !preferences.showOnlyToday"
            >
              <span class="toggle-thumb" />
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.planning.showCompleted")
              }}</span>
              <span class="setting-description">{{
                $t("settings.planning.showCompletedHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.showCompleted }]"
              @click="preferences.showCompleted = !preferences.showCompleted"
            >
              <span class="toggle-thumb" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:heart"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.habitsWellbeing.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.habitsWellbeing.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.habitsWellbeing.dailyReminder")
              }}</span>
              <span class="setting-description">{{
                $t("settings.habitsWellbeing.dailyReminderHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.dailyReminder }]"
              @click="preferences.dailyReminder = !preferences.dailyReminder"
            >
              <span class="toggle-thumb" />
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.habitsWellbeing.showInsights")
              }}</span>
              <span class="setting-description">{{
                $t("settings.habitsWellbeing.showInsightsHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.showInsights }]"
              @click="preferences.showInsights = !preferences.showInsights"
            >
              <span class="toggle-thumb" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:wallet"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.finance.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.finance.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.finance.dashboardReminder")
              }}</span>
              <span class="setting-description">{{
                $t("settings.finance.dashboardReminderHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.financeReminder }]"
              @click="
                preferences.financeReminder = !preferences.financeReminder
              "
            >
              <span class="toggle-thumb" />
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.finance.archivePaid")
              }}</span>
              <span class="setting-description">{{
                $t("settings.finance.archivePaidHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: preferences.autoArchivePaid }]"
              @click="
                preferences.autoArchivePaid = !preferences.autoArchivePaid
              "
            >
              <span class="toggle-thumb" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:sun"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.appearance.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.appearance.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.appearance.theme")
              }}</span>
              <span class="setting-description">{{
                $t("settings.appearance.themeHint")
              }}</span>
            </div>
            <select
              v-model="preferences.theme"
              class="setting-select"
            >
              <option
                v-for="opt in themeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.appearance.fontSize")
              }}</span>
              <span class="setting-description">{{
                $t("settings.appearance.fontSizeHint")
              }}</span>
            </div>
            <select
              v-model="preferences.fontSize"
              class="setting-select"
            >
              <option
                v-for="opt in fontSizeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:mail"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.notifications.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.notifications.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.notifications.dailySummary")
              }}</span>
              <span class="setting-description">{{
                $t("settings.notifications.dailySummaryHint")
              }}</span>
            </div>
            <button
              :class="['toggle', { active: emailNotifications }]"
              :disabled="emailLoading"
              @click="toggleEmailNotifications"
            >
              <span class="toggle-thumb" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:shield"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.data.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.data.subtitle") }}
              </p>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.data.export")
              }}</span>
              <span class="setting-description">{{
                $t("settings.data.exportHint")
              }}</span>
            </div>
            <button
              class="action-btn"
              :disabled="exporting"
              @click="exportData"
            >
              <Icon
                :name="exporting ? 'lucide:loader-2' : 'lucide:download'"
                size="16"
                :class="{ spinning: exporting }"
              />
              {{
                exporting
                  ? $t("settings.data.exporting")
                  : $t("settings.data.exportBtn")
              }}
            </button>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">{{
                $t("settings.data.clearCache")
              }}</span>
              <span class="setting-description">{{
                $t("settings.data.clearCacheHint")
              }}</span>
            </div>
            <button
              class="action-btn"
              @click="clearCache"
            >
              <Icon
                name="lucide:trash-2"
                size="16"
              />
              {{ $t("settings.data.clearBtn") }}
            </button>
          </div>
        </section>
      </div>

      <div
        v-if="settingsTab === 'guidelines'"
        class="guidelines-content"
      >
        <div class="guide-hero">
          <div class="guide-hero-icon">
            <Icon
              name="lucide:sparkles"
              size="28"
            />
          </div>
          <h2 class="guide-hero-title">
            {{ $t("settings.guide.welcome") }}
          </h2>
          <p class="guide-hero-text">
            {{ $t("settings.guide.welcomeDesc") }}
          </p>
        </div>

        <div class="guide-grid">
          <div
            v-for="feat in guideFeatures"
            :key="feat.key"
            class="guide-card"
          >
            <div
              class="guide-card-icon"
              :style="{ background: feat.bg, color: feat.color }"
            >
              <Icon
                :name="feat.icon"
                size="22"
              />
            </div>
            <h3 class="guide-card-title">
              {{ $t(`settings.guide.features.${feat.key}.title`) }}
            </h3>
            <p class="guide-card-text">
              {{ $t(`settings.guide.features.${feat.key}.desc`) }}
            </p>
            <div class="guide-card-tips">
              <span
                v-for="tag in getGuideFeatureTags(feat.key)"
                :key="tag"
                class="guide-tip"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div class="guide-philosophy">
          <Icon
            name="lucide:leaf"
            size="20"
          />
          <p>{{ $t("settings.guide.philosophy") }}</p>
        </div>
      </div>

      <div
        v-if="settingsTab === 'assistance'"
        class="assistance-content"
      >
        <section class="settings-section feedback-section">
          <div class="section-header">
            <Icon
              name="lucide:message-circle"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.support.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.support.emailHint") }}
              </p>
            </div>
          </div>

          <form
            class="feedback-form"
            @submit.prevent="sendFeedback"
          >
            <div class="feedback-field">
              <label
                for="feedback-subject"
                class="feedback-label"
                >{{ $t("settings.support.subjectLabel") }}</label
              >
              <input
                id="feedback-subject"
                v-model="feedbackSubject"
                type="text"
                class="feedback-input"
                :placeholder="$t('settings.support.subjectPlaceholder')"
                required
              />
            </div>

            <div class="feedback-field">
              <label
                for="feedback-message"
                class="feedback-label"
                >{{ $t("settings.support.messageLabel") }}</label
              >
              <textarea
                id="feedback-message"
                v-model="feedbackMessage"
                class="feedback-textarea"
                rows="4"
                :placeholder="$t('settings.support.messagePlaceholder')"
                required
              />
            </div>

            <UiButton
              type="submit"
              :disabled="sendingFeedback"
            >
              <Icon
                :name="sendingFeedback ? 'lucide:loader-2' : 'lucide:send'"
                size="16"
                :class="{ spinning: sendingFeedback }"
              />
              {{
                sendingFeedback
                  ? $t("settings.support.sendingBtn")
                  : $t("settings.support.sendBtn")
              }}
            </UiButton>
          </form>
        </section>

        <section class="settings-section">
          <div class="section-header">
            <Icon
              name="lucide:help-circle"
              size="20"
            />
            <div>
              <h2 class="section-title">
                {{ $t("settings.faq.title") }}
              </h2>
              <p class="section-hint">
                {{ $t("settings.faq.subtitle") }}
              </p>
            </div>
          </div>

          <div class="faq-list">
            <details
              v-for="(item, i) in faqItems"
              :key="i"
              class="faq-item"
            >
              <summary class="faq-question">
                {{ item.q }}
              </summary>
              <p class="faq-answer">
                {{ item.a }}
              </p>
            </details>
          </div>
        </section>

        <section class="about-section">
          <p class="app-name">Mindle</p>
          <p class="app-version">v1.0.0</p>
          <p class="app-philosophy">
            {{ $t("settings.about.desc") }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n();
const { preferences, fetchPreferences, debouncedSave } = usePreferences();
const { user } = useAuth();
const toast = useToast();
const settingsTab = ref<"preferences" | "guidelines" | "assistance">(
  "preferences",
);
const exporting = ref(false);
const emailNotifications = ref(true);
const emailLoading = ref(false);
const feedbackSubject = ref("");
const feedbackMessage = ref("");
const sendingFeedback = ref(false);

const focusDurationOptions = computed(() => [
  { label: t("settings.focusDurations.15"), value: "15" },
  { label: t("settings.focusDurations.30"), value: "30" },
  { label: t("settings.focusDurations.45"), value: "45" },
  { label: t("settings.focusDurations.60"), value: "60" },
  { label: t("settings.focusDurations.90"), value: "90" },
]);

const weekStartOptions = computed(() => [
  { label: t("settings.weekDays.monday"), value: "monday" },
  { label: t("settings.weekDays.sunday"), value: "sunday" },
]);

const themeOptions = computed(() => [
  { label: t("settings.appearance.themes.light"), value: "light" },
  { label: t("settings.appearance.themes.dark"), value: "dark" },
  { label: t("settings.appearance.themes.system"), value: "system" },
]);

const fontSizeOptions = computed(() => [
  { label: t("settings.appearance.fontSizes.small"), value: "small" },
  { label: t("settings.appearance.fontSizes.normal"), value: "normal" },
  { label: t("settings.appearance.fontSizes.large"), value: "large" },
]);

const guideFeatures = [
  {
    key: "tasks",
    icon: "lucide:check-square",
    bg: "#d1fae5",
    color: "#059669",
  },
  { key: "focus", icon: "lucide:target", bg: "#e0e7ff", color: "#4f46e5" },
  { key: "habits", icon: "lucide:heart", bg: "#fce7f3", color: "#db2777" },
  {
    key: "planner",
    icon: "lucide:calendar-days",
    bg: "#fef3c7",
    color: "#d97706",
  },
  {
    key: "projects",
    icon: "lucide:folder-kanban",
    bg: "#dbeafe",
    color: "#2563eb",
  },
  { key: "goals", icon: "lucide:trophy", bg: "#f3e8ff", color: "#7c3aed" },
  { key: "finance", icon: "lucide:wallet", bg: "#ccfbf1", color: "#0d9488" },
  {
    key: "metrics",
    icon: "lucide:bar-chart-3",
    bg: "#fee2e2",
    color: "#dc2626",
  },
];

const getFaqItems = (): { q: string; a: string }[] => {
  const { locale, messages } = useI18n();
  const currentLocale = locale.value as string;
  const localeMessages = messages[currentLocale] as Record<string, unknown>;
  if (!localeMessages) return [];

  const settings = localeMessages.settings as Record<string, unknown>;
  if (!settings) return [];

  const faq = settings.faq as Record<string, unknown>;
  if (!faq) return [];

  const items = faq.items;
  return Array.isArray(items) ? items : [];
};

const faqItems = computed(() => getFaqItems());

const getGuideFeatureTags = (featureKey: string): string[] => {
  const { locale, messages } = useI18n();
  const currentLocale = locale.value as string;
  const localeMessages = messages[currentLocale] as Record<string, unknown>;
  if (!localeMessages) return [];

  const settings = localeMessages.settings as Record<string, unknown>;
  if (!settings) return [];

  const guide = settings.guide as Record<string, unknown>;
  if (!guide) return [];

  const features = guide.features as Record<string, Record<string, unknown>>;
  if (!features) return [];

  const feature = features[featureKey];
  if (!feature) return [];

  const tags = feature.tags;
  return Array.isArray(tags) ? tags : [];
};

watch(
  preferences,
  () => {
    debouncedSave();
  },
  { deep: true },
);

const exportData = async () => {
  exporting.value = true;
  try {
    const [tasks, habits, habitLogs, finance] = await Promise.all([
      $fetch("/api/tasks"),
      $fetch("/api/habits"),
      $fetch("/api/habits/logs"),
      $fetch("/api/finance"),
    ]);
    console.log("tasks", tasks);
    const data = {
      exportedAt: new Date().toISOString(),
      tasks: tasks.success ? tasks.data : [],
      habits: habits.success ? habits.data : [],
      habitLogs: habitLogs.success ? habitLogs.data : [],
      finance: finance.success ? finance.data : [],
      preferences: preferences.value,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindle-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success({ title: t("settings.toasts.exported") });
  } catch (error) {
    console.error("Error exporting data:", error);
    toast.error({ title: t("settings.toasts.exportError") });
  } finally {
    exporting.value = false;
  }
};

const clearCache = () => {
  localStorage.clear();
  toast.info({ title: t("settings.toasts.cacheCleared") });
};

const sendFeedback = async () => {
  if (!feedbackSubject.value.trim() || !feedbackMessage.value.trim()) return;

  sendingFeedback.value = true;
  try {
    const response = await $fetch("/api/support", {
      method: "POST",
      body: {
        subject: feedbackSubject.value,
        message: feedbackMessage.value,
      },
    });
    if (response.success) {
      toast.success({
        title: t("settings.toasts.feedbackSent"),
        message: t("settings.toasts.feedbackThanks"),
      });
      feedbackSubject.value = "";
      feedbackMessage.value = "";
    }
  } catch {
    toast.error({ title: t("settings.toasts.feedbackError") });
  } finally {
    sendingFeedback.value = false;
  }
};

const toggleEmailNotifications = async () => {
  emailLoading.value = true;
  const newValue = !emailNotifications.value;
  try {
    const response = await $fetch("/api/user/email-notifications", {
      method: "PUT",
      body: { enabled: newValue },
    });
    if (response.success) {
      emailNotifications.value = newValue;
      toast.success({
        title: newValue
          ? t("settings.toasts.notifEnabled")
          : t("settings.toasts.notifDisabled"),
      });
    }
  } catch {
    toast.error({ title: t("settings.toasts.notifError") });
  } finally {
    emailLoading.value = false;
  }
};

onMounted(() => {
  fetchPreferences();
  if (user.value?.emailNotifications !== undefined) {
    emailNotifications.value = user.value.emailNotifications;
  }
});
</script>

<style scoped lang="css">
.settings-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.settings-container {
  max-width: 900px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: 1.5;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.settings-section {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.section-header > :deep(svg) {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.section-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 0 0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.setting-row + .setting-row {
  border-top: 1px solid var(--color-border);
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.setting-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.setting-select {
  width: 160px;
  flex-shrink: 0;
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7C7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.setting-select:focus {
  border-color: var(--color-primary);
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active .toggle-thumb {
  transform: translateX(20px);
}

.action-btn {
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

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.about-section {
  text-align: center;
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-md);
}

.app-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.app-version {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 var(--spacing-md) 0;
}

.app-philosophy {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 auto var(--spacing-lg) auto;
  max-width: 380px;
}

.feedback-section {
  grid-column: 1 / -1;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.feedback-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.feedback-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.feedback-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.feedback-input:focus {
  border-color: var(--color-primary);
}

.feedback-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.feedback-textarea:focus {
  border-color: var(--color-primary);
}

.settings-tabs {
  display: flex;
  gap: 4px;
  background: var(--color-background);
  padding: 4px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  width: fit-content;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.settings-tab.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.settings-tab:hover:not(.active) {
  color: var(--color-text-primary);
}

.guidelines-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.guide-hero {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.guide-hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary), #4e8a6d);
  border-radius: 16px;
  color: white;
  margin-bottom: var(--spacing-md);
}

.guide-hero-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.guide-hero-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.guide-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.guide-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.guide-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.guide-card-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.guide-card-tips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: var(--spacing-xs);
}

.guide-tip {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.guide-philosophy {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-lg);
}

.guide-philosophy :deep(svg) {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.guide-philosophy p {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.7;
  margin: 0;
}

.assistance-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 640px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
}

.faq-question {
  padding: var(--spacing-md) 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::before {
  content: "+";
  font-size: 18px;
  font-weight: 300;
  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
}

.faq-item[open] .faq-question::before {
  content: "−";
}

.faq-answer {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-md) 0;
  padding-left: 26px;
}

@media (max-width: 768px) {
  .settings-page {
    padding: var(--spacing-md);
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-select {
    width: 140px;
  }

  .settings-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
