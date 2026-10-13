import type { CalendarEvent } from "~/types";

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export const useCalendar = () => {
  const { user } = useAuth();
  const calendarEvents = ref<CalendarEvent[]>([]);
  const calendarConnected = computed({
    get: () => user.value?.calendarConnected ?? false,
    set: (val: boolean) => {
      if (user.value) user.value.calendarConnected = val;
    },
  });
  const loading = ref(false);

  const fetchCalendarEvents = async () => {
    loading.value = true;
    try {
      const response = await $fetch<APIResponse<CalendarEvent[]>>(
        "/api/calendar-events",
      );
      if (response.success) {
        calendarEvents.value = response.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const connectCalendar = () => {
    window.location.href = "/api/auth/google-calendar";
  };

  const disconnectCalendar = async () => {
    loading.value = true;
    try {
      const response = await $fetch<APIResponse<{ disconnected: boolean }>>(
        "/api/auth/google-calendar",
        { method: "DELETE" },
      );
      if (response.success) {
        calendarConnected.value = false;
        calendarEvents.value = [];
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    calendarEvents,
    calendarConnected,
    loading,
    fetchCalendarEvents,
    connectCalendar,
    disconnectCalendar,
  };
};
