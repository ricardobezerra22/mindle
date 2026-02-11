<template>
  <div class="layout-default">
    <LayoutSidebar />

    <div class="layout-main">
      <LayoutHeader :title="pageTitle" />

      <main class="layout-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { init: initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/": "Início",
    "/metrics": "Métricas",
    "/tasks": "Tarefas",
    "/projects": "Projetos",
    "/planner/week": "Planner Semanal",
    "/planner/month": "Planner Mensal",
    "/focus": "Foco",
    "/habits": "Hábitos",
    "/finance": "Finanças",
    "/goals": "Metas",
    "/settings": "Configurações",
  };
  if (titles[route.path]) return titles[route.path];
  if (route.path.startsWith("/goals/")) return "Metas";
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
