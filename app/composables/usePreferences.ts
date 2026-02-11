interface Preferences {
  focusDuration: string;
  autoBreak: boolean;
  focusSound: boolean;
  weekStart: string;
  showOnlyToday: boolean;
  showCompleted: boolean;
  dailyReminder: boolean;
  showInsights: boolean;
  financeReminder: boolean;
  autoArchivePaid: boolean;
  theme: string;
  fontSize: string;
}

const defaults: Preferences = {
  focusDuration: "30",
  autoBreak: false,
  focusSound: true,
  weekStart: "monday",
  showOnlyToday: false,
  showCompleted: true,
  dailyReminder: false,
  showInsights: true,
  financeReminder: true,
  autoArchivePaid: false,
  theme: "light",
  fontSize: "normal",
};

export const usePreferences = () => {
  const preferences = useState<Preferences>("user-preferences", () => ({ ...defaults }));
  const loading = useState<boolean>("prefs-loading", () => false);
  const loaded = useState<boolean>("prefs-loaded", () => false);

  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  const fetchPreferences = async () => {
    if (loaded.value) return;
    loading.value = true;
    try {
      const response = await $fetch<{ success: boolean; data: Preferences }>("/api/preferences");
      if (response.success) {
        const { id, userId, ...prefs } = response.data as any;
        Object.assign(preferences.value, prefs);
        loaded.value = true;
      }
    } catch {
      const saved = localStorage.getItem("mindle-preferences");
      if (saved) {
        Object.assign(preferences.value, JSON.parse(saved));
      }
    } finally {
      loading.value = false;
    }
  };

  const savePreferences = async () => {
    try {
      localStorage.setItem("mindle-preferences", JSON.stringify(preferences.value));
      await $fetch("/api/preferences", {
        method: "PUT",
        body: preferences.value,
      });
    } catch {
      console.error("Failed to save preferences to server");
    }
  };

  const debouncedSave = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savePreferences(), 800);
  };

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    preferences.value = { ...preferences.value, [key]: value };
    debouncedSave();
  };

  return {
    preferences,
    loading,
    loaded,
    fetchPreferences,
    savePreferences,
    updatePreference,
    debouncedSave,
  };
};
