<template>
  <div class="layout-default">
    <LayoutSidebar />

    <div class="layout-main">
      <LayoutHeader :title="pageTitle" />
      <SpeedInsights />
      <main class="layout-content">
        <slot />
      </main>
    </div>

    <AgentVoiceTaskChat />
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const route = useRoute();
const { init: initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

const { t } = useI18n();

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    "/": t("pages.home"),
    "/metrics": t("pages.metrics"),
    "/tasks": t("pages.tasks"),
    "/projects": t("pages.projects"),
    "/planner/week": t("pages.plannerWeek"),
    "/planner/month": t("pages.plannerMonth"),
    "/focus": t("pages.focus"),
    "/habits": t("pages.habits"),
    "/finance": t("pages.finance"),
    "/goals": t("pages.goals"),
    "/settings": t("pages.settings"),
  };
  if (map[route.path]) return map[route.path];
  if (route.path.startsWith("/goals/")) return t("pages.goals");
  return "Mindle";
});
</script>

<style scoped>
.layout-default {
  display: flex;
  height: 100vh;
  height: 100dvh;
  background-color: var(--color-background);
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-width: 0;
}

.layout-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}
</style>
